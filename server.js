const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com', { waitUntil: 'domcontentloaded' });

    const books = await page.$$eval('.product_pod', (cards) =>
      cards.map((card) => ({
        title: card.querySelector('h3 a')?.getAttribute('title') || 'No title',
        price: card.querySelector('.price_color')?.innerText || 'No price',
        image: 'https://books.toscrape.com/' + card.querySelector('img')?.getAttribute('src'),
      }))
    );

    await browser.close();
    res.json({ listings: books });
  } catch (err) {
    console.error('❌ Scraping failed:', err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(3001, () => console.log('✅ Server running on http://localhost:3001'));
