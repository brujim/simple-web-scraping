const pup = require('puppeteer');
const url = "https://www.mercadolivre.com.br/";
const searchFor = "dragon shield";

let counter = 1;
const productList = [];

(async () => {
  const browser = await pup.launch({headless: false});
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector("#cb1-edit");
  await page.type("#cb1-edit", searchFor);

  await Promise.all([
    page.waitForNavigation(),
    page.click(".nav-search-btn")
  ])

  const links = await page.$$eval(".ui-search-result__image > a", e => e.map(link => link.href));

  for (const link of links) {
    if (counter === 10) continue
    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title");
    const title = await page.$eval(".ui-pdp-title", element => element.innerText);
    const price = await page.$eval(".andes-money-amount__fraction", element => element.innerText);

    const product = {}
    product.title = title;
    product.price = price;
    product.link = link;
    
    productList.push(product);

    counter++;
  }

  console.log(productList);
  await page.waitForTimeout(3000);
  await browser.close();
})()
