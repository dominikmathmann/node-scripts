const cheerio = require('cheerio');
const fs = require('fs');

const urls = [];
const titles = [];

fs.readFile('D:/dev/pocket/8efbf6e7-dc65-4bd1-89eb-0e5409063b88.html', 'utf8' , (err, data) => {
  const $ = cheerio.load(data);
  $('a').each( (i,e) => {
  let href = $(e).attr('href');
  let txt = $(e).text();
  if(
    href.indexOf('chefkoch.de')!=-1 ||
    href.indexOf('lecker.de')!=-1 ||
    href.indexOf('essen')!=-1 ||
    href.indexOf('rewe')!=-1 ||
   href.indexOf('eat')!=-1 ||
    href.indexOf('sevencooks')!=-1 ||
    href.indexOf('freundin')!=-1 ||
    href.indexOf('meine-familie-und-ich')!=-1 ||
    href.indexOf('kitchenstories')!=-1 ||
    href.indexOf('springlane')!=-1 ||
    href.indexOf('bild')!=-1 ||
    href.indexOf('malende')!=-1 ||
    href.indexOf('kptncook')!=-1
    ) {
        urls.push(href)
        titles.push(txt)
    }
 }
  );
   const count = urls.length;
   let htmlContent = "<div style='display: flex;flex-wrap: wrap;'>";
    // let filename = "checkoch_" + new Date().getTime() + ".html";
    let filename = "D:/dev/pocket/checkoch.html";
   for (let i=0;i<=20;i++){
    let rnd=Math.floor(Math.random() * count);
    var url = urls[rnd];
    var title = titles[rnd];
    console.log(title)
    if(title.indexOf("https")!=-1){
        title=title.substr(title.lastIndexOf("/")+1);
    }

    // by url
    //    require('child_process').exec('start ' + url);
    //by title
    //    require('child_process').exec('start ' + "https://getpocket.com/my-list/search?query=" + encodeURIComponent(title));
    let pocketurl = "https://app.raindrop.io/my/0/" + encodeURIComponent(url);
    htmlContent+=`
        <div style="position: relative;">
            <div style="height: 50px; display: flex;">
            <h2>
                <a href="${pocketurl}" target="_blank">
                    <img src="data:image/png;base64,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" style="width: 50px;background-color: white;"/>
                </a>
            </h2>
            <h2>
                <a href="${url}" target="_blank">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy163Ira_3FAOtJxrxqUdeVcFuP2bE-BSalw&usqp=CAU" style="width: 50px;background-color: white;"/>
                </a>
            </h2>
            </div>
            <iframe style="float: left" src="${url}" width="850" height="700"></iframe></div>`
   }
htmlContent+='</div>'
   let f = fs.writeFile(filename, htmlContent, "utf8", () => {});
   setTimeout(() => {
    require('child_process').exec('start ' + filename);
   }, 2000)
  }
 )
