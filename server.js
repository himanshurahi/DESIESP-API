const express = require("express");
const puppeteer = require("puppeteer");
let cors = require('cors')
const app = express();
const server = require("http").createServer(app);
let port = process.env.PORT || 8080;

app.use(cors())


server.listen(port, () => {
  console.log("Server Started On : "+port);
});

app.get("/", (req, res) => {
  res.send({ msg: "Desi ESP API" });
});

app.get("/token", (req, res) => {
  (async () => {
    const browser = await puppeteer.launch({ headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("http://desiesp.com/getfreekey.php", { waitUntil: "networkidle2" });
    await page.$eval("#btn-main", (form) => form.click());

    await page.waitFor(10000);
    await page.$eval("#btn-main", (form) => form.click());
    // await page.screenshot({ path: "example.png" });
    await page.waitFor(2000);
    // Get the "viewport" of the page, as reported by the page.
    const key = await page.evaluate(() => {
      return {
        key: document.querySelector("input").value,
      };
    });

    res.send(key);
    await browser.close();
  })();
});
