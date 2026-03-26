import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery } from './js/render-functions.js';
import { clearGallery } from './js/render-functions.js';
import { showLoader } from './js/render-functions.js';
import { hideLoader } from './js/render-functions.js';
import { showLoadMore } from './js/render-functions.js';
import { hideLoadMore } from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMore = document.querySelector('.load-more');
let page = 1;
let query = '';
let totalHits = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();

  query = e.target.elements['search-text'].value.trim();

  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMore();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, no images found.',
      });
      return;
    }

    createGallery(data.hits);
    showLoadMore();

    // перевірка кінця
    if (page * 15 >= totalHits) {
      hideLoadMore();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong',
    });
  } finally {
    hideLoader();
  }
});

loadMore.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMore();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const card = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: card.height * 2,
      behavior: 'smooth',
    });

    if (page * 15 < totalHits) {
      showLoadMore();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong',
    });
  } finally {
    hideLoader();
  }
});