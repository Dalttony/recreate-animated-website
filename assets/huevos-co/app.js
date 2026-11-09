import { renderCarton } from './carton.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (number, min = 0, max = 1) => Math.min(max, Math.max(min, number));
const lerp = (start, end, progress) => start + (end - start) * progress;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Illustrative retail amounts in Colombian pesos, not a live currency conversion.
const priceLists = { brown: { 6: 4800, 10: 7800, 12: 9000 }, white: { 6: 3600, 10: 5800, 12: 6900 } };
const colourNames = { brown: 'marrones', white: 'blancos' };
const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0, maximumFractionDigits: 0
});
const money = amount => `${copFormatter.format(amount)} COP`;
let colour = 'brown';
let packColour = 'brown';
let basket = [];
try {
  const stored = JSON.parse(localStorage.getItem('yolk-co-basket') || '[]');
  if (Array.isArray(stored)) basket = stored.filter(item =>
    ['brown', 'white'].includes(item.colour) && [6, 10, 12].includes(item.count) &&
    Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20
  );
} catch { /* A blocked or empty local store should never prevent browsing. */ }

function renderProducts(animate = false) {
  $('#products').innerHTML = [6, 10, 12].map(count => `
    <article class="product-card${animate ? ' switching' : ''}" data-count="${count}">
      <div class="product-art">${renderCarton({ count, color: colour, id: `product-${colour}-${count}` })}</div>
      <h3 class="product-title">Huevos ${colourNames[colour]}, caja de ${count}</h3>
      <div class="product-bottom"><span class="product-price">${money(priceLists[colour][count])}</span>
        <button class="button button-yellow" data-buy="${count}" aria-label="Comprar ${count} huevos ${colourNames[colour]}">Comprar <span aria-hidden="true">↗</span></button>
      </div>
    </article>`).join('');
  $$('[data-color]').forEach(button => {
    const active = button.dataset.color === colour;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active);
  });
  measure();
}

function selectColour(next) {
  if (!['brown', 'white'].includes(next) || colour === next) return;
  colour = next;
  renderProducts(true);
  selectPackColour(next);
}

function selectPackColour(next) {
  packColour = next;
  $('#packaging-carton').innerHTML = renderCarton({ count: 10, color: packColour, id: 'pack-preview', animated: true });
  $$('[data-pack-color]').forEach(button => {
    const active = button.dataset.packColor === packColour;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active);
  });
  requestMotion();
}

function persistBasket() {
  try { localStorage.setItem('yolk-co-basket', JSON.stringify(basket)); } catch { /* In-memory basket remains usable. */ }
  const quantity = basket.reduce((sum, item) => sum + item.quantity, 0);
  $('[data-cart-count]').textContent = quantity;
  $('[data-open-cart]').hidden = quantity === 0;
  $('[data-open-cart]').setAttribute('aria-label', `Abrir cesta, ${quantity} ${quantity === 1 ? 'caja' : 'cajas'}`);
}

function renderBasket() {
  const content = $('.basket-content');
  const summary = $('.basket-summary');
  if (!basket.length) {
    content.innerHTML = '<div class="basket-empty"><span class="scribble" aria-hidden="true">¡Hola, huevito!</span><p>Tu cesta está esperando unos buenos huevos.</p><button class="button button-yellow" data-continue-shopping>Elige tu empaque <span aria-hidden="true">↗</span></button></div>';
    summary.innerHTML = '';
    return;
  }
  content.innerHTML = basket.map((item, index) => `
    <article class="basket-item">
      <div class="basket-item-art">${renderCarton({ count: item.count, color: item.colour, id: `basket-${index}` })}</div>
      <div><h3>Huevos ${colourNames[item.colour]} · Caja de ${item.count}</h3><p>${money(priceLists[item.colour][item.count])} por caja</p>
        <div class="quantity-controls"><button data-quantity="${index}" data-change="-1" aria-label="Quitar una caja de ${item.count} huevos ${colourNames[item.colour]}">−</button><span aria-label="Cantidad: ${item.quantity}">${item.quantity}</span><button data-quantity="${index}" data-change="1" aria-label="Añadir una caja de ${item.count} huevos ${colourNames[item.colour]}" ${item.quantity >= 20 ? 'disabled' : ''}>+</button></div>
      </div>
      <button class="remove-item" data-remove="${index}" aria-label="Eliminar la caja de ${item.count} huevos ${colourNames[item.colour]} de la cesta">×</button>
    </article>`).join('');
  const total = basket.reduce((sum, item) => sum + priceLists[item.colour][item.count] * item.quantity, 0);
  summary.innerHTML = `<div class="basket-total"><span>Subtotal</span><span>${money(total)}</span></div><button class="button button-yellow" data-review-order>Revisar pedido <span aria-hidden="true">↗</span></button>`;
}

