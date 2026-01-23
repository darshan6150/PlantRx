import puppeteer from "puppeteer";

export async function htmlToPdfBuffer(html, { diag, ...pdfOptions } = {}) {
  // Puppeteer flags that matter on Replit/containers:
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage" // prevents /dev/shm crashes
    ]
  });

  const page = await browser.newPage();

  // Capture diagnostics
  if (diag) {
    page.on("console", (msg) => diag.pageConsole.push(msg.text()));
    page.on("pageerror", (err) => diag.pageErrors.push(err?.message || String(err)));
    page.on("requestfailed", (req) => diag.requestFailed.push({ url: req.url(), err: req.failure()?.errorText }));
  }

  try {
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.emulateMediaType("print");

    try { await page.evaluateHandle("document.fonts && document.fonts.ready"); } catch {}
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 20000 }).catch(()=>{});

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: "18mm", right: "12mm", bottom: "24mm", left: "12mm" },
      ...pdfOptions
    });
    return pdf;
  } finally {
    await browser.close();
  }
}