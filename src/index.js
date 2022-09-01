import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  return fetchCountries(e.target.value.trim())
    .then(country => {
      if (country.length >= 10) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (country.length <= 10 && country.length >= 2) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        country.map(el => {
          refs.countryList.insertAdjacentHTML(
            'beforeend',
            countryListMarkup(el)
          );
        });
      } else if (country.length === 1) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        country.map(el => {
          refs.countryInfo.insertAdjacentHTML('beforeend', countyrMarkup(el));
        });
      }
    })
    .catch(onFetchError);
}

function onFetchError(error) {
  Notiflix.Notify.failure('Sorry, there is no country with such name');
}

function countyrMarkup({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  const langList = Object.values(languages).join(', ');
  return `<div class = 'country-card'><img src = '${svg}' alt = 'flag of ${official}' width='40' height='30' class = 'country-img'/><p class = 'country-name'>${official}</p></div>
  <ul class = 'country-list'><li class = 'country-item'><p class = 'country-item-name'>Capital: <span class = 'country-item-text'>${capital}</span></p></li>
  <li class = 'country-item'><p class = 'country-item-name'>Population: <span class = 'country-item-text'>${population}</span></p></li>
  <li class = 'country-item'><p class = 'country-item-name'>Languages: <span class = 'country-item-text'>${langList}</span></p></li></ul>`;
}

function countryListMarkup({ name: { official }, flags: { svg } }) {
  return `<li class = 'country-list-item'><img class = 'country-list-img' src = '${svg}' alt = 'Flag of ${official}' width = '30' height = '20'/><p class = 'country-list-name'>${official}</p></li>`;
}
