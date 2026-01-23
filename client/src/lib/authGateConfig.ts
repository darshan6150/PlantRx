export const AUTH_GATE_CFG = {
  softPageviews: 2,         // trigger soft prompt at >= 2 PV
  softSeconds: 90,          // or after 90s on site
  coolDownHours: 24,        // don't re-soft-prompt within 24h if dismissed
  hardAfterIntent: 2,       // second intent action in same session => hard wall
  returnerWindowDays: 7,    // track visits in 7d window
  returnerSoftOnNthVisit: 3,// on 3rd visit, schedule soft prompt after 60–90s
};