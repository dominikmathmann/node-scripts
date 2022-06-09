const puppeteer = require('puppeteer');
const url = 'https://www.skaneleden.se/en/delled/sl4-osterlen';

let browser;
let rootPage;
run();

async function run() {
    browser = await puppeteer.launch({headless: false});
    rootPage = await browser.newPage()
    await rootPage.goto(url);
    await rootPage.waitForFunction("document.querySelectorAll('a.Track').length>2")

    // console.log( await rootPage.title() )
    console.log("longitude,latitude,name"); // export to OV2 via http://ov2.kraz.de/

    const resultLinks = await rootPage.$$eval('a.Track', links => links.map(a => a.href));

    for (let link of resultLinks) {
        await loadDetail(link);
    }

    browser.close();
}

async function loadDetail(link) {
    await rootPage.goto(link);
    //console.log( '# ' + await rootPage.title() )
    for (let category of [
        ['lagerplats-med-vindskydd', 'Camp'],
        ['restaurang-cafe', 'Essen'],
        ['vatten-15-april-15-oktober', 'Wasser'],
        ['livsmedel', 'Shop'],
    ]) {
        const shelter = await rootPage.$(`input[value="${category[0]}"]`);
        await rootPage.waitForTimeout(10000);
        await shelter.click();
        await rootPage.waitForTimeout(10000);
        const links = await rootPage.$$eval('.Places-list-item', links => links.map(a => a.href));
        for (let link of links) {
            await loadCoordinates(link, category[1]);
        }
    }
}

async function loadCoordinates(link, title='') {
    //console.log('## ' + link)
    let subPage = await browser.newPage()
    await subPage.goto(link);
    await subPage.waitForFunction('document.querySelectorAll("._header-map img").length>0')
    const mapLink = await subPage.$$eval('._header-map img', map => map[0].src)
    const coord = mapLink.split("&")[1].split("=")[1].split(",");
    console.log(coord[1] + "," + coord[0] + ",\"" + title + " " + link + "\"");
    subPage.close();
}
