'use strict';

const content = window.KKN_CONTENT;
const timeZone = 'Asia/Makassar';
const dateParts = Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).map(part => [part.type, part.value])
);
const today = dateParts.year + '-' + dateParts.month + '-' + dateParts.day;
const currentYear = Number(dateParts.year);
const currentMonth = Number(dateParts.month) - 1;
let newsCategory = 'Semua';
let calendarYear = currentYear;
let calendarMonth = currentMonth;
let selectedDate = null;
let galleryIndex = 0;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(date, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('id-ID', { ...options, timeZone })
    .format(new Date(date + 'T12:00:00+08:00'));
}

function externalLink(url, text, className) {
  const link = element('a', className, text);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function emptyState(title, description) {
  const box = element('div', 'empty-state');
  box.append(element('strong', '', title), element('p', '', description));
  return box;
}

function renderNews() {
  const query = document.querySelector('#news-search').value.trim().toLocaleLowerCase('id');
  const items = content.news.filter(item => {
    const matchesCategory = newsCategory === 'Semua' || item.category === newsCategory;
    const searchableText = [item.title, item.summary, item.category].join(' ').toLocaleLowerCase('id');
    return item.date <= today && matchesCategory && searchableText.includes(query);
  }).sort((first, second) => second.date.localeCompare(first.date));
  const grid = document.querySelector('#news-grid');
  grid.replaceChildren();
  document.querySelector('#news-results').textContent = items.length + ' berita ditemukan.';

  if (items.length === 0) {
    const box = emptyState('Berita belum ditemukan.', 'Coba kata kunci lain atau pilih semua kategori.');
    const reset = element('button', '', 'Tampilkan semua berita');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      document.querySelector('#news-search').value = '';
      setNewsCategory('Semua');
    });
    box.append(reset);
    grid.append(box);
    return;
  }

  items.forEach((item, index) => {
    const card = element('article', 'news-card' + (index === 0 ? ' featured' : ''));
    const photoButton = element('button', 'news-image-button');
    photoButton.type = 'button';
    photoButton.dataset.newsId = item.id;
    photoButton.setAttribute('aria-label', 'Baca berita ' + item.title);
    const photo = element('img');
    photo.src = item.image;
    photo.alt = item.imageAlt;
    photo.loading = 'lazy';
    photo.width = 900;
    photo.height = 600;
    photoButton.append(photo);

    const text = element('div', 'news-content');
    const meta = element('div', 'news-meta');
    const date = element('time', '', formatDate(item.date, { day: 'numeric', month: 'short', year: 'numeric' }));
    date.dateTime = item.date;
    meta.append(element('span', '', item.category), date);
    const heading = element('h3');
    const titleButton = element('button', 'news-title-button', item.title);
    titleButton.type = 'button';
    titleButton.dataset.newsId = item.id;
    heading.append(titleButton);
    const readButton = element('button', 'text-link', 'Baca berita');
    readButton.type = 'button';
    readButton.dataset.newsId = item.id;
    readButton.setAttribute('aria-label', 'Baca berita ' + item.title);
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    readButton.append(arrow);
    text.append(meta, heading, element('p', '', item.summary), readButton);
    card.append(photoButton, text);
    grid.append(card);
  });
}

function setNewsCategory(category) {
  newsCategory = category;
  document.querySelectorAll('#news-filters button').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderNews();
}

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

function openArticle(id) {
  const article = content.news.find(item => item.id === id);
  if (!article) return;
  const dialog = document.querySelector('#article-dialog');
  const photo = document.querySelector('#article-image');
  photo.src = article.image;
  photo.alt = article.imageAlt;
  document.querySelector('#article-meta').textContent = article.category + ' · ' + formatDate(article.date);
  document.querySelector('#article-title').textContent = article.title;
  const paragraphs = document.querySelector('#article-paragraphs');
  paragraphs.replaceChildren(...article.paragraphs.map(text => element('p', '', text)));
  const sources = document.querySelector('#article-sources');
  sources.replaceChildren(
    externalLink(article.source, 'Baca sumber berita · ' + article.sourceName + ' ↗'),
    externalLink(article.photoSource, 'Sumber foto · ' + article.photoSourceName + ' ↗')
  );
  openDialog(dialog);
  dialog.scrollTop = 0;
}

