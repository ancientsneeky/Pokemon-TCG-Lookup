const POKECARD_SEARCH_INDEX_URL = 'https://api.pokemontcg.io/v1/cards';
// const EBAY_SEARCH_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_SEARCH_URL = 'http://svcs.ebay.com/services/search/FindingService/v1';
// //working TCG API search

function getDataFromPokemonApi(searchTerm, callback) {
  const settings = {
    url: POKECARD_SEARCH_INDEX_URL,
    data: {
      name: `${searchTerm}`
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

  function getDataFromEbayApi(searchTerm, callback) {
  const settings = {
    url: EBAY_SEARCH_URL,
    data: {
      "OPERATION-NAME": 'findItemsByKeywords',
      "SERVICE-VERSION": "1.0",
      "GLOBAL-ID": "EBAY-US",
      keywords: `${searchTerm}`,
      "SECURITY-APPNAME": "ChrisMag-pokesear-PRD-48bb65212-9e1a0bc9",
      "RESPONSE-DATA-FORMAT": "json",
      callback: "_cb_findItemsByKeywords",
      'paginationInput.entriesPerPage': 9
    },    
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  }
  $.ajax(settings);
}

function renderPokeResult(result) {
  // console.log(result);
  const cardInfo = `${result.name}`
  const htmlDiv = `
    <div class="js-card-result col-3 searchPlaceHolder">
      <img src="${result.imageUrl}" class="pokeImg" id="${cardInfo}" alt="${cardInfo}" tabindex="0"/>
      <h2 class="cardName">
        <p>${result.name}</p>
      </h2>
    </div>
  `;
  return htmlDiv;
      // </a> by <a class="js-channel-name" href="https://www.POKECARD.com/channel/${result.snippet.channelId}"> ${result.snippet.channelTitle}</a>
}

function renderEbayResult(result) {
  return `
    <div class="js-card-result col-3 searchPlaceHolder">
      <h2>
      <p class="ebay title">${result.title[0]}</p>
      <p class="ebay Condition">Condition: ${result.condition[0].conditionDisplayName[0]}</p>
      <a href="${result.viewItemURL[0]}" target="_blank" rel="noopener noreferrer" class="ebay-link">
      <img class="ebayImg" src="${result.galleryURL[0]}" alt="Ebay Image of ${result.title[0]}"/>
      </a>
      <p class="ebay Price">$${result.sellingStatus[0].currentPrice[0].__value__} USD</p>
      <p class="ebay Shipping">Shipped from: ${result.location[0]}</p>
      </h2>
    </div>
  `;
}

// function renderPageButtons(){
//   return `    
//   <a href="#" class="previous hidden">&laquo; Previous</a>
//   <a href="#" class="next">Next &raquo;</a>
//   `
// }

// function PageCountPlusOne() {
//   pageCount++;
// }

// function emptySearchForm(){
//   $('.js-search-page-button').empty();
//   $('.js-search-results').empty();
// }

function displayEbaySearchData(data) {
  console.log(data);
  const unnestedData = data.findItemsByKeywordsResponse["0"].searchResult[0].item;
  console.log(unnestedData);
  const results = unnestedData.map((item, index) => renderEbayResult(item));
  $('.js-ebay-search-results').html(results);
}

function displayPOKECARDSearchData(data) {
  console.log(data);
  const results = data.cards.map((item, index) => renderPokeResult(item));
  // $('.js-search-page-button').html(renderPageButtons());
  // handleNextButton(data);
  // handlePrevButton(data);
  // displayPrevButton();
  const heading = $('.heading');
  heading.html("Results");
  heading.toggleClass('hidden');
  $('.js-search-results').html(results);
  handleImageClick();
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    getDataFromPokemonApi(getSubmitValue(), displayPOKECARDSearchData);
    toggleHidden();
    // getDataFromEbayApi(getSubmitValue(), displayEbaySearchData);
  });
}

function getSubmitValue(){
  return $('.js-query').val();
}

function toggleHidden() {
  $('.js-search-results').toggleClass('hidden');
  $('.js-ebay-search-results').toggleClass('hidden');
}

function handleImageClick() {
  $('.js-card-result').on('keydown', event => {
    if (event.keycode == 32) {
      const searchTerm = event.target.id;
      console.log(searchTerm);
      $('.js-search-results > *').addClass('hidden');
      $('.heading').html("Ebay Results");
      toggleHidden();
      getDataFromEbayApi(searchTerm, displayEbaySearchData); 
    };
  });  
  $('.js-card-result').on('click', event => {
    const searchTerm = event.target.id;
    console.log(searchTerm);
    $('.js-search-results > *').addClass('hidden');
    $('.heading').html("Ebay Results");
    toggleHidden();
    getDataFromEbayApi(searchTerm, displayEbaySearchData); 
  });
}

// function pageCountMinusOne(){
//   pageCount--;
// }

// function handleNextButton(data) {
//   $('.next').on('click', event => {
//     event.preventDefault();
//     emptySearchForm();
//     const pageTokenArg = data.nextPageToken
//     getDataFromApi(getSubmitValue(), displayPOKECARDSearchData, pageTokenArg);
//     PageCountPlusOne();
//   });
// }

// function displayPrevButton() {
//   const $prevBtn = $('a.previous');
//   if (pageCount < 1) {
//   $prevBtn.addClass('hidden');
//   }
//   else {
//   $prevBtn.removeClass('hidden');
//   }
// }

// function handlePrevButton(data) {
//   $('.previous').on('click', event => {
//     pageCountMinusOne();
//     const pageTokenArg = data.prevPageToken;
//     getDataFromApi(getSubmitValue(), displayPOKECARDSearchData, pageTokenArg);
//     displayPrevButton();
//     });
// }

$(watchSubmit);