function addToBasket(count) {
  const existing = basket.find(item => item.colour === colour && item.count === count);
  if (existing && existing.quantity < 20) existing.quantity += 1;
  else if (!existing) basket.push({ count, colour, quantity: 1 });
  else { toast('Puedes añadir hasta 20 cajas de cada presentación.'); return; }
  persistBasket();
  renderBasket();
  openDialog($('#basket-dialog'));
}

let previousFocus;
function openDialog(dialog) {
  if (dialog.open) return;
  previousFocus = document.activeElement;
  dialog.showModal();
  $('button', dialog)?.focus({ preventScroll: true });
}
function closeDialog(dialog) {
  dialog.close();
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  requestMotion();
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
  });
  dialog.addEventListener('cancel', () => requestMotion());
});

let toastTimer;
function toast(message) {
  $('.toast').textContent = message;
  $('.toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('.toast').classList.remove('visible'), 3500);
}

function showInfo(title, message) {
  $('#info-title').textContent = title;
  $('.info-copy').textContent = message;
  openDialog($('#info-dialog'));
}

const tourViews = [
  { source: './assets/farm-exterior.webp', caption: 'Un lugar para crecer.', alt: 'Vista ilustrativa de una granja avícola abierta, con un silo y campos a su alrededor.' },
  { source: './assets/farm-interior.webp', caption: 'Aquí empiezan las buenas mañanas.', alt: 'Vista ilustrativa de un gallinero iluminado por el sol, con gallinas y un pasillo central.' }
];
let tourIndex = 0;
function renderTour() {
  const view = tourViews[tourIndex];
  $('.tour-image').src = view.source;
  $('.tour-image').alt = view.alt;
  $('.tour-caption').textContent = view.caption;
  $('.tour-counter').textContent = `${tourIndex + 1} / ${tourViews.length}`;
}
$('#tour-dialog').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  tourIndex = (tourIndex + (event.key === 'ArrowRight' ? 1 : -1) + tourViews.length) % tourViews.length;
  renderTour();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button, a');
  if (!button) return;
  if (button.matches('[data-color]')) selectColour(button.dataset.color);
  if (button.matches('[data-shop-color]')) selectColour(button.dataset.shopColor);
  if (button.matches('[data-pack-color]')) selectPackColour(button.dataset.packColor);
  if (button.matches('[data-buy]')) addToBasket(Number(button.dataset.buy));
  if (button.matches('[data-open-cart]')) { renderBasket(); openDialog($('#basket-dialog')); }
  if (button.matches('[data-close-dialog]')) closeDialog(button.closest('dialog'));
  if (button.matches('[data-continue-shopping]')) { closeDialog($('#basket-dialog')); $('#shop').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' }); }
  if (button.matches('[data-remove]')) {
    basket.splice(Number(button.dataset.remove), 1);
    persistBasket(); renderBasket();
    $('[data-close-dialog]', $('#basket-dialog')).focus({ preventScroll: true });
  }
  if (button.matches('[data-quantity]')) {
    const index = Number(button.dataset.quantity);
    basket[index].quantity += Number(button.dataset.change);
    if (basket[index].quantity <= 0) basket.splice(index, 1);
    persistBasket(); renderBasket();
    const nextFocus = $(`[data-quantity="${index}"][data-change="${button.dataset.change}"]:not(:disabled)`, $('#basket-dialog')) || $(`[data-quantity="${index}"][data-change="-1"]`, $('#basket-dialog')) || $('[data-close-dialog]', $('#basket-dialog'));
    nextFocus?.focus({ preventScroll: true });
  }
  if (button.matches('[data-review-order]')) {
    const summary = basket.map(item => `${item.quantity} × caja de ${item.count} huevos ${colourNames[item.colour]}`).join('\n');
    const total = basket.reduce((sum, item) => sum + priceLists[item.colour][item.count] * item.quantity, 0);
    closeDialog($('#basket-dialog'));
    showInfo('¡Buena elección!', `${summary}\n\nSubtotal: ${money(total)}\n\nEsta es una demostración interactiva. Tu cesta se guarda en este navegador. No se ha enviado ningún pedido ni se ha realizado un pago.`);
  }
  if (button.matches('[data-tour-start]')) {
    tourIndex = Number(button.dataset.tourStart);
    renderTour(); openDialog($('#tour-dialog'));
  }
  if (button.matches('[data-tour-prev], [data-tour-next]')) {
    tourIndex = (tourIndex + (button.matches('[data-tour-next]') ? 1 : -1) + tourViews.length) % tourViews.length;
    renderTour();
  }
  if (button.matches('[data-pack-step]')) {
    const progress = [.02, .52, .94][Number(button.dataset.packStep)];
    const section = $('#packaging');
    const available = section.offsetHeight - innerHeight;
    const top = section.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + available * progress, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  if (button.matches('[data-social]')) showInfo('Un pequeño saludo.', `El botón de ${button.dataset.social} forma parte de esta demostración de Huevos Co. No hay una cuenta de redes sociales enlazada.`);
  if (button.matches('[data-contact]')) showInfo('Conversemos.', 'Huevos Co. es una marca de demostración basada en la página del video de referencia. Los datos de contacto son ilustrativos; no se enviará ningún mensaje.');
  if (button.matches('[data-about]')) showInfo('Sobre esta página.', 'Una recreación de la página del video de referencia, adaptada a Huevos Co. La gallina y las imágenes de la granja se recrearon con Imagegen. Los huevos y empaques son ilustraciones generadas mediante código. Los precios son valores de demostración en pesos colombianos (COP).');
});

// The same eggs travel from the hero into the comparison. The selected shell
// then falls into the centre pack, following the object continuity in the film.
// All geometry is measured in document coordinates so reverse scrolling and resizing are safe.
const eggs = $('.travel-eggs');
const brownTraveller = $('.egg-jump-brown', eggs);
const whiteTraveller = $('.egg-jump-white', eggs);
const landingLip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
landingLip.classList.add('egg-landing-rim');
landingLip.setAttribute('viewBox', '0 0 640 500');
landingLip.setAttribute('aria-hidden', 'true');
document.body.append(landingLip);
let geometry;
let motionQueued = false;
let currentPackStep = -1;
function docRect(element) {
  const bounds = element.getBoundingClientRect();
  return { x: bounds.left + scrollX, y: bounds.top + scrollY, width: bounds.width, height: bounds.height };
}
function measure() {
  if (geometry?.landing) geometry.landing.egg.style.removeProperty('opacity');
  const receivingCarton = $('.product-card[data-count="10"] .carton-open');
  const receivingShell = receivingCarton && $('[data-egg-slot="front-2"] .carton-egg-shell', receivingCarton);
  let landing = null;
  if (receivingShell) {
    const defs = $('defs', receivingCarton);
    const lip = $('.carton-front-lip', receivingCarton);
    // Give the overlay its own paint IDs, including after a colour switch.
    landingLip.innerHTML = `${defs.outerHTML}${lip.outerHTML}`
      .replace(/id="([^"]+)"/g, (_, id) => `id="landing-${id}"`)
      .replace(/url\(#([^)]*)\)/g, (_, id) => `url(#landing-${id})`);
    landing = {
      shell: docRect(receivingShell),
      carton: docRect(receivingCarton),
      egg: receivingShell.closest('.carton-egg')
    };
  }
  geometry = {
    hero: docRect($('.hero-dock')),
    comparison: docRect($('.comparison-dock')),
    heroHeight: $('.hero').offsetHeight,
    packaging: docRect($('#packaging')),
    farm: docRect($('#farm')),
    landing
  };
  requestMotion();
}
function requestMotion() {
  if (motionQueued) return;
  motionQueued = true;
  requestAnimationFrame(updateMotion);
}
function updateMotion() {
  motionQueued = false;
  if (!geometry) return;
  const sy = window.scrollY;
  const { hero, comparison, heroHeight, packaging, farm, landing } = geometry;
  let travel = clamp((sy - heroHeight * .22) / (heroHeight * .68));
  if (reducedMotion.matches) travel = sy > heroHeight * .6 ? 1 : 0;
  else travel = travel * travel * (3 - 2 * travel);
  const width = lerp(hero.width, comparison.width, travel);
  const height = lerp(hero.height, comparison.height, travel);
  eggs.style.setProperty('--egg-x', `${lerp(hero.x, comparison.x, travel)}px`);
  eggs.style.setProperty('--egg-y', `${lerp(hero.y, comparison.y, travel) - sy}px`);
  eggs.style.setProperty('--egg-width', `${width}px`);
  eggs.style.setProperty('--egg-height', `${height}px`);
  brownTraveller.style.transform = `rotate(${lerp(-8, -3, travel)}deg)`;
  whiteTraveller.style.transform = `rotate(${lerp(9, 3, travel)}deg)`;
  $('.egg', brownTraveller).style.opacity = '1';
  $('.egg', whiteTraveller).style.opacity = '1';
  landingLip.style.visibility = 'hidden';
  let handoff = 0;
  let fall = 0;
  if (landing && !reducedMotion.matches) {
    const sourceWidth = comparison.width * .43;
    const sourceHeight = sourceWidth / .72;
    const sourceBottom = comparison.y + comparison.height;
    const sourceX = comparison.x + (colour === 'brown' ? sourceWidth / 2 : comparison.width - sourceWidth / 2);
    const targetX = landing.shell.x + landing.shell.width / 2;
    const targetBottom = landing.shell.y + landing.shell.height;
    const startScroll = sourceBottom - innerHeight * .58;
    const endScroll = Math.max(startScroll + innerHeight * .45, targetBottom - innerHeight * .75);
    fall = clamp((sy - startScroll) / (endScroll - startScroll));
    const settled = clamp((sy - endScroll) / Math.max(45, innerHeight * .11));
    handoff = clamp((settled - .35) / .65);
    if (fall > 0) {
      const actor = colour === 'brown' ? brownTraveller : whiteTraveller;
      const drift = 1 - (1 - fall) ** 2;
      const targetViewportBottom = targetBottom - endScroll;
      let screenBottom = lerp(innerHeight * .58, targetViewportBottom, fall ** 1.55);
      if (fall === 1) screenBottom = targetBottom - sy;
      const bounce = Math.sin(settled * Math.PI) * Math.min(8, landing.shell.height * .13);
      screenBottom -= bounce;
      const x = lerp(sourceX, targetX, drift);
      const sx = lerp(1, landing.shell.width / sourceWidth, fall) * (1 + Math.sin(settled * Math.PI) * .045);
      const syScale = lerp(1, landing.shell.height / sourceHeight, fall) * (1 - Math.sin(settled * Math.PI) * .06);
      const initialAngle = colour === 'brown' ? -3 : 3;
      const angle = lerp(initialAngle, 0, fall) + Math.sin(fall * Math.PI) * (colour === 'brown' ? 11 : -11);
      actor.style.transform = `translate3d(${x - sourceX}px, ${screenBottom - (sourceBottom - sy)}px, 0) rotate(${angle}deg) scale(${sx}, ${syScale})`;
      $('.egg', actor).style.opacity = String(1 - handoff);
      landing.egg.style.opacity = String(handoff);
      // The original carton rim covers the lower part of the incoming shell.
      if (fall > .6 && handoff < 1) {
        landingLip.style.transform = `translate3d(${landing.carton.x}px, ${landing.carton.y - sy}px, 0)`;
        landingLip.style.width = `${landing.carton.width}px`;
        landingLip.style.height = `${landing.carton.height}px`;
        landingLip.style.visibility = 'visible';
      }
    } else {
      landing.egg.style.opacity = '1';
    }
  } else if (landing) {
    landing.egg.style.opacity = '1';
  }
  eggs.style.setProperty('--drop-progress', String(fall));
  const comparisonGone = comparison.y + comparison.height - sy < -40;
  const fallDone = !landing || reducedMotion.matches || handoff === 1;
  eggs.style.visibility = (comparisonGone && fallDone) || sy < -10 ? 'hidden' : 'visible';
  eggs.classList.add('ready');
  const packProgress = clamp((sy - packaging.y) / Math.max(1, packaging.height - innerHeight));
  const close = clamp((packProgress - .16) / .32);
  const seal = clamp((packProgress - .68) / .18);
  $('.carton--animated')?.style.setProperty('--close', close.toFixed(4));
  $('.carton--animated')?.style.setProperty('--seal', seal.toFixed(4));
  $('.packaging-art').style.setProperty('--sticker-opacity', clamp((packProgress - .65) / .18));
  const step = packProgress < .34 ? 0 : packProgress < .73 ? 1 : 2;
  if (step !== currentPackStep) {
    currentPackStep = step;
    $$('.pack-steps li').forEach((item, index) => {
      item.classList.toggle('active', index === step);
      item.classList.toggle('passed', index < step);
      const button = $('button', item);
      if (index === step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
  const farmEntry = clamp((sy + innerHeight - farm.y - 130) / Math.min(innerHeight * .75, 600));
  const slide = reducedMotion.matches ? 0 : lerp(Math.min(innerWidth * .21, 260), 0, farmEntry);
  $('.photo-left').style.setProperty('--farm-slide', `${-slide}px`);
  $('.photo-right').style.setProperty('--farm-slide', `${slide}px`);
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}, { threshold: .15, rootMargin: '0px 0px -25px 0px' });
$$('.reveal').forEach(element => observer.observe(element));
renderProducts();
selectPackColour('brown');
persistBasket();
window.addEventListener('scroll', requestMotion, { passive: true });
window.addEventListener('resize', measure, { passive: true });
window.addEventListener('load', measure, { once: true });
reducedMotion.addEventListener('change', measure);
new ResizeObserver(measure).observe(document.body);
document.fonts.ready.then(measure);
measure();
