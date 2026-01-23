// pdf/templates.js
import fs from "fs/promises";

const css = await fs.readFile("pdf/print.css", "utf8");
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const cover = (title, user) => `
<section class="page-block cover">
  <h1>${esc(title)}</h1>
  <p>Prepared for ${esc(user?.name || "You")} • ${new Date().toISOString().slice(0,10)}</p>
  <div class="rule"></div>
</section>`;

const toc = items => `<section class="page-block toc"><h2>Table of Contents</h2><ol>${items.map(i=>`<li>${esc(i)}</li>`).join("")}</ol></section>`;
const branding = `<section class="page-block"><h2>PlantRx</h2><p>plantrxapp.com</p><div class="footer-spacer"></div></section>`;

// ==== TEMPLATES PER TYPE ====
export function renderDiet(a={}) {
  const kcal = a.weight_kg ? Math.round(a.weight_kg * 30 * (a.goal==='fat_loss'?0.85:1)) : null;
  const protein = a.weight_kg ? Math.round(a.weight_kg * 1.6) : null;

  return `<!doctype html><html><head><meta charset="utf-8">
  <title>Diet Plan</title><style>${css}</style></head><body><main>
  ${cover("Custom Diet Plan", a.user)}
  ${toc(["Profile","Plan Overview","Sample Menus","Shopping List","Tips & FAQs","References"])}

  <section class="page-block"><h2>Profile</h2>
    <ul>
      <li>Diet type: ${esc(a.diet?.type || "general")} • Allergies: ${(a.diet?.allergies||[]).join(", ")||"None"}</li>
      <li>Budget: ${esc(a.budget || "standard")} • Region: ${esc(a.region||"")}</li>
      <li>Goal: ${esc(a.goal || "general health")}</li>
    </ul>
  </section>

  <section class="page-block"><h2>Plan Overview</h2>
    <p>${kcal ? `Daily energy target: ~${kcal} kcal` : "Use the plate method (½ veg, ¼ protein, ¼ carbs)"}; ${protein ? `${protein} g protein/day.` : "Protein at each meal."}</p>
    <ul>
      <li>Meals/day: 3 + 1 snack</li>
      <li>Hydration: ≥ 2,000 ml/day</li>
    </ul>
  </section>

  <section class="page-block"><h2>Sample Menus</h2>
    <article class="block"><h3>Day A</h3>
      <ul>
        <li>Breakfast: Yogurt + berries + oats</li>
        <li>Lunch: Lentil bowl, salad, olive oil</li>
        <li>Dinner: Salmon/tofu, rice, broccoli</li>
        <li>Snack: Fruit + nuts (swap if nut allergy)</li>
      </ul>
    </article>
    <article class="block"><h3>Day B</h3>
      <ul>
        <li>Breakfast: Omelet + toast + tomatoes</li>
        <li>Lunch: Chicken/chickpea wrap + greens</li>
        <li>Dinner: Stir-fry veg + rice</li>
        <li>Snack: Herbal tea + yogurt</li>
      </ul>
    </article>
  </section>

  <section class="page-block"><h2>Shopping List</h2>
    <div class="table-wrap">
      <strong>Produce:</strong> spinach, broccoli, berries, bananas, onions<br/>
      <strong>Protein:</strong> eggs, yogurt, lentils, chickpeas, tofu/chicken<br/>
      <strong>Carbs:</strong> oats, rice, wholegrain bread, potatoes<br/>
      <strong>Fats:</strong> olive oil, avocado, seeds
    </div>
  </section>

  <section class="page-block"><h2>Tips & FAQs</h2>
    <p>Eating out? Choose grilled, add veg, keep sauces on side.</p>
  </section>

  <section class="page-block"><h2>References</h2>
    <p>Educational only. Not medical advice.</p>
  </section>

  ${branding}
  </main></body></html>`;
}

