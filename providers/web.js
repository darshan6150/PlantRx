import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function webSearch(q, count = 5) {
  const url = "https://api.bing.microsoft.com/v7.0/search?q=" + encodeURIComponent(q) + "&mkt=en-US&count=" + count;
  const r = await fetch(url, { headers: { "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY }});
  if (!r.ok) return [];
  const j = await r.json();
  return (j.webPages?.value || []).map(v => ({ name: v.name, url: v.url, snippet: v.snippet }));
}

export async function fetchText(url) {
  try {
    const r = await fetch(url, { redirect: "follow", timeout: 15000 });
    const html = await r.text();
    const $ = cheerio.load(html);
    const txt = $("main,article").text() || $("body").text();
    return txt.replace(/\s+/g, " ").trim().slice(0, 4000); // cap for prompt size
  } catch { return ""; }
}