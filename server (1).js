/* eslint-disable no-undef */

// Perisher BOM Proxy — deploy to Render, Railway, or any Node host

// Fetches BOM observation data and returns it with CORS headers

import express from "express";


const app = express();

const PORT = process.env.PORT || 3000;


// BOM observation endpoints by station

const STATIONS = {

perisher_valley: "https://www.bom.gov.au/fwo/IDN60801/IDN60801.94915.json",

// Add more stations here, e.g.:

// thredbo: "https://www.bom.gov.au/fwo/IDN60801/IDN60801.94926.json",

};


app.use((req, res, next) => {

res.header("Access-Control-Allow-Origin", "*");

res.header("Access-Control-Allow-Methods", "GET");

res.header("Access-Control-Allow-Headers", "Content-Type");

next();

});


app.get("/api/observations", async (req, res) => {

const station = req.query.station || "perisher_valley";

const url = STATIONS[station];

if (!url) return res.status(404).json({ error: "Unknown station" });


try {

const response = await fetch(url, {

redirect: "follow",

headers: {

"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

"Accept": "application/json, text/plain, */*",

"Accept-Language": "en-AU,en;q=0.9",

"Referer": "https://www.bom.gov.au/",

},

});

if (!response.ok) {

return res.status(response.status).json({ error: "BOM API error" });

}

const data = await response.json();

res.json(data);

} catch (err) {

res.status(502).json({ error: "Failed to fetch BOM data" });

}

});


app.get("/", (req, res) => {

res.json({ status: "ok", stations: Object.keys(STATIONS) });

});


app.listen(PORT, () => {

console.log(`Perisher BOM proxy running on port ${PORT}`);

});

