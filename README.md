# playwright-range-fill-repro

Minimal reproduction for a Playwright bug: `locator.fill()` / `page.fill()` on `<input type=range>`
throws `Malformed value` for number strings the browser accepts but re-serializes
(`"0.850"`, `".5"`, `"+0.5"`, `"1e-3"`), while the canonical forms (`"0.85"`, `"0.5"`) work.

```sh
npm install   # also installs Chromium via postinstall
npm test
```

Expected output (Playwright 1.64.0, Chromium 156):

```
"0.850"  FAIL -> page.fill: Error: Malformed value
"0.85"   OK   -> 0.85
"1e-3"   FAIL -> page.fill: Error: Malformed value
"+0.5"   FAIL -> page.fill: Error: Malformed value
".5"     FAIL -> page.fill: Error: Malformed value
"0.5"    OK   -> 0.5
DOM: value="0.850" -> 0.85
```

Cause: the injected `fill` sets `input.value = value` and then compares `input.value !== value` as strings,
so any valid value whose canonical serialization differs from the input string is reported as malformed.
