import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import puppeteer from 'puppeteer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { format } from 'date-fns';

const argv = yargs(hideBin(process.argv))
  .option('type', { type: 'string', demandOption: true, choices: ['diet','skincare','fitness','recovery','wellness'] })
  .option('input', { type: 'string', demandOption: true })
  .option('out', { type: 'string', demandOption: true })
  .option('pagesize', { type: 'string', default: 'A4', choices: ['A4','Letter'] })
  .argv;

const __dirname = path.resolve();
const templatesDir = path.join(__dirname, 'templates');
const stylesPath = path.join(__dirname, 'styles.css');

function inlineStyles(html, css) {
  return html.replace('</head>', `<style>${css}</style></head>`);
}

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

const templateMap = {
  diet: 'diet.njk',
  skincare: 'skincare.njk',
  fitness: 'fitness.njk',
  recovery: 'recovery.njk',
  wellness: 'wellness.njk',
};

async function render() {
  const data = loadJSON(argv.input);
  data.generated_at = format(new Date(), 'yyyy-MM-dd HH:mm');
  data.page_size = argv.pagesize;

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatesDir),
    { autoescape: false, trimBlocks: true, lstripBlocks: true }
  );

  const tpl = templateMap[argv.type];
  const baseHTML = env.render(tpl, data);
  const css = fs.readFileSync(stylesPath, 'utf-8');
  const html = inlineStyles(baseHTML, css);

  const outDir = path.dirname(argv.out);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });

  const displayHeaderFooter = true;
  const headerTemplate = `
  <div style="width:100%; font-size:9px; padding:4px 12px; color:#64748b; display:flex; justify-content:space-between; font-family:Inter, Arial, sans-serif;">
    <span>PlantRx · ${'{{title}}'}</span>
    <span>${'{{date}}'}</span>
  </div>
  `.replace('{{title}}', (data.meta && data.meta.title) ? data.meta.title : 'Plan')
   .replace('{{date}}', data.generated_at);

  const footerTemplate = `
  <div style="width:100%; font-size:9px; padding:4px 12px; color:#64748b; display:flex; justify-content:space-between; font-family:Inter, Arial, sans-serif;">
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    <span>plantrxapp.com</span>
  </div>`;

  await page.pdf({
    path: argv.out,
    format: argv.pagesize,
    printBackground: true,
    displayHeaderFooter,
    headerTemplate,
    footerTemplate,
    margin: { top: '60px', right: '24px', bottom: '60px', left: '24px' }
  });

  await browser.close();
  console.log(`✅ PDF created: ${argv.out}`);
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});