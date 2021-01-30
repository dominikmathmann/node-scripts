// ==UserScript==
// @name     ScrollToReweFavourite
// @version  1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

let productDivHeight = 416;

function scrollToFavourite(){
  let favs = $(".lrms-isActive");
  if (favs)
		window.scrollTo(0, favs[0].getBoundingClientRect().top - productDivHeight)
}

waitForKeyElements(".lrms-addToFavHeartButton", scrollToFavourite);
