import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import Api from './fetchCountries';
import { refs } from './refs.js/countriesRefs';
const DEBOUNCE_DELAY = 300;

refs.searchBoxInput.addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

let searchValue = '';

function onInput(e) {
  searchValue = e.target.value.trim();
  if ((searchValue = '')) {
    clearMarkup();
    return;
  }
  Api.fetchCountries(searchValue)
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        clearMarkup();
        Notify.success(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (countries.length >= 2 && countries.length <= 10) {
        clearMarkup();
        renderContriesList(countries);
        return;
      } else if (countries.length === 1) {
        clearMarkup();
        renderContriesInfo(countries);
        return;
      }
    })
    .catch(onFetchError);
}

function renderContriesList(countries) {
  const markupList = countries
    .map(({ name, flags }) => {
      return `<li>
	  <img class="country-flag" src="${flags.svg}" alt="flag">
	  <p class="country-name">${name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markupList);
}

function renderContriesInfo(countries) {
  const languages = Object.values(languages).join(', ');
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-info">
	  <ul class="country-list">
	  <li class="country-name">
	  <img class="country-flag" src="${country.flags.svg}" alt="flag" width='20' height ='15' >${name.official}</li></ul>
			<h2 class="country-title">${name}</h2>
			<p>Capital: ${capital}</p>
			<p>Population: ${population}</p>
			<p>Flags: ${flags}</p>
			<p>Languages: ${languages}</p>
		  </div>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
function onFetchError(error) {
  if (error) {
    Notify.failure('Oops, there is no country with that name');
  }
}
