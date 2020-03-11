// ==UserScript==
// @name     Unbenanntes Skript 200284
// @version  1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

function addCustomSearchResult(jNode) {
  jNode.prepend(
    '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Rewe_-_Dein_Markt_Logo.svg/512px-Rewe_-_Dein_Markt_Logo.svg.png" style="width: 200px;" id="connectToRewe"/>'
  );

  $("#connectToRewe").on("click", connectToRewe);
}

function connectToRewe() {
  $(".bring-list-item-container-to-purchase .bring-list-item-name").each(function() {
    window.open("https://shop.rewe.de/productList?merchantType=REWE&objectsPerPage=80&search=" + this.innerHTML);
  });
  //https://shop.rewe.de/productList?search=Feta
}

waitForKeyElements(".bring-list-selector-feedback-container", addCustomSearchResult);