export function renderFitness(a={}) {
  const days = Array.from({length: 7}, (_,i)=>i+1).map(i => `
    <article class="block">
      <h3>Day ${i}</h3>
      <strong>Warm-up</strong><ul><li>5 min brisk walk</li><li>Thoracic rotations x10/side</li></ul>
      <strong>Main A</strong><ul><li>Pushups/Chest press 3×10 @RPE7</li><li>Rows 3×12 @RPE7</li></ul>
      <strong>Main B</strong><ul><li>Glute bridge 3×15</li><li>Split squat or hinge 3×10/side</li></ul>
      <strong>Finisher</strong><p>8–10 min EMOM conditioning</p>
      <strong>Cooldown</strong><ul><li>Hamstring stretch</li><li>Box breathing 2 min</li></ul>
    </article>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8">
  <title>Fitness Plan</title><style>${css}</style></head><body><main>
  ${cover("Fitness Routines", a.user)}
  ${toc(["Profile","Program Overview","Day-by-Day","Lifestyle & Habits","References"])}

  <section class="page-block"><h2>Profile</h2>
    <ul>
      <li>Experience: ${esc(a.experience || "beginner")} • Time/day: ${a.time_per_day_min||30} min</li>
      <li>Equipment: ${Object.entries(a.equipment||{}).filter(([,v])=>v).map(([k])=>k).join(", ")||"None"}</li>
      <li>Injuries: ${(a.injuries||[]).join(", ")||"None"}</li>
    </ul>
  </section>

  <section class="page-block"><h2>Program Overview</h2>
    <ul><li>RPE 7 (leave 2 reps in reserve)</li><li>Rest 60–90s</li></ul>
  </section>

  <section class="page-block"><h2>Day-by-Day</h2>${days}</section>

  <section class="page-block"><h2>Lifestyle & Habits</h2>
    <ul><li>Sleep target ≥7 h</li><li>Hydration ≥2,000 ml/day</li><li>Steps 8–10k</li></ul>
  </section>

  <section class="page-block"><h2>References</h2><p>Educational only. Not medical advice.</p></section>
  ${branding}
  </main></body></html>`;
}

export function renderSkincare(a={}) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <title>Skincare Plan</title><style>${css}</style></head><body><main>
  ${cover("Skin Care Routines", a.user)}
  ${toc(["Profile","AM Routine","PM Routine","Ingredients Guide","Progress Tracker","References"])}

  <section class="page-block"><h2>Profile</h2>
    <ul><li>Skin type: ${esc(a.skin?.type || "normal")}</li><li>Sensitivities: ${(a.skin?.sensitivities||[]).join(", ")||"None"}</li></ul>
  </section>

  <section class="page-block"><h2>AM Routine</h2>
    <ol><li>Gentle cleanse</li><li>Antioxidant serum</li><li>Moisturize</li><li>SPF 30+</li></ol>
  </section>

  <section class="page-block"><h2>PM Routine</h2>
    <ol><li>Double cleanse</li><li>Treatment (AHA/BHA or retinoid alt.)</li><li>Moisturize</li></ol>
  </section>

  <section class="page-block"><h2>Ingredients Guide</h2>
    <p>Niacinamide (oil control), Panthenol (barrier), Azelaic acid (tone). Avoid fragrance if sensitive.</p>
  </section>

  <section class="page-block"><h2>Progress Tracker</h2>
    <table><tr><th>Week</th><th>Notes</th></tr>
      ${[1,2,3,4].map(w=>`<tr><td>${w}</td><td>___________________________</td></tr>`).join("")}
    </table>
  </section>

  <section class="page-block"><h2>References</h2><p>Educational only. Not medical advice.</p></section>
  ${branding}
  </main></body></html>`;
}

export function renderWellness(a={}) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <title>Wellness Plan</title><style>${css}</style></head><body><main>
  ${cover("Wellness Plan", a.user)}
  ${toc(["Mindfulness","Sleep Protocol","Hydration & Sunlight","Daily Checklist","References"])}

  <section class="page-block"><h2>Mindfulness</h2><p>5–10 min breathwork, journaling prompts.</p></section>
  <section class="page-block"><h2>Sleep Protocol</h2><ul><li>Lights out 23:00</li><li>Limit screens 60 min before bed</li></ul></section>
  <section class="page-block"><h2>Hydration & Sunlight</h2><p>2,000 ml/day; morning light 5–10 min.</p></section>
  <section class="page-block"><h2>Daily Checklist</h2>
    <table><tr><th>Habit</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>
      ${["Mindfulness","Sleep ≥7h","Hydration","Steps"].map(h=>`<tr><td>${h}</td>${Array.from({length:7},()=>"<td>□</td>").join("")}</tr>`).join("")}
    </table>
  </section>
  <section class="page-block"><h2>References</h2><p>Educational only. Not medical advice.</p></section>
  ${branding}
  </main></body></html>`;
}

export function renderRecovery(a={}) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <title>Recovery Plan</title><style>${css}</style></head><body><main>
  ${cover("Recovery Plan", a.user)}
  ${toc(["Injury Notes","Mobility Flow","Pain-Safe Substitutions","Heat/Cold Guide","References"])}

  <section class="page-block"><h2>Injury Notes</h2>
    <p>${esc((a.injuries||[]).join(", ") || "No injuries reported")}</p>
  </section>
  <section class="page-block"><h2>Mobility Flow</h2>
    <ol><li>Cat-camel x10</li><li>Hip hinge drill x10</li><li>Thoracic openers x10</li></ol>
  </section>
  <section class="page-block"><h2>Pain-Safe Substitutions</h2>
    <ul><li>Squat → Box squat or hip hinge</li><li>Presses → Neutral-grip press</li></ul>
  </section>
  <section class="page-block"><h2>Heat/Cold Guide</h2><p>Cold for swelling first 24–48h; heat later for stiffness (if cleared).</p></section>
  <section class="page-block"><h2>References</h2><p>Educational only. Not medical advice.</p></section>
  ${branding}
  </main></body></html>`;
}