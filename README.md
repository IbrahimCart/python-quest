# Python Quest

A game-like Python course that runs in the browser, built for phones.

- 10 units, 33 short lessons (variables to classes), each with quick quizzes and a real code challenge
- Real Python runs in the browser with [Pyodide](https://pyodide.org), so code is checked instantly
- XP, levels, daily streaks, combos, stars and badges
- Review mode, a Python playground, and offline support after the first load

**Play:** https://ibrahimcart.github.io/python-quest/

On iPhone, open it in Safari, then tap **Share → Add to Home Screen**.

Lesson order loosely follows freeCodeCamp's Python curriculum. All lesson text and exercises are original.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

| File | What it is |
|---|---|
| `lessons.js` | All course content (learn cards, quizzes, code challenges and their tests) |
| `app.js` | The game: map, lesson player, XP, streaks, badges, review, playground |
| `py-worker.js` | Runs Python in a Web Worker and checks code against tests |
| `sw.js` | Offline caching |
