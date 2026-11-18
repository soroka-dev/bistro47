const mobileToggle = document.querySelector('.mobile-toggle');
const primaryNav = document.querySelector('.primary-nav');
mobileToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  mobileToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  primaryNav.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
}));

const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const bookingResult = document.querySelector('#booking-result');
const dateInput = bookingForm.elements.date;
dateInput.min = new Date().toLocaleDateString('en-CA');
document.querySelectorAll('[data-open-booking]').forEach(button => button.addEventListener('click', () => {
  bookingResult.hidden = true;
  bookingDialog.showModal();
}));
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const data = new FormData(bookingForm);
  const booking = Object.fromEntries(data.entries());
  const displayDate = new Date(`${booking.date}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  bookingResult.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = 'Запрос подготовлен';
  const details = document.createElement('div');
  details.textContent = `${booking.name}, ${displayDate} в ${booking.time}, гостей: ${booking.guests}.`;
  const note = document.createElement('div');
  note.textContent = 'Для подтверждения бронирования позвоните нам: ';
  const phone = document.createElement('a');
  phone.href = 'tel:+74951234567';
  phone.textContent = '+7 (495) 123-45-67';
  note.append(phone);
  bookingResult.append(heading, details, note);
  bookingResult.hidden = false;
  bookingForm.reset();
});

const menuData = {
  main: [
    { name: 'Стейк с зеленью и соусом', detail: 'Авторская подача основного блюда', image: 'assets/steak.jpg' }
  ],
  pasta: [
    { name: 'Тальятелле с трюфелем', detail: 'Паста с пармезаном и ароматом трюфеля', image: 'assets/pasta.jpg' }
  ],
  dessert: [
    { name: 'Шоколадный фондан', detail: 'Десерт с ягодами и тёплым шоколадом', image: 'assets/dessert.jpg' }
  ]
};
const menuDialog = document.querySelector('#menu-dialog');
const menuPanel = document.querySelector('#menu-panel');
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectMenu(category) {
  tabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.tab === category)));
  menuPanel.replaceChildren(...menuData[category].map(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = '';
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.name;
    const detail = document.createElement('p');
    detail.textContent = item.detail;
    copy.append(title, detail);
    row.append(image, copy);
    return row;
  }));
}
document.querySelector('[data-open-menu]').addEventListener('click', () => { selectMenu('main'); menuDialog.showModal(); });
document.querySelectorAll('[data-menu-category]').forEach(card => card.addEventListener('click', () => { selectMenu(card.dataset.menuCategory); menuDialog.showModal(); }));
tabs.forEach(tab => tab.addEventListener('click', () => selectMenu(tab.dataset.tab)));

const gallery = [
  { src: 'assets/bar.jpg', alt: 'Подсвеченные полки бара' },
  { src: 'assets/salmon.jpg', alt: 'Филе лосося с зеленью' },
  { src: 'assets/interior.jpg', alt: 'Интерьер ресторана' },
  { src: 'assets/cocktail.jpg', alt: 'Авторский коктейль' },
  { src: 'assets/lights.jpg', alt: 'Стеклянные светильники ресторана' }
];
const galleryDialog = document.querySelector('#gallery-dialog');
const galleryImage = document.querySelector('#gallery-large');
const galleryCount = document.querySelector('#gallery-count');
let galleryIndex = 0;
function showGallery(index) {
  galleryIndex = (index + gallery.length) % gallery.length;
  galleryImage.src = gallery[galleryIndex].src;
  galleryImage.alt = gallery[galleryIndex].alt;
  galleryCount.textContent = `${galleryIndex + 1} / ${gallery.length}`;
}
document.querySelectorAll('[data-open-gallery]').forEach(button => button.addEventListener('click', () => {
  showGallery(Number(button.dataset.openGallery));
  galleryDialog.showModal();
}));
document.querySelector('#gallery-prev').addEventListener('click', () => showGallery(galleryIndex - 1));
document.querySelector('#gallery-next').addEventListener('click', () => showGallery(galleryIndex + 1));
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showGallery(galleryIndex - 1);
  if (event.key === 'ArrowRight') showGallery(galleryIndex + 1);
});

document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));

const reviews = [
  { name: 'Алексей К.', image: 'assets/avatar-1.jpg', text: 'Отличная кухня, приятная атмосфера и внимательный персонал. Обязательно вернусь!' },
  { name: 'Мария С.', image: 'assets/avatar-2.jpg', text: 'Уютное место, вкусные блюда и стильный интерьер. Идеально для ужина.' },
  { name: 'Дмитрий В.', image: 'assets/avatar-3.jpg', text: 'Один из лучших ресторанов в городе. Качество, сервис и атмосфера — на высоте!' },
  { name: 'Анна П.', image: 'assets/avatar-4.jpg', text: 'Красивый интерьер и очень тёплая атмосфера. Провели замечательный вечер.' },
  { name: 'Игорь М.', image: 'assets/avatar-5.jpg', text: 'Понравилась барная карта и внимательное обслуживание. Вернёмся ещё.' }
];
const reviewTrack = document.querySelector('#reviews-track');
reviews.forEach(review => {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.innerHTML = `<div class="review-top"><img class="review-avatar" alt=""><div><div class="review-name"></div><div class="stars" aria-label="5 из 5 звёзд">★★★★★</div></div></div><p></p>`;
  card.querySelector('.review-avatar').src = review.image;
  card.querySelector('.review-name').textContent = review.name;
  card.querySelector('p').textContent = review.text;
  reviewTrack.append(card);
});
let reviewIndex = 0;
function visibleReviews() { return window.innerWidth <= 420 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
function updateReviews() {
  const visible = visibleReviews();
  reviewIndex = Math.min(reviewIndex, reviews.length - visible);
  const card = reviewTrack.querySelector('.review-card');
  const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
  reviewTrack.style.transform = `translateX(-${reviewIndex * (card.getBoundingClientRect().width + gap)}px)`;
  document.querySelector('#review-prev').disabled = reviewIndex === 0;
  document.querySelector('#review-next').disabled = reviewIndex >= reviews.length - visible;
}
document.querySelector('#review-prev').addEventListener('click', () => { reviewIndex--; updateReviews(); });
document.querySelector('#review-next').addEventListener('click', () => { reviewIndex++; updateReviews(); });
window.addEventListener('resize', updateReviews);
updateReviews();
