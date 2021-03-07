const cheerio = require('cheerio');
const fs = require('fs');

const urls = [];
const titles = [];

fs.readFile('D:/dev/pocket/ril_export.html', 'utf8' , (err, data) => {
  const $ = cheerio.load(data);
  $('li').find('a').each( (i,e) => {
  let href = $(e).attr('href');
  let txt = $(e).text();
  if(
    href.indexOf('chefkoch.de')!=-1 ||
    href.indexOf('lecker.de')!=-1 ||
    href.indexOf('essen')!=-1 ||
    href.indexOf('kitchenstories')!=-1 ||
    href.indexOf('kptncook')!=-1
    ) {
        urls.push(href)
        titles.push(txt)
    }
 }
  );
   const count = urls.length;
   let htmlContent = "";
    let filename = "checkoch_" + new Date().getTime() + ".html";
   for (let i=0;i<=10;i++){
    let rnd=Math.floor(Math.random() * count);
    var url = urls[rnd];
    var title = titles[rnd];
    console.log(title)
    if(title.indexOf("https")!=-1){
        title=title.substr(title.lastIndexOf("/")+1);
    }
    console.log(title)
    // by url
    //    require('child_process').exec('start ' + url);
    //by title
    //    require('child_process').exec('start ' + "https://getpocket.com/my-list/search?query=" + encodeURIComponent(title));
    let pocketurl = "https://getpocket.com/my-list/search?query=" + encodeURIComponent(title);
    htmlContent+=`<div><button onclick="this.parentNode.style.display='none'">hide</button><iframe style="float: left" src="${url}" width="850" height="700"></iframe><iframe src="${pocketurl}" width="475" height="700"></iframe></div><br><br><hr><br><br>`
   }

   fs.writeFile(filename, htmlContent, "utf8", () => {});
   require('child_process').exec('start ' + filename);
  }
 )
