const container = document.querySelector('.container');
const search = document.querySelector('#searchInput');

const nextPage = document.querySelector('.btn_next');
const prevPage =document.querySelector('.btn_prev');
const currentPage = document.querySelector('.current');

const modal = document.querySelector('.modal')
const modal_content = document.querySelector('.modal_content')
const closeBtn = document.querySelector('.close_btn')


const LIMIT = 12;
let offset = 0;
let page = 1;
let result = [];


async function getPosts(offset, searchText = '') {
  try {
    if (!result.length) {
      const response = await fetch('https://restcountries.com/v3.1/all');
      result = await response.json();
      result.sort(function(a, b) {
        return a.name.common > b.name.common ? 1 : -1;
      });
    }

    

    currentPage.innerHTML = page;

    const filteredCountries = result.filter(result => {
      return result.name.common.toLowerCase().includes(searchText.toLowerCase()) || 
      result.cca3.toLowerCase().includes(searchText.toLowerCase())
    });

    const slicedCountries = filteredCountries.slice(offset, offset + LIMIT);

    const data = slicedCountries

    // ? disabled btn prev
    prevPage.disabled = page === 1;

    // ? disabled btn next 
    nextPage.disabled = offset + LIMIT >= filteredCountries.length;

    return data;

  } catch (error) {
    console.error(error);
  } 
}

function searchCountries() {
  const searchText = search.value;
  page = 1;
  offset = 0;
  getPosts(offset, searchText).then(data => {
    const temp = data.map(result => cardTitle(result)).join('');
    container.innerHTML = temp;
  });
}

search.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    searchCountries();
  }
});




window.addEventListener('load', () => {
  getPosts(offset).then(data => {
    const temp = data.map(result => cardTitle(result)).join('');
    container.innerHTML = temp;
  });

}); 


function cardTitle(result) {
  return `
    <div class="Card_title" data-cca3="${result.cca3}" onClick="SetCountryInfo('${result.cca3}')">
      <div class="img_title">
        <img src="${result.flags.png}">
      </div>
      <h1 class="name_title">${result.name.common}</h1>
      <p class="population_title"><span>Population:</span> ${result.population}</p>
      <p class="region_title"><span>Region:</span> ${result.region}</p>
      <p class="capital_title"><span>Capital:</span> ${result.capital}</p>
    </div>
  `
};

const setDate = (url) => 	fetch(url) .then((res) => res.json());


const SetCountryInfo = (cca3) => {


  const country = result.find((r) => r.cca3 === cca3);
  const cardTitleElement = document.querySelector(
    `.Card_title[data-cca3="${cca3}"]`
  );
  if (cardTitleElement) {
    const SetTitleInfo = cardTitleInfo(country)
    cardTitleElement.innerHTML = SetTitleInfo;

  }

};

const SetInfo = document.querySelector('.countryInfo')

console.log(SetInfo)


function cardTitleInfo (country) {

  console.log(country)

  return ` 
  <div class="countryInfo">
  <p <span>Root: </span>${country.ccn3}</p>



  </div>
  `

  
}


// ?Pagination 

function changePage(delta) {
  page += delta;
  offset += delta * LIMIT;
  getPosts(offset).then(data => {
    const temp = data.map(result => cardTitle(result)).join('');
    container.innerHTML = temp;
  });
}

nextPage.addEventListener('click', () => changePage(1));
prevPage.addEventListener('click', () => changePage(-1));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && !nextPage.disabled) {
    changePage(1);
    nextPage.disabled = offset + LIMIT >= result.length;
  }

  if (e.key === 'ArrowLeft' && !prevPage.disabled) {
    changePage(-1);
    prevPage.disabled = page === 1;
  }
});


window.addEventListener('DOMContentLoaded',  () => {
  getPosts(offset)

  getPosts(offset).then(data => {
    const temp = data.map(result => cardTitle(result)).join('');
    container.innerHTML = temp;
  });
});

// ?theme

const themeToggle = document.querySelector('#theme-toggle');
const body = document.querySelector('body');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  body.classList.toggle('dark-theme');
});



