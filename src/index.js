// import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import _debounce from 'lodash.debounce';

import { getFetchImage } from './js/fetchImage';

const refs = {
  input: document.querySelector('.search-form').searchQuery,
  form: document.querySelector('.search-form'),

  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearh);
refs.input.addEventListener('input', _debounce(onInputSearch, 300));
refs.loadMore.addEventListener('click', loadMore);

let searchText = '';
let markUpCards = [];
let page = 1;

const ligthbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});


function onInputSearch(e) {
   searchText = e.target.value;
  
}
console.log(searchText);
async function loadMore() {
  page += 1;
//   console.log(page);
  const  data  = await getFetchImage(searchText, page);
  if (data.hits.length === 0) {
    refs.loadMore.classList.add('is-hidden');
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  render(data);
  ligthbox.refresh();
}

async function onSearh(e) {
  e.preventDefault();
  const data = await getFetchImage(searchText, page);
  page = 1;
  clearRender();
  if (data.hits.length === 0) {
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  console.log(data);
  render(data);
  ligthbox.refresh();

  refs.loadMore.classList.remove('is-hidden');
}

function render({ hits }) {
  // console.dir(data);
  const listMarkup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a href="${largeImageURL}" onclick="return false" rel="noreferrer noopener">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', listMarkup);
}
function clearRender() {
  refs.gallery.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
}