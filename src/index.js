import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import Api from './fetchCountries';
import { refs } from './refs.js/countriesRefs';
const DEBOUNCE_DELAY = 300;

refs.searchBoxInput.addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput(e) {
  const searchInput = e.target.value.trim();
  if (searchInput === '') {
    clearInput();
    return;
  }
  Api.fetchCountries(searchInput).then(renderContries).catch(onFetchError);
}

function renderContries(country) {
  console.log(country);
  if (country.length >= 10) {
    clearInput();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (country.length >= 2 && country.length <= 10) {
    clearInput();
    renderContriesList(country);
    return;
  } else if (country.length === 1) {
    clearInput();
    renderContriesInfo(country);
    return;
  }
}

function renderContriesList(country) {
  const markupList = country
    .map(({ name, flags }) => {
      return `<li class="country-list">
	  <img class="country-flag" src="${flags.svg}" alt="flag">
	  <p class="country-name">${name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markupList);
}

function renderContriesInfo(country) {
  clearInput();
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      let lang = '';
      for (let key in languages) {
        lang = languages[key];
      }
      return `
		<ul class="country-info-list">
		<li class="country-info-name">
		<img class="country-info-flag" src="${flags.svg}" alt="flag" width='20' height ='15' >${name.official}</li>
			  <h2 class="country-info-title">${name}</h2>
			  <p>Capital: ${capital}</p>
			  <p>Population: ${population}</p>
			  <p>Languages: ${languages}</p>
			</ul>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function onFetchError(error) {
  clearInput();
  if (error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}
function clearInput() {
  refs.countryListinnerHTML = '';
  refs.countryInfoinnerHTML = '';
}
