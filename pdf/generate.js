// pdf/generate.js
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { renderDiet, renderFitness, renderSkincare, renderWellness, renderRecovery } from "./templates.js";

const RENDERS = {
  diet: renderDiet,
  fitness: renderFitness,
  skincare: renderSkincare,
  wellness: renderWellness,
  recovery: renderRecovery,
};

export async function renderAndMakePdf(type, answers = {}) {
  const render = RENDERS[type];
  if (!render) throw new Error(`Unknown type: ${type}`);

  const html = render(answers);

  const tmpHtmlPath = path.join(process.cwd(), `.tmp-${type}.html`);
  const outPath = path.join(process.cwd(), `plantrx-${type}-plan.pdf`);

  await fs.writeFile(tmpHtmlPath, html, "utf8");

  // Find Chromium executable dynamically
  let executablePath;
  try {
    const { execSync } = await import('child_process');
    executablePath = execSync('which chromium', { encoding: 'utf8' }).trim();
  } catch {
    executablePath = undefined; // Let Puppeteer use its bundled version
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox", 
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote", 
      "--single-process",
      "--disable-gpu",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor"
    ] 
  });
  const page = await browser.newPage();

  // Inline CSS directly instead of file references
  const cssPath = path.join(process.cwd(), 'pdf/print.css');
  const cssContent = await fs.readFile(cssPath, 'utf8');
  const htmlWithInlineCSS = html.replace('<link rel="stylesheet" href="/pdf/print.css">', `<style>${cssContent}</style>`);
  
  await page.setContent(htmlWithInlineCSS, { waitUntil: "domcontentloaded" });

  await page.emulateMediaType("print");
  try { await page.evaluateHandle("document.fonts && document.fonts.ready"); } catch {}
  await page.waitForNetworkIdle({ idleTime: 800, timeout: 15000 }).catch(()=>{});

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: { top: "18mm", right: "12mm", bottom: "24mm", left: "12mm" }
  });

  await browser.close();
  
  // Clean up temporary HTML file
  try { await fs.unlink(tmpHtmlPath); } catch {}
  
  // Ensure we have actual PDF content
  if (!pdf || pdf.length === 0) {
    throw new Error('Generated PDF is empty');
  }
  
  console.log(`✅ PDF generated successfully: ${pdf.length} bytes`);
  return pdf;
}