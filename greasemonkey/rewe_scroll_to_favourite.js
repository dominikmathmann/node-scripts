// ==UserScript==
// @name     ScrollToReweFavourite
// @version  1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

let scrolled = false;
waitForKeyElements('[data-testid="rs-qa-add-to-basket-button"]', (ele) => {
  if(!scrolled){
      scrolled=true;
      $('html, body').animate({
        scrollTop: $(document).height()
      }, 5000, () => {
      	let favs = $('.lrms-isActive');
        if(favs.length){
            const el = $(favs.get(0));
            const offsetTop = $(favs.get(0)).offset().top;
            const elementHeight = el.outerHeight();
            const windowHeight = $(window).height();
            const scrollTo = offsetTop - (windowHeight / 2) + (elementHeight / 2);
            
            const container = $('.lrms-isActive').get(0).closest('div[class*="a-pt__theme"]')
            $(container).css('border', '10px solid red');
  
          window.scrollTo(0, scrollTo);
        }else {
          window.scrollTo(0, 0);
        }
      });
  }

})

console.log("REWE HERE");
