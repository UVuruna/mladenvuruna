# Theme Switch — Flow

**About:** [description](../__about/themeSwitch.md)

## Algorithm — init()

```mermaid
%%{init: {'flowchart': {'subGraphTitleMargin': {'top': 0, 'bottom': 35}}}}%%
flowchart TB
    A["ThemeSwitch.init()"] --> B["getInitialTheme():\nsessionStorage[storageKey]?"]
    B -- stored --> C["theme = stored value"]
    B -- none --> D["isDaytime(): calculateSunTimes(now, lat, lon)\nnow in [sunrise, sunset)?"]
    D --> E["theme = daytime ? 'light' : 'dark'"]
    C --> F["applyTheme(theme)\n(before DOMContentLoaded — default config values)"]
    E --> F
    F --> G["await loadConfig():\nfetch config/site.json -&gt; location\nfetch config/themeSwitch.json -&gt; svgPath/wipeDuration/storageKey"]
    G --> H["initSwitchDimensions():\nfetch svgPath, parse viewBox,\nset --switch-aspect-ratio"]
    H --> I{"document.readyState == 'loading'?"}
    I -- yes --> J["wait for DOMContentLoaded"]
    I -- no --> K["setupEventListener() now"]
    J --> K
    K --> L["sync checkbox to current theme\nlisten for 'change' -&gt; toggleTheme()"]
```

## Algorithm — toggleTheme()

```mermaid
%%{init: {'flowchart': {'subGraphTitleMargin': {'top': 0, 'bottom': 35}}}}%%
flowchart TB
    A["checkbox 'change' event"] --> B["currentTheme = has [data-theme=light] ? 'light' : 'dark'\nnewTheme = opposite"]
    B --> C{"newTheme == 'light'?"}
    C -- yes --> D["add .theme-switch--to-day\n(wipe LEFT -&gt; RIGHT)"]
    C -- no --> E["add .theme-switch--to-night\n(wipe RIGHT -&gt; LEFT)"]
    D --> F["applyTheme(newTheme)\nsessionStorage[storageKey] = newTheme"]
    E --> F
    F --> G["setTimeout(wipeDuration + 50):\nremove direction classes"]
```

Pseudocode — sunrise/sunset (NOAA Solar Calculator, `calculateSunTimes`):

    dayOfYear = day-of-year(date)
    gamma = (2*PI/365) * (dayOfYear - 1)                     # fractional year, radians
    eqTime = equation-of-time(gamma)                          # minutes, Fourier series
    decl   = solar-declination(gamma)                         # radians, Fourier series
    hourAngle = acos( cos(zenith=90.833°)/(cos(lat)*cos(decl)) - tan(lat)*tan(decl) )
                clamped to [-1, 1] before acos (handles polar day/night)
    solarNoonUTC = 720 - eqTime - 4*longitude                 # minutes from UTC midnight
    sunriseUTC = solarNoonUTC - hourAngle*4
    sunsetUTC  = solarNoonUTC + hourAngle*4
    RETURN { sunrise: Date(sunriseUTC), sunset: Date(sunsetUTC) }   # built via Date.UTC, displays local

## Notes

- **Theme is applied TWICE, deliberately** — once immediately with hardcoded
  default config (Belgrade coordinates, before any network round-trip, to
  avoid a flash of the wrong theme), then `loadConfig()` fetches the real
  `location`/`svgPath`/etc. and `initSwitchDimensions()` re-reads the SVG —
  but the theme itself is NOT recomputed after config loads unless the user
  has no stored preference on the NEXT toggle. This is a deliberate flash
  vs. accuracy trade-off, not an oversight.
- **`sessionStorage`, not `localStorage`** — the user's manual toggle choice
  does not persist across browser sessions/tabs; a fresh session always
  recomputes from sunrise/sunset.
- All debug output (`console.group`/`console.log`/`console.warn`) is gated
  behind `window.MV_IS_ADMIN` throughout this file — the one module in
  [JS (folder)](../___js.md) that consistently follows that convention.
