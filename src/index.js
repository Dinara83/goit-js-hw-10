import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import { refs } from './refs.js/countriesRefs';
const DEBOUNCE_DELAY = 300;

refs.searchBoxInput.addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput(e) {
  const searchInput = e.target.value.trim();
  clearInput();
  if (!searchInput) {
    return;
  }
  fetchCountries(searchInput).then(renderContries).catch(onFetchError);
}

function renderContries(countries) {
  console.log(countries);
  if (countries.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    const markupList = renderContriesList(countries);
    refs.countryList.insertAdjacentHTML('beforeend', markupList);
  } else if (countries.length === 1) {
    const markup = renderContriesInfo(countries);
    refs.countryInfo.innerHTML = markup;
  }
}

// function renderContries(countries) {
//   console.log(countries);
//   if (countries.length >= 10) {
//     Notiflix.Notify.info(
//       'Too many matches found. Please enter a more specific name.'
//     );
//   } else if (countries.length >= 2 && countries.length <= 10) {
//     clearInput();
//     const markupList = renderContriesList(countries);
//     refs.countryList.insertAdjacentHTML('beforeend', markupList);
//   } else if (countries.length === 1) {
//     clearInput();
//     const markup = renderContriesInfo(countries);
//     refs.countryInfo.insertAdjacentHTML('beforeend', markup);
//   }
// }

function renderContriesList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li class="country-list">
	  <img class="country-flag" src="${flags.svg}" alt="flag" width="320">
	  <p class="country-name"><b>${name.official}</p>
    </li>`;
    })
    .join('');
}

function renderContriesInfo(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
		<li class="country-info-name">  
		<h2 class="country-info-title"><img src="${
      flags.svg
    }" alt="flag" width="30" hight="20"><b>${name.official}</b></h2>
			  <p><b>Capital:</b> ${capital}</p>
			  <p><b>Population:</b> ${population}</p>
			  <p><b>Languages:</b> ${Object.values(languages)}</p>
			  </li>`;
    })
    .join('');
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearInput() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
