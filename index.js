const express = require('express');
const axios = require('axios');
const jsdom = require("jsdom");
const app = express();
const port = 3000;
const puppeteer = require('puppeteer');


const MDN_HTML_ELEMENT = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/'

const getMDNUrl = () => {
  return `${MDN_HTML_ELEMENT}${process.env['TAG']}`;
}

(async () => {

  // const getTitle = () => {
  //   return document.querySelector(MDN_SELECTORS.TITLE).textContent;
  // }
  //
  // const getDescription = (d) => {
  //   return d.querySelector(MDN_SELECTORS.DESCRIPTIONS).innerHTML;
  // }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(getMDNUrl());

  await page.waitForSelector('h1');

  const ee = await page.evaluate(() => {
    const MDN_SELECTORS = {
      TITLE: 'h1',
      DESCRIPTIONS: '.section-content',
      ATTRIBUTES: 'section[aria-labelledby="attributes"] > .section-content > dl',
      PROPERTIES: '[aria-labelledby]="properties"',
      EXAMPLES: '[aria-labelledby]="examples"',
      BROWSER_COMPATIBILITY: '#browser_compatibility',
    }

    // const title = getTitle(document);
    // const title = getTitle();
    const title = document.querySelector(MDN_SELECTORS.TITLE).textContent;
    const description = document.querySelector(MDN_SELECTORS.DESCRIPTIONS).textContent;
    const attributesNote = document.querySelector(MDN_SELECTORS.ATTRIBUTES);

    const dt = Object.values(attributesNote.querySelectorAll('dt'));
    const dd = Object.values(attributesNote.querySelectorAll('dd'));

    const testAtt = dt.map((el, index) => {
      const secondaryContent = dd[index];
      const p = secondaryContent.querySelector('p').textContent;
      const listNode = Object.values(secondaryContent.querySelectorAll('ul > li'));

      const list = listNode.map((li) => {
        const nodes = Object.values(li.childNodes);
        const definition = nodes.shift();
        const texts = nodes.filter(n => n.textContent || n.nodeValue);
        console.log(definition);
        return {
          title: definition,
          content: texts.join(' '),
        }
      })

      console.log('list', JSON.stringify(list));

      return {
        // originalTitle: el.innerHTML,
        // p: p,
        // title: el.textContent,
        list
      }
    })

    return {
      title,
      description,
      attributes: testAtt
    }
  })

  // console.log(ee);

  await browser.close();

})()


// const getDom = () => {
//   Document.createElement('div');
// }
//
// app.get('/', (req, res) => {
//   const { JSDOM } = jsdom;
//
//   axios.get(getMDNUrl()).then((response) => {
//     const { document } = new JSDOM(response).window;
//     const test = document.body.toString();
//     console.log(test);
//
//     res.send(test)
//
//   })
//
// })

// app.listen(port, () => {
//   const { JSDOM } = jsdom;
//
//   console.log('YOUR TAG:', process.env['TAG']);
//   console.log('url', getMDNUrl());
//
//   axios.get(getMDNUrl()).then((response) => {
//     // const { document } = new JSDOM(response).window;
//     // const test = document.body.innerHTML;
//     JSDOM.fromURL(getMDNUrl()).then(dom => {
//       // console.log(dom.serialize());
//       console.log(dom.document);
//       console.log(dom.document.querySelector('h1'));
//       // console.log(dom.serialize());
//
//     });
//
//   })
//
//
//   console.log(`Example app listening on port ${port}`)
// })