function renderAnnouncements() {
  const filter = document.querySelector('#announcement-filter').value;
  const items = content.announcements.filter(item => {
    if (item.date > today) return false;
    const active = !item.expires || item.expires >= today;
    return filter === 'all' || (filter === 'active' && active) || (filter === 'archive' && !active);
  }).sort((first, second) => second.date.localeCompare(first.date));
  const list = document.querySelector('#announcements-list');
  list.replaceChildren();
  document.querySelector('#announcement-count').textContent = items.length + ' pengumuman';

  if (items.length === 0) {
    const box = emptyState('Belum ada pengumuman' + (filter === 'active' ? ' aktif.' : '.'), 'Pilih arsip untuk melihat pengumuman periode sebelumnya.');
    const showArchive = element('button', '', 'Lihat arsip pengumuman');
    showArchive.type = 'button';
    showArchive.addEventListener('click', () => {
      document.querySelector('#announcement-filter').value = 'archive';
      renderAnnouncements();
    });
    box.append(showArchive);
    list.append(box);
    return;
  }

  items.forEach(item => {
    const active = !item.expires || item.expires >= today;
    const link = externalLink(item.url, undefined, 'announcement-item');
    link.setAttribute('aria-label', item.title + ', ' + (active ? 'aktif' : 'arsip') + ', buka sumber di tab baru');
    const stamp = element('time', 'date-stamp');
    stamp.dateTime = item.date;
    stamp.append(
      element('strong', '', formatDate(item.date, { day: '2-digit' })),
      element('span', '', formatDate(item.date, { month: 'short' }))
    );
    const body = element('div');
    const meta = element('div', 'announcement-meta');
    meta.append(
      element('span', '', item.category + ' · ' + item.date.slice(0, 4)),
      element('span', 'status-tag' + (active ? ' is-active' : ''), active ? 'Aktif' : 'Arsip')
    );
    const arrow = element('span', 'item-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    body.append(meta, element('h3', '', item.title), element('p', '', item.summary));
    link.append(stamp, body, arrow);
    list.append(link);
  });
}

function calendarMonthKey() {
  return calendarYear + '-' + String(calendarMonth + 1).padStart(2, '0');
}

function renderCalendar() {
  const key = calendarMonthKey();
  const title = formatDate(key + '-01', { month: 'long', year: 'numeric' });
  document.querySelector('#calendar-month').textContent = title;
  const body = document.querySelector('#calendar-body');
  body.replaceChildren();
  const firstWeekday = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const rows = Math.ceil((firstWeekday + daysInMonth) / 7);
  const eventDays = new Set(content.events.map(event => event.date));

  for (let row = 0; row < rows; row += 1) {
    const tr = element('tr');
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const td = element('td');
      const day = row * 7 + weekday - firstWeekday + 1;
      if (day > 0 && day <= daysInMonth) {
        const date = key + '-' + String(day).padStart(2, '0');
        const hasEvent = eventDays.has(date);
        const button = element('button', 'calendar-day', day);
        button.type = 'button';
        button.dataset.date = date;
        button.classList.toggle('is-today', date === today);
        button.classList.toggle('selected', date === selectedDate);
        button.classList.toggle('has-event', hasEvent);
        button.setAttribute('aria-pressed', String(date === selectedDate));
        button.setAttribute('aria-label', formatDate(date) + (hasEvent ? ', ada agenda' : ''));
        if (date === today) button.setAttribute('aria-current', 'date');
        td.append(button);
      }
      tr.append(td);
    }
    body.append(tr);
  }
  document.querySelector('#calendar-all').hidden = selectedDate === null;
  renderAgenda();
}

function renderAgenda() {
  const key = calendarMonthKey();
  const events = content.events.filter(event => selectedDate ? event.date === selectedDate : event.date.startsWith(key))
    .sort((first, second) => first.date.localeCompare(second.date));
  const list = document.querySelector('#agenda-list');
  list.replaceChildren();
  if (events.length === 0) {
    const dateLabel = selectedDate ? formatDate(selectedDate) : formatDate(key + '-01', { month: 'long', year: 'numeric' });
    list.append(emptyState('Belum ada agenda untuk ' + dateLabel + '.', 'Jadwal yang telah tersedia dapat dilihat melalui kalender.'));
  }
  events.forEach(event => {
    const box = element('article', 'agenda-item');
    const meta = element('p');
    const status = event.date < today ? 'Telah berlangsung' : (event.date === today ? 'Hari ini' : 'Akan datang');
    const date = element('time', '', formatDate(event.date, { day: 'numeric', month: 'short', year: 'numeric' }));
    date.dateTime = event.date;
    meta.append(date, element('span', 'status-tag', status));
    const heading = element('h3');
    heading.append(externalLink(event.url, event.title + ' ↗'));
    box.append(meta, heading, element('span', '', event.place));
    list.append(box);
  });
  const past = content.events.filter(event => event.date < today).sort((first, second) => second.date.localeCompare(first.date));
  document.querySelector('#past-agenda').hidden = past.length === 0 || past[0].date.startsWith(key);
}

