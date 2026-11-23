# Python Quest

A game-like Python course that runs in the browser, built for phones.

- 10 units, 33 short lessons (variables to classes) that mix explanations with practice
- Tap-to-code exercises: fill in blanks with word chips and put code lines in order, no typing needed
- A real code challenge in every lesson, a build-it project at the end of each unit, and a 6-step final project (a Gradebook) that uses everything from the course
- Real Python runs in the browser with [Pyodide](https://pyodide.org): tap Run on any example, and code is checked instantly
- Hearts (refill over time or by reviewing), a daily XP goal, XP, levels, streaks, combos, stars and badges
- Review mode, a searchable glossary, a Python playground, and offline support after the first load

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
| `lessons.js` | Lesson content (learn cards, quizzes, code challenges and their tests) |
| `practice.js` | Tap-to-code practice (fill in the blank, put in order) for each lesson |
| `projects.js` | One multi-step project per unit |
| `glossary.js` | Glossary terms |
| `app.js` | The app: map, lesson player, hearts, daily goal, XP, badges, review, glossary, playground |
| `py-worker.js` | Runs Python in a Web Worker and checks code against tests |
| `sw.js` | Offline caching |