function changeMonth(offset) {
  const date = new Date(calendarYear, calendarMonth + offset, 1);
  calendarYear = date.getFullYear();
  calendarMonth = date.getMonth();
  selectedDate = null;
  renderCalendar();
}

function renderGallery() {
  const grid = document.querySelector('#gallery-grid');
  grid.replaceChildren();
  content.gallery.forEach((item, index) => {
    const button = element('button', 'gallery-item');
    button.type = 'button';
    button.dataset.galleryIndex = index;
    button.setAttribute('aria-label', 'Perbesar foto ' + item.title);
    const photo = element('img');
    photo.src = item.image;
    photo.alt = item.alt;
    photo.loading = 'lazy';
    photo.width = 1200;
    photo.height = 800;
    const caption = element('span', '', item.title);
    const arrow = element('b', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    caption.append(arrow);
    button.append(photo, caption);
    grid.append(button);
  });
  if (content.gallery.length === 0) {
    grid.append(emptyState('Dokumentasi belum tersedia.', 'Foto kegiatan akan ditampilkan di bagian ini.'));
    return;
  }
  const more = element('button', 'gallery-more', 'Lihat semua foto (' + content.gallery.length + ') ↗');
  more.type = 'button';
  more.addEventListener('click', () => openGallery(0));
  document.querySelector('.gallery-credit').append(more);
}

function updateGallery() {
  const item = content.gallery[galleryIndex];
  document.querySelector('#gallery-counter').textContent = (galleryIndex + 1) + ' / ' + content.gallery.length;
  const image = document.querySelector('#gallery-image');
  image.src = item.image;
  image.alt = item.alt;
  document.querySelector('#gallery-title').textContent = item.title;
  document.querySelector('#gallery-caption').textContent = item.caption;
  document.querySelector('#gallery-source').href = item.source;
  document.querySelector('#gallery-prev').hidden = content.gallery.length < 2;
  document.querySelector('#gallery-next').hidden = content.gallery.length < 2;
}

function openGallery(index) {
  galleryIndex = index;
  updateGallery();
  openDialog(document.querySelector('#gallery-dialog'));
}

function changeGallery(offset) {
  galleryIndex = (galleryIndex + offset + content.gallery.length) % content.gallery.length;
  updateGallery();
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Buka menu navigasi';
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Tutup menu navigasi' : 'Buka menu navigasi';
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);

document.querySelector('#news-filters').addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (button) setNewsCategory(button.dataset.category);
});
document.querySelector('#news-search').addEventListener('input', renderNews);
document.querySelector('#news-grid').addEventListener('click', event => {
  const button = event.target.closest('button[data-news-id]');
  if (button) openArticle(button.dataset.newsId);
});
document.querySelector('#announcement-filter').addEventListener('change', renderAnnouncements);
document.querySelector('#calendar-prev').addEventListener('click', () => changeMonth(-1));
document.querySelector('#calendar-next').addEventListener('click', () => changeMonth(1));
document.querySelector('#calendar-today').addEventListener('click', () => {
  calendarYear = currentYear;
  calendarMonth = currentMonth;
  selectedDate = null;
  renderCalendar();
});
document.querySelector('#calendar-body').addEventListener('click', event => {
  const button = event.target.closest('button[data-date]');
  if (!button) return;
  selectedDate = button.dataset.date === selectedDate ? null : button.dataset.date;
  renderCalendar();
  document.querySelector('[data-date="' + button.dataset.date + '"]').focus();
});
document.querySelector('#calendar-all').addEventListener('click', () => {
  selectedDate = null;
  renderCalendar();
});
document.querySelector('#past-agenda').addEventListener('click', () => {
  const past = content.events.filter(event => event.date < today).sort((first, second) => second.date.localeCompare(first.date));
  if (past.length === 0) return;
  calendarYear = Number(past[0].date.slice(0, 4));
  calendarMonth = Number(past[0].date.slice(5, 7)) - 1;
  selectedDate = null;
  renderCalendar();
});
document.querySelector('#gallery-grid').addEventListener('click', event => {
  const button = event.target.closest('button[data-gallery-index]');
  if (button) openGallery(Number(button.dataset.galleryIndex));
});
document.querySelector('#gallery-prev').addEventListener('click', () => changeGallery(-1));
document.querySelector('#gallery-next').addEventListener('click', () => changeGallery(1));
document.querySelector('#gallery-dialog').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changeGallery(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === dialog && outside) dialog.close();
  });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach(entry => {
    navigation.querySelectorAll('a').forEach(link => {
      const active = link.getAttribute('href') === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px' });
navigation.querySelectorAll('a').forEach(link => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionObserver.observe(section);
});

document.querySelector('#copyright-year').textContent = currentYear;
renderNews();
renderAnnouncements();
renderCalendar();
renderGallery();
