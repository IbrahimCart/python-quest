// Topic practice: code problems built from templates with random values.
// Every problem is checked against a reference solution on several random
// inputs, so the answer changes each time and can't be memorized.
(() => {
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const times = (n, f) => Array.from({ length: n }, (_, i) => f(i));
  const T = (...v) => ({ __t: v }); // Python tuple
  const F = x => ({ __f: x });      // Python float (keeps 4.0 as a float)
  const nums = (n, a, b) => times(n, () => ri(a, b));

  // JS value -> Python literal
  function py(v) {
    if (v === null || v === undefined) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (typeof v === "number") return String(v);
    if (typeof v === "string") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(py).join(", ") + "]";
    if (v.__t) return "(" + v.__t.map(py).join(", ") + (v.__t.length === 1 ? "," : "") + ")";
    if (v.__f !== undefined) return Number.isInteger(v.__f) ? v.__f + ".0" : String(v.__f);
    return "{" + Object.entries(v).map(([k, x]) => py(k) + ": " + py(x)).join(", ") + "}";
  }

  const NAMES = ["ana", "li", "sam", "zoe", "omar", "maya", "ken", "ivy", "raj", "eva", "noah", "kai"];
  const ITEMS = ["apple", "bread", "milk", "rice", "tea", "eggs", "cheese", "pasta", "soap", "juice"];
  const WORDS = ["python", "planet", "rocket", "garden", "winter", "silver", "castle", "bridge", "jungle", "marble", "orange", "pencil", "dragon", "violin", "harbor", "meadow"];
  const PEOPLE = [["Ada", "Lovelace"], ["Alan", "Turing"], ["Grace", "Hopper"], ["Katherine", "Johnson"], ["Linus", "Torvalds"], ["Margaret", "Hamilton"], ["Dennis", "Ritchie"], ["Barbara", "Liskov"]];
  const SENTENCES = ["The Rain In Spain Stays Mainly", "Python Makes Problem Solving Fun", "Every Bug Teaches Something New", "Keep Calm And Keep Coding", "Tacoma Has Amazing Mountain Views", "Practice Beats Talent Every Time"];
  const mixCase = s => [...s].map(c => Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase()).join("");

  // ───── test builders (Python) ─────
  const REFRUN = String.raw`
import re as _re, io as _io, contextlib as _cl
def _refrun(_vals):
    _s = _REF
    for _k, _v in _vals.items():
        _s = _re.sub(rf"^{_k}\s*=.*$", lambda _m, _k=_k, _v=_v: f"{_k} = {_v!r}", _s, count=1, flags=_re.M)
    _b = _io.StringIO()
    _n = {"__name__": "__main__"}
    with _cl.redirect_stdout(_b):
        exec(_s, _n)
    _n["_out"] = _b.getvalue()
    return _n
`;
  function varTests(ref, cases, check = []) {
    return `_REF = ${JSON.stringify(ref)}\n${REFRUN}
for _vals in ${py(cases)}:
    _g = _rerun(**_vals)
    _e = _refrun(_vals)
    _desc = ", ".join(f"{_k} = {_v!r}" for _k, _v in _vals.items())
    _want = _e["_out"].strip()
    _got = _g["_out"].strip()
    assert _got == _want, f"With {_desc} it should print:\\n{_want}\\nbut it printed:\\n{_got or '(nothing)'}"
    for _k in ${py(check)}:
        assert _k in _g, f"Create a variable named {_k}"
        assert _g[_k] == _e[_k] and type(_g[_k]) is type(_e[_k]), f"With {_desc}, {_k} should be {_e[_k]!r}, got {_g[_k]!r}"
`;
  }
  function fnTests(name, ref, cases) {
    return `_ns = {"__name__": "__main__"}
exec(${JSON.stringify(ref)}, _ns)
_ref = _ns[${JSON.stringify(name)}]
${name}
for _a in ${py(cases.map(c => T(...c)))}:
    _call = "${name}(" + ", ".join(map(repr, _a)) + ")"
    _want = _ref(*_a)
    _got = ${name}(*_a)
    assert _got == _want and type(_got) is type(_want), f"{_call} should return {_want!r}, got {_got!r}"
`;
  }
  function clsTests(name, ref, scen) {
    return `_ns = {"__name__": "__main__"}
exec(${JSON.stringify(ref)}, _ns)
${name}
for _args, _ops in ${py(scen.map(s => T(T(...s.args), s.ops.map(o => T(o[0], T(...(o[1] || [])))))))}:
    _r = _ns[${JSON.stringify(name)}](*_args)
    _u = ${name}(*_args)
    _trail = ["${name}(" + ", ".join(map(repr, _args)) + ")"]
    for _m, _a in _ops:
        _c = f"{_m}(" + ", ".join(map(repr, _a)) + ")"
        assert hasattr(_u, _m), f"Your class needs a method named {_m}"
        _want = getattr(_r, _m)(*_a)
        _got = getattr(_u, _m)(*_a)
        assert _got == _want and type(_got) is type(_want), f"After " + " → ".join(_trail) + f", {_c} should return {_want!r}, got {_got!r}"
        _trail.append(_c)
`;
  }

  // Turns a template into a playable code step.
  function build(t) {
    const chunks = t.steps.map(s => s[1]);
    const prefix = t.setup ? t.setup + "\n" : "";
    const ref = prefix + chunks.join("\n");
    const walk = t.steps.map((s, i) => ({ say: s[0], code: prefix + chunks.slice(0, i + 1).join("\n") }));
    let tests = t.kind === "var" ? varTests(ref, t.cases, t.check || [])
      : t.kind === "cls" ? clsTests(t.name, ref, t.scen)
      : fnTests(t.name, ref, t.cases);
    if (t.need) tests = t.need.map(([cond, msg]) => `assert ${cond}, ${JSON.stringify(msg)}`).join("\n") + "\n" + tests;
    return { t: "code", q: t.q, starter: t.kind === "var" ? prefix : "", tests, hints: t.hints, walk, solution: ref };
  }

  // ───── topics and their templates ─────
  const TOPICS = [
  { id: "vars", title: "Variables & Printing", icon: "🚀", lessons: ["u1l1", "u1l2", "u1l3"], gens: [
    () => {
      const item = pick(ITEMS), qty = ri(2, 9);
      return { kind: "var", setup: `item = "${item}"\nqty = ${qty}`,
        q: `Print the order using the variables, like \`${qty} x ${item}\`.`,
        cases: [{ item, qty }, ...times(3, () => ({ item: pick(ITEMS), qty: ri(1, 20) }))],
        steps: [["`print()` puts a space between values separated by commas. Text in quotes prints as-is; names print their values.", `print(qty, "x", item)`]],
        hints: ["Mix variables and fixed text in one print().", `print(qty, "x", item)`] };
    },
    () => {
      const s = ri(10, 50), a = ri(2, 20), b = ri(1, 9);
      return { kind: "var", setup: `score = ${s}`, check: ["score"],
        q: `\`score\` starts at ${s}. Add ${a} points, then take away ${b}, then print \`score\`. Update the variable; don't type the answer.`,
        cases: [{ score: s }, { score: 0 }, { score: ri(51, 99) }],
        steps: [["A variable can be updated from its own old value.", `score = score + ${a}`],
          ["Same for taking points away. Then print.", `score = score - ${b}\nprint(score)`]],
        hints: ["The right side is worked out first, using the old value.", `score = score + ${a}, then score = score - ${b}`] };
    },
    () => {
      const n = ri(2, 9), m = ri(2, 5);
      return { kind: "var", setup: `a = ${n}`, check: ["a", "b"],
        q: `Make \`b\` a copy of \`a\`. Then change \`a\` to ${m} times its value. Print a, then b on the next line.`,
        cases: [{ a: n }, { a: ri(10, 40) }, { a: 0 }],
        steps: [["`b = a` copies the value a has right now. Changing a later won't change b.", "b = a"],
          ["Now update a, and print both.", `a = a * ${m}\nprint(a)\nprint(b)`]],
        hints: ["Copy first, change second.", `b = a, then a = a * ${m}`] };
    },
    () => {
      const [first, last] = pick(PEOPLE);
      return { kind: "var", setup: `first = "${first}"\nlast = "${last}"`,
        q: `Print the full name on one line (\`${first} ${last}\`), then directory style on the next (\`${last}, ${first}\`).`,
        cases: [{ first, last }, ...sample(PEOPLE, 2).map(([f, l]) => ({ first: f, last: l }))],
        steps: [["`+` joins text with no space, so add the space yourself.", `print(first + " " + last)`],
          ["Same idea in the other order, with a comma.", `print(last + ", " + first)`]],
        hints: ["Join strings with +. Spaces and commas go inside quotes.", `print(last + ", " + first)`] };
    },
  ] },

  { id: "types", title: "Types & Conversion", icon: "🧩", lessons: ["u2l1", "u2l2", "u2l3"], gens: [
    () => {
      const a = String(ri(1, 9)), b = String(ri(1, 9));
      return { kind: "var", setup: `a_text = "${a}"\nb_text = "${b}"`,
        q: `\`a_text\` and \`b_text\` hold numbers as text. Print them glued together (\`${a}${b}\`), then on the next line their real sum (\`${+a + +b}\`).`,
        cases: [{ a_text: a, b_text: b }, { a_text: String(ri(10, 99)), b_text: String(ri(1, 9)) }, { a_text: "0", b_text: String(ri(1, 50)) }],
        steps: [["`+` on two strings joins them.", "print(a_text + b_text)"],
          ["`int()` turns text into a number, so `+` adds.", "print(int(a_text) + int(b_text))"]],
        hints: ["Text + text glues. Number + number adds.", "print(int(a_text) + int(b_text))"] };
    },
    () => {
      const v = Math.random() < 0.5 ? ri(1, 20) : ri(10, 200) / 10;
      return { kind: "var", setup: `value = ${py(F(v))}`, check: ["is_whole"],
        q: "Set `is_whole` to True if the float `value` has nothing after the decimal point (like `4.0`), otherwise False.",
        cases: [{ value: F(v) }, { value: F(ri(1, 50)) }, { value: F(ri(1, 50) + 0.5) }, { value: F(0.25) }],
        steps: [["`int()` drops the decimal part. If that doesn't change the value, it was whole. A comparison already gives True or False.", "is_whole = value == int(value)"]],
        hints: ["What does int() do to 4.7? And to 4.0?", "is_whole = value == int(value)"] };
    },
    () => {
      const c = ri(-100, 400) / 10;
      return { kind: "var", setup: `c_text = "${c}"`,
        q: "`c_text` is a Celsius temperature as text. Print it in Fahrenheit (C × 9 / 5 + 32), rounded to 1 decimal.",
        cases: [{ c_text: String(c) }, { c_text: String(ri(0, 40)) }, { c_text: String(ri(-200, 0) / 10) }],
        steps: [["Text can't do math. `float()` reads decimals.", "c = float(c_text)"],
          ["Apply the formula, then round to 1 decimal.", "print(round(c * 9 / 5 + 32, 1))"]],
        hints: ["Convert first, then calculate.", "print(round(float(c_text) * 9 / 5 + 32, 1))"] };
    },
    () => {
      const n = String(ri(10, 99999));
      return { kind: "var", setup: `n_text = "${n}"`,
        q: `Print how many digits \`n_text\` has, then on the next line the number doubled (\`${n.length}\` then \`${+n * 2}\` here).`,
        cases: [{ n_text: n }, { n_text: String(ri(1, 9)) }, { n_text: String(ri(100000, 999999)) }],
        steps: [["As text, `len()` counts the characters, which are the digits.", "print(len(n_text))"],
          ["As a number, `*` multiplies.", "print(int(n_text) * 2)"]],
        hints: ["Which job needs text, and which needs a number?", "print(len(n_text)) and print(int(n_text) * 2)"] };
    },
  ] },

  { id: "math", title: "Math & Operators", icon: "🔢", lessons: ["u3l1", "u3l2", "u3l3", "u3l4"], gens: [
    () => {
      const s = ri(61, 900);
      return { kind: "var", setup: `seconds = ${s}`,
        q: `Print \`seconds\` as minutes and seconds, like \`${Math.floor(s / 60)} min ${s % 60} s\`.`,
        cases: [{ seconds: s }, { seconds: 59 }, { seconds: 120 }, { seconds: ri(1000, 4000) }],
        steps: [["`//` gives whole minutes. `%` gives the seconds left over.", `print(seconds // 60, "min", seconds % 60, "s")`]],
        hints: ["One operator gives whole minutes, another gives the remainder.", "seconds // 60 and seconds % 60"] };
    },
    () => {
      const total = ri(20, 99), per = ri(3, 9);
      return { kind: "var", setup: `total = ${total}\nper_box = ${per}`,
        q: `Print how many boxes can be completely filled, then on the next line how many items are left over.`,
        cases: [{ total, per_box: per }, { total: ri(1, 5), per_box: 6 }, { total: 48, per_box: 12 }, { total: ri(100, 500), per_box: ri(7, 13) }],
        steps: [["Full boxes: how many times per_box fits, with `//`.", "print(total // per_box)"],
          ["Leftovers: the remainder, with `%`.", "print(total % per_box)"]],
        hints: ["This is division with a remainder.", "total // per_box, then total % per_box"] };
    },
    () => {
      const r = ri(1, 20);
      return { kind: "var", setup: `r = ${r}`,
        q: "Print the area of a circle with radius `r`, using `3.14159` for π, rounded to 2 decimals.",
        cases: [{ r }, { r: 1 }, { r: ri(21, 60) }],
        steps: [["Area is π × r². `**` raises to a power.", "area = 3.14159 * r ** 2"],
          ["Round when printing.", "print(round(area, 2))"]],
        hints: ["r² is r ** 2.", "print(round(3.14159 * r ** 2, 2))"] };
    },
    () => {
      const y = pick([ri(1901, 1999), ri(2001, 2099)]);
      return { kind: "var", setup: `year = ${y}`,
        q: `Print the first two digits of \`year\`, then the last two as a number (${y} → \`${Math.floor(y / 100)}\` then \`${y % 100}\`). Use math, not strings.`,
        cases: [{ year: y }, { year: 2005 }, { year: ri(1500, 1899) }],
        need: [['"str" not in _src', "Use // and %, not str()"]],
        steps: [["`// 100` chops off the last two digits.", "print(year // 100)"],
          ["`% 100` keeps only the last two.", "print(year % 100)"]],
        hints: ["Dividing by 100 splits the number in two.", "year // 100 and year % 100"] };
    },
    () => {
      const n = ri(2, 9);
      return { kind: "var", setup: `n = ${n}`,
        q: "Print `n` squared, then `n` cubed, then 2 to the power of `n`, each on its own line.",
        cases: [{ n }, { n: 0 }, { n: ri(10, 20) }],
        steps: [["`**` is the power operator.", "print(n ** 2)\nprint(n ** 3)"],
          ["The base can be any number, not just n.", "print(2 ** n)"]],
        hints: ["Squared means to the power 2.", "n ** 2, n ** 3, 2 ** n"] };
    },
  ] },

  { id: "strings", title: "Strings & Methods", icon: "🔤", lessons: ["u4l1", "u4l4"], gens: [
    () => {
      const w = pick(WORDS);
      return { kind: "var", setup: `word = "${w}"`,
        q: `Print the first and last letters of \`word\` together in uppercase (\`${(w[0] + w.at(-1)).toUpperCase()}\` here).`,
        cases: [{ word: w }, { word: pick(WORDS) }, { word: "a" }],
        steps: [["Index 0 is the first character, and -1 is the last.", "ends = word[0] + word[-1]"],
          ["`.upper()` makes a new uppercase string.", "print(ends.upper())"]],
        hints: ["Negative indexes count from the end.", "print((word[0] + word[-1]).upper())"] };
    },
    () => {
      const mk = () => { const [f, l] = pick(PEOPLE); return " ".repeat(ri(1, 3)) + mixCase(f) + " " + mixCase(l) + " ".repeat(ri(1, 3)); };
      const n = mk();
      return { kind: "var", setup: `name = ${JSON.stringify(n)}`,
        q: "Clean up `name`: remove the spaces at both ends and capitalize each word. Print it.",
        cases: [{ name: n }, { name: mk() }, { name: mk() }],
        steps: [["`.strip()` removes spaces at both ends.", "clean = name.strip()"],
          ["`.title()` capitalizes each word and lowercases the rest. Methods can be chained.", "print(clean.title())"]],
        hints: ["Two string methods, one after the other.", "print(name.strip().title())"] };
    },
    () => {
      const s = pick(SENTENCES), letter = pick([...new Set(s.toLowerCase().replace(/ /g, ""))]);
      return { kind: "var", setup: `sentence = "${s}"\nletter = "${letter}"`,
        q: "Print how many times `letter` appears in `sentence`, ignoring upper and lower case.",
        cases: [{ sentence: s, letter }, { sentence: pick(SENTENCES), letter: pick(["e", "a", "t", "z"]) }, { sentence: "AaAa", letter: "a" }],
        steps: [["Make the case match first: lowercase the sentence.", "low = sentence.lower()"],
          ["`.count()` counts how many times a piece of text appears.", "print(low.count(letter))"]],
        hints: ["\"A\" and \"a\" are different characters until you change the case.", "print(sentence.lower().count(letter))"] };
    },
    () => {
      const mk = () => `${pick(NAMES)}${ri(1, 99)}@${pick(["mail", "school", "uw", "quest"])}.com`;
      const e = mk();
      return { kind: "var", setup: `email = "${e}"`,
        q: `Print the username (before the @), then on the next line the site name without \`.com\` (\`${e.split("@")[0]}\` then \`${e.split("@")[1].replace(".com", "")}\`).`,
        cases: [{ email: e }, { email: mk() }, { email: mk() }],
        steps: [["`.split(\"@\")` breaks the text into a list of 2 parts.", "parts = email.split(\"@\")\nprint(parts[0])"],
          ["`.replace()` swaps `.com` for nothing.", "print(parts[1].replace(\".com\", \"\"))"]],
        hints: ["Split on the @ sign.", "email.split(\"@\") gives [user, site.com]"] };
    },
    () => {
      const s = pick(SENTENCES), words = s.split(" "), a = pick(words), b = pick(WORDS);
      return { kind: "var", setup: `text = "${s}"\nold = "${a}"\nnew = "${b}"`,
        q: "Print `text` with `old` replaced by `new`, all in uppercase.",
        cases: [{ text: s, old: a, new: b }, { text: "a b a", old: "a", new: "c" }, { text: pick(SENTENCES), old: "e", new: "3" }],
        steps: [["`.replace(old, new)` swaps every match and returns a new string.", "swapped = text.replace(old, new)"],
          ["Then uppercase it.", "print(swapped.upper())"]],
        hints: ["Replace first, then uppercase. (Uppercasing first could stop old from matching.)", "print(text.replace(old, new).upper())"] };
    },
  ] },

  { id: "slicing", title: "Slicing & f-strings", icon: "✂️", lessons: ["u4l2", "u4l3"], gens: [
    () => {
      const w = pick(WORDS);
      return { kind: "var", setup: `word = "${w}"`,
        q: `Print \`word\` backwards, then on the next line only its first 3 letters (\`${[...w].reverse().join("")}\` then \`${w.slice(0, 3)}\`).`,
        cases: [{ word: w }, { word: pick(WORDS) }, { word: "ab" }],
        steps: [["A step of -1 walks backwards through the whole string.", "print(word[::-1])"],
          ["Leave out the start to begin at 0. The end index isn't included.", "print(word[:3])"]],
        hints: ["Slices are [start:end:step].", "word[::-1] and word[:3]"] };
    },
    () => {
      const L = () => String.fromCharCode(65 + ri(0, 25));
      const mk = () => `${L()}${L()}-${ri(1000, 9999)}-${L()}${L()}`;
      const c = mk();
      return { kind: "var", setup: `code = "${c}"`,
        q: `Codes always look like \`${c}\`. Print the 4 digits in the middle, then on the next line the last 2 letters.`,
        cases: [{ code: c }, { code: mk() }, { code: mk() }],
        steps: [["Count positions: 0–1 letters, 2 dash, 3–6 digits. The end index is one past the last one you want.", "print(code[3:7])"],
          ["Negative indexes count from the end.", "print(code[-2:])"]],
        hints: ["Write the index under each character.", "code[3:7] and code[-2:]"] };
    },
    () => {
      const item = pick(ITEMS), price = ri(2, 9), qty = ri(2, 6);
      return { kind: "var", setup: `item = "${item}"\nprice = ${price}\nqty = ${qty}`,
        q: `Use an f-string to print a receipt line like \`${qty} x ${item} = $${price * qty}\`.`,
        cases: [{ item, price, qty }, { item: pick(ITEMS), price: ri(10, 30), qty: 1 }, { item: pick(ITEMS), price: ri(1, 5), qty: ri(7, 12) }],
        need: [[`'f"' in _src or "f'" in _src`, "Use an f-string"]],
        steps: [["Inside an f-string, `{}` can hold a calculation, not just a name. The `$` is plain text.", 'print(f"{qty} x {item} = ${price * qty}")']],
        hints: ["Put f before the quotes, and names in {}.", 'f"{qty} x {item} = ${price * qty}"'] };
    },
    () => {
      const [f] = pick(PEOPLE), age = ri(15, 40), y = ri(2, 10);
      return { kind: "var", setup: `name = "${f}"\nage = ${age}\nyears = ${y}`,
        q: `Use an f-string to print \`${f} will be ${age + y} in ${y} years.\``,
        cases: [{ name: f, age, years: y }, { name: pick(PEOPLE)[0], age: ri(1, 10), years: ri(11, 30) }, { name: "Kai", age: 20, years: 1 }],
        need: [[`'f"' in _src or "f'" in _src`, "Use an f-string"]],
        steps: [["Each `{}` holds a value. The future age is a calculation inside the braces.", 'print(f"{name} will be {age + years} in {years} years.")']],
        hints: ["Don't forget the full stop at the end.", 'f"{name} will be {age + years} in {years} years."'] };
    },
    () => {
      const [f, l] = pick(PEOPLE);
      return { kind: "var", setup: `first = "${f}"\nlast = "${l}"`,
        q: `Use an f-string and indexing to print a short name like \`${f[0]}. ${l}\`.`,
        cases: [{ first: f, last: l }, ...sample(PEOPLE, 2).map(([a, b]) => ({ first: a, last: b }))],
        need: [[`'f"' in _src or "f'" in _src`, "Use an f-string"]],
        steps: [["`first[0]` is the first letter. It can go straight into an f-string.", 'print(f"{first[0]}. {last}")']],
        hints: ["Index 0 of first gives the initial.", 'f"{first[0]}. {last}"'] };
    },
  ] },

  { id: "decisions", title: "Decisions", icon: "🔀", lessons: ["u5l1", "u5l2", "u5l3"], gens: [
    () => {
      const lo = ri(5, 12), hi = ri(20, 28), t = ri(-5, 35);
      return { kind: "var", setup: `temp = ${t}`, check: ["label"],
        q: `Set \`label\` to \`"cold"\` when \`temp\` is below ${lo}, \`"mild"\` when it's below ${hi}, and \`"hot"\` otherwise.`,
        cases: [{ temp: t }, { temp: lo - 1 }, { temp: lo }, { temp: hi - 1 }, { temp: hi }, { temp: ri(30, 45) }],
        steps: [["Check the lowest range first.", `if temp < ${lo}:\n    label = "cold"`],
          ["`elif` only runs when the first check failed, so temp is already at least " + lo + " here.", `elif temp < ${hi}:\n    label = "mild"`],
          ["Everything left is hot.", `else:\n    label = "hot"`]],
        hints: ["Order matters: start with the smallest.", `if temp < ${lo}: ... elif temp < ${hi}: ... else: ...`] };
    },
    () => {
      const [x, y] = pick([[3, 5], [2, 7], [3, 4], [5, 7], [2, 9]]), n = ri(1, 100);
      return { kind: "var", setup: `n = ${n}`, check: ["kind"],
        q: `Set \`kind\` to \`"both"\` if \`n\` divides evenly by ${x} and by ${y}, \`"${x}"\` if only by ${x}, \`"${y}"\` if only by ${y}, and \`"neither"\` otherwise.`,
        cases: [{ n }, { n: x * y }, { n: x * y * 2 }, { n: x }, { n: y }, { n: x * y + 1 }],
        steps: [["Check the strictest case first, or a smaller check would grab it.", `if n % ${x} == 0 and n % ${y} == 0:\n    kind = "both"`],
          ["Then each single case.", `elif n % ${x} == 0:\n    kind = "${x}"\nelif n % ${y} == 0:\n    kind = "${y}"`],
          ["Anything else.", `else:\n    kind = "neither"`]],
        hints: ["If you check one number first, \"both\" never gets a chance.", `Start with: if n % ${x} == 0 and n % ${y} == 0:`] };
    },
    () => {
      const kid = ri(3, 6), adult = ri(10, 16), senior = ri(5, 8), off = ri(1, 3);
      return { kind: "var", setup: `age = ${ri(5, 70)}\nmember = ${pick(["True", "False"])}`, check: ["price"],
        q: `Set \`price\`: under 12 pays ${kid}, 65 or over pays ${senior}, everyone else pays ${adult}. Members get ${off} off any price.`,
        cases: [{ age: 30, member: false }, { age: 11, member: true }, { age: 12, member: false }, { age: 64, member: true }, { age: 65, member: false }, { age: 80, member: true }],
        steps: [["Pick the base price by age.", `if age < 12:\n    price = ${kid}\nelif age >= 65:\n    price = ${senior}\nelse:\n    price = ${adult}`],
          ["The member discount applies on top, so it's a separate if.", `if member:\n    price = price - ${off}`]],
        hints: ["Two separate decisions: the age price, then the discount.", `After the if / elif / else, add: if member: price = price - ${off}`] };
    },
    () => {
      const L = ri(6, 10), mk = () => pick([mixCase(pick(WORDS)), pick(WORDS), pick(WORDS).toUpperCase(), pick(WORDS).slice(0, 4)]) + (Math.random() < 0.5 ? ri(1, 99) : "");
      const p = mk();
      return { kind: "var", setup: `password = "${p}"`, check: ["strong"],
        q: `Set \`strong\` to True only if \`password\` is at least ${L} characters long **and** has at least one uppercase letter.`,
        cases: [{ password: p }, { password: "a".repeat(L) }, { password: "A".repeat(L) }, { password: "Ab" }, { password: "x".repeat(L - 1) + "Q" }, { password: mk() }],
        steps: [["Length check.", `long_enough = len(password) >= ${L}`],
          ["If lowercasing the text changes it, it had an uppercase letter.", "has_upper = password != password.lower()"],
          ["Both must be true.", "strong = long_enough and has_upper"]],
        hints: ["Compare password with password.lower(). When are they different?", `strong = len(password) >= ${L} and password != password.lower()`] };
    },
    () => {
      const lo = ri(1, 20), hi = lo + ri(5, 30), x = ri(lo - 5, hi + 5);
      return { kind: "var", setup: `x = ${x}\nlo = ${lo}\nhi = ${hi}`,
        q: "Print `inside` if `x` is between `lo` and `hi` (including both ends), otherwise print `outside`.",
        cases: [{ x, lo, hi }, { x: lo, lo, hi }, { x: hi, lo, hi }, { x: lo - 1, lo, hi }, { x: hi + 1, lo, hi }],
        steps: [["Python lets you chain comparisons: `lo <= x <= hi`.", `if lo <= x <= hi:\n    print("inside")`],
          ["Everything else is outside.", `else:\n    print("outside")`]],
        hints: ["Including the ends means <=, not <.", "if lo <= x <= hi:"] };
    },
  ] },

  { id: "functions", title: "Functions", icon: "🧰", lessons: ["u6l1", "u6l2", "u6l3"], gens: [
    () => {
      const lo = ri(0, 10), hi = lo + ri(5, 20);
      return { kind: "fn", name: "clamp",
        q: `Write \`clamp(x, lo, hi)\` that returns \`x\`, but never below \`lo\` or above \`hi\`. \`clamp(${hi + 3}, ${lo}, ${hi})\` → \`${hi}\`.`,
        cases: [[hi + 3, lo, hi], [lo - 2, lo, hi], [lo + 1, lo, hi], [lo, lo, hi], [hi, lo, hi], [ri(-50, 50), -10, 10]],
        steps: [["Handle the two edges first. `return` ends the function right away.", "def clamp(x, lo, hi):\n    if x < lo:\n        return lo\n    if x > hi:\n        return hi"],
          ["If neither edge was hit, x is fine as it is.", "    return x"]],
        hints: ["There are three outcomes: lo, hi, or x.", "if x < lo: return lo, if x > hi: return hi, then return x"] };
    },
    () => {
      const mk = () => { const [f, l] = pick(PEOPLE); return mixCase(f) + " " + mixCase(l.split(" ")[0]); };
      const n = mk();
      return { kind: "fn", name: "initials",
        q: `Write \`initials(full_name)\` for a two-word name that returns uppercase initials with dots: \`initials("${n}")\` → \`"${n.split(" ").map(w => w[0].toUpperCase() + ".").join("")}"\`.`,
        cases: [[n], [mk()], [mk()], ["a b"]],
        steps: [["`.split()` gives a list of the two words.", "def initials(full_name):\n    words = full_name.split()"],
          ["Take letter 0 of each word, uppercase it, and add the dots.", "    return words[0][0].upper() + \".\" + words[1][0].upper() + \".\""]],
        hints: ["words[0][0] is the first letter of the first word.", "Split, then build the result from words[0][0] and words[1][0]."] };
    },
    () => {
      const rate = pick([5, 8, 10, 12, 15, 20]), p = ri(500, 5000) / 100;
      return { kind: "fn", name: "with_tax",
        q: `Write \`with_tax(price, rate=${rate})\` that returns the price plus \`rate\` percent tax, rounded to 2 decimals. \`rate\` defaults to ${rate}.`,
        cases: [[F(p)], [100], [F(ri(100, 9999) / 100), 0], [50, 25], [F(ri(100, 9999) / 100), ri(1, 30)]],
        steps: [["A default goes in the def line. It's used when the caller leaves that argument out.", `def with_tax(price, rate=${rate}):`],
          ["Adding rate% means multiplying by 1 + rate / 100.", "    return round(price * (1 + rate / 100), 2)"]],
        hints: [`def with_tax(price, rate=${rate}):`, "return round(price * (1 + rate / 100), 2)"] };
    },
    () => {
      const top = ri(85, 95), st = ri(5, 10), c = [top, top - st, top - 2 * st, top - 3 * st];
      return { kind: "fn", name: "letter",
        q: `Write \`letter(score)\` that returns \`"A"\` for ${c[0]}+, \`"B"\` for ${c[1]}+, \`"C"\` for ${c[2]}+, \`"D"\` for ${c[3]}+, and \`"F"\` below that.`,
        cases: [[100], [c[0]], [c[0] - 1], [c[1]], [c[2]], [c[3]], [c[3] - 1], [ri(0, 40)]],
        steps: [["Start from the top grade. The first match returns.", `def letter(score):\n    if score >= ${c[0]}:\n        return "A"`],
          ["Each `elif` only runs if the ones above failed.", `    elif score >= ${c[1]}:\n        return "B"\n    elif score >= ${c[2]}:\n        return "C"\n    elif score >= ${c[3]}:\n        return "D"`],
          ["Anything left fails.", '    return "F"']],
        hints: ["Check the highest cutoff first.", `if score >= ${c[0]}: return "A", then elif for each grade below`] };
    },
    () => ({ kind: "fn", name: "is_between",
      q: "Write `is_between(x, a, b)` that returns True if `x` is between `a` and `b` (including both), **whichever of a and b is bigger**.",
      cases: [[5, 1, 10], [5, 10, 1], [0, 1, 10], [10, 10, 1], [ri(-20, 20), ri(-10, 0), ri(0, 10)], [3, 3, 3]],
      steps: [["Find which end is smaller with `min()` and which is bigger with `max()`.", "def is_between(x, a, b):\n    low = min(a, b)\n    high = max(a, b)"],
        ["Then a chained comparison.", "    return low <= x <= high"]],
      hints: ["is_between(5, 10, 1) should be True.", "low = min(a, b), high = max(a, b)"] }),
    () => {
      const tip = pick([10, 15, 18, 20]);
      return { kind: "fn", name: "split_bill",
        q: `Write \`split_bill(total, people, tip=${tip})\` that adds \`tip\` percent to the total, splits it evenly, and returns each share rounded to 2 decimals.`,
        cases: [[100, 4], [F(ri(1000, 20000) / 100), ri(2, 6)], [60, 3, 0], [ri(20, 200), ri(1, 8), ri(5, 25)]],
        steps: [["Default value in the def line.", `def split_bill(total, people, tip=${tip}):`],
          ["Add the tip, then divide.", "    with_tip = total * (1 + tip / 100)\n    return round(with_tip / people, 2)"]],
        hints: ["Tip first, then split.", "round(total * (1 + tip / 100) / people, 2)"] };
    },
  ] },

  { id: "loops", title: "Loops", icon: "🔁", lessons: ["u7l1", "u7l2", "u7l3"], gens: [
    () => {
      const mk = () => pick(WORDS) + ri(0, 999) + pick(["", "x", "!"]) + ri(0, 9);
      return { kind: "fn", name: "count_digits",
        q: `Write \`count_digits(text)\` that returns how many characters in \`text\` are digits. \`count_digits("${"ab12c3"}")\` → \`3\`.`,
        cases: [["ab12c3"], [mk()], [mk()], [""], ["no digits"]],
        steps: [["Start a counter and look at each character.", "def count_digits(text):\n    count = 0\n    for ch in text:"],
          ["`in` checks if a character is one of the digits.", "        if ch in \"0123456789\":\n            count += 1"],
          ["Return after the loop finishes.", "    return count"]],
        hints: ["Loop over the string itself: for ch in text:", "if ch in \"0123456789\": count += 1"] };
    },
    () => ({ kind: "fn", name: "factorial",
      q: `Write \`factorial(n)\` that returns 1 × 2 × … × n. \`factorial(5)\` → \`120\`, and \`factorial(0)\` → \`1\`.`,
      cases: [[5], [0], [1], [ri(6, 12)], [ri(13, 20)]],
      steps: [["Multiplying starts at 1, not 0.", "def factorial(n):\n    result = 1"],
        ["`range(1, n + 1)` includes n. For n = 0 the loop doesn't run, so 1 is returned.", "    for i in range(1, n + 1):\n        result *= i\n    return result"]],
      hints: ["What's the starting value for a running product?", "result = 1, then for i in range(1, n + 1): result *= i"] }),
    () => {
      const k = ri(3, 9);
      return { kind: "fn", name: "sum_multiples",
        q: `Write \`sum_multiples(a, b, k)\` that returns the sum of every number from \`a\` to \`b\` (including both) that divides evenly by \`k\`. \`sum_multiples(1, 10, 3)\` → \`18\`.`,
        cases: [[1, 10, 3], [ri(1, 20), ri(30, 80), k], [5, 5, 5], [7, 8, 9], [ri(1, 5), ri(100, 300), ri(2, 12)]],
        steps: [["Running total, and a range that includes b.", "def sum_multiples(a, b, k):\n    total = 0\n    for n in range(a, b + 1):"],
          ["Only add n when it divides evenly.", "        if n % k == 0:\n            total += n\n    return total"]],
        hints: ["range stops before its end, so add 1.", "for n in range(a, b + 1): if n % k == 0: total += n"] };
    },
    () => ({ kind: "fn", name: "digit_sum",
      q: "Write `digit_sum(n)` that returns the sum of the digits of any whole number `n` (0 or more) **without** using `str()`. `digit_sum(4096)` → `19`.",
      need: [['"str" not in _src', "Solve it with % and //, not str()"]],
      cases: [[4096], [0], [7], [ri(10000, 9999999)], [ri(100, 999)]],
      steps: [["You don't know how many digits there are, so loop while digits are left.", "def digit_sum(n):\n    total = 0\n    while n > 0:"],
        ["Take the last digit with `% 10`, then chop it off with `// 10`.", "        total += n % 10\n        n //= 10\n    return total"]],
      hints: ["n % 10 is the last digit; n // 10 removes it.", "while n > 0: total += n % 10, then n //= 10"] }),
    () => {
      const mk = () => pick([pick(WORDS), "abcdef", "aabb", "abccba", "xyz", "bookkeeper", "letter", "mississippi"]);
      return { kind: "fn", name: "first_double",
        q: "Write `first_double(s)` that returns the first character that appears twice **in a row**, or `\"\"` if there isn't one. `first_double(\"balloon\")` → `\"l\"`.",
        cases: [["balloon"], [mk()], [mk()], [""], ["x"], ["abba"]],
        steps: [["Compare each character with the one after it. Stop one early so i + 1 stays in range.", "def first_double(s):\n    for i in range(len(s) - 1):"],
          ["Return as soon as you find a match. If the loop ends, there wasn't one.", "        if s[i] == s[i + 1]:\n            return s[i]\n    return \"\""]],
        hints: ["Use indexes so you can look at s[i + 1].", "for i in range(len(s) - 1): if s[i] == s[i + 1]: return s[i]"] };
    },
    () => ({ kind: "fn", name: "countdown",
      q: "Write `countdown(n)` that returns text counting down from `n`, then `Go!`. `countdown(3)` → `\"3 2 1 Go!\"`, and `countdown(0)` → `\"Go!\"`.",
      cases: [[3], [0], [1], [ri(5, 12)]],
      steps: [["Build the text up in a variable.", "def countdown(n):\n    text = \"\""],
        ["`range(n, 0, -1)` counts down and stops before 0.", "    for i in range(n, 0, -1):\n        text += str(i) + \" \"\n    return text + \"Go!\""]],
      hints: ["range can count backwards with a step of -1.", "for i in range(n, 0, -1): text += str(i) + \" \""] }),
  ] },

  { id: "lists", title: "Lists", icon: "📦", lessons: ["u8l1", "u8l2"], gens: [
    () => {
      const xs = nums(ri(5, 8), 1, 50), lim = ri(10, 40);
      return { kind: "fn", name: "above",
        q: `Write \`above(nums, limit)\` that returns a new list of the numbers greater than \`limit\`, in order. \`above(${py(xs)}, ${lim})\` → \`${py(xs.filter(x => x > lim))}\`.`,
        cases: [[xs, lim], [nums(6, -10, 10), 0], [[], 5], [[1, 2, 3], 3]],
        steps: [["Start an empty list to collect matches.", "def above(nums, limit):\n    result = []\n    for n in nums:"],
          ["Append only the ones that pass.", "        if n > limit:\n            result.append(n)\n    return result"]],
        hints: ["Build a new list with append().", "for n in nums: if n > limit: result.append(n)"] };
    },
    () => {
      const xs = nums(ri(4, 7), 0, 40);
      return { kind: "fn", name: "biggest_jump",
        q: `Write \`biggest_jump(nums)\` that returns the largest difference (up or down) between two neighbors. Return 0 if there are fewer than 2 numbers.`,
        cases: [[xs], [[5, 1, 8]], [[3]], [[]], [nums(8, -20, 20)]],
        steps: [["Start at 0, which also covers short lists. Compare each item with the one before it.", "def biggest_jump(nums):\n    best = 0\n    for i in range(1, len(nums)):"],
          ["`abs()` makes a drop count the same as a rise.", "        jump = abs(nums[i] - nums[i - 1])\n        if jump > best:\n            best = jump\n    return best"]],
        hints: ["Loop over indexes from 1 so nums[i - 1] exists.", "jump = abs(nums[i] - nums[i - 1])"] };
    },
    () => {
      const it = sample(ITEMS, 4), x = it[0], xs = shuffle([...it, x, x]);
      return { kind: "fn", name: "without",
        q: `Write \`without(items, x)\` that returns a new list with every \`x\` removed. Don't change \`items\`.`,
        cases: [[xs, x], [[1, 2, 1, 1], 1], [[], "a"], [["a"], "b"]],
        steps: [["Make a new list instead of removing from the old one.", "def without(items, x):\n    result = []"],
          ["Keep everything that isn't x.", "    for item in items:\n        if item != x:\n            result.append(item)\n    return result"]],
        hints: ["remove() only takes out the first match and changes the original.", "Append each item that != x to a new list."] };
    },
    () => {
      const xs = nums(ri(5, 9), 1, 99), n = ri(2, 4);
      return { kind: "fn", name: "top_n",
        q: `Write \`top_n(nums, n)\` that returns the \`n\` biggest numbers, biggest first. \`top_n(${py(xs)}, ${n})\` → \`${py(xs.slice().sort((a, b) => b - a).slice(0, n))}\`.`,
        cases: [[xs, n], [[3, 1, 2], 5], [[4, 4, 1], 2], [nums(10, -50, 50), 3]],
        steps: [["`sorted(..., reverse=True)` returns a new list, biggest first.", "def top_n(nums, n):\n    ordered = sorted(nums, reverse=True)"],
          ["Slice the first n. A slice past the end just gives what's there.", "    return ordered[:n]"]],
        hints: ["Sort, then slice.", "return sorted(nums, reverse=True)[:n]"] };
    },
    () => {
      const xs = sample(WORDS, 5), k = ri(1, 4);
      return { kind: "fn", name: "rotate",
        q: `Write \`rotate(items, k)\` that moves the first \`k\` items to the end. \`k\` can be bigger than the list. \`rotate([1, 2, 3, 4], 1)\` → \`[2, 3, 4, 1]\`. An empty list stays empty.`,
        cases: [[[1, 2, 3, 4], 1], [xs, k], [[1, 2, 3], 5], [[], 3], [[7], 2]],
        steps: [["Guard the empty list first, or `%` would divide by 0. Then `% len` wraps big k around.", "def rotate(items, k):\n    if not items:\n        return []\n    k = k % len(items)"],
          ["Everything from k on, then the first k.", "    return items[k:] + items[:k]"]],
        hints: ["Two slices joined with +.", "items[k:] + items[:k], after k = k % len(items)"] };
    },
  ] },

  { id: "tuples", title: "Tuples & Comprehensions", icon: "🎁", lessons: ["u8l3", "u8l4"], gens: [
    () => {
      const xs = nums(ri(5, 8), -9, 15);
      return { kind: "fn", name: "odd_squares",
        q: `Write \`odd_squares(nums)\` that returns the squares of the odd numbers, in order, using one list comprehension. \`odd_squares(${py(xs)})\` → \`${py(xs.filter(x => Math.abs(x) % 2 === 1).map(x => x * x))}\`.`,
        need: [['"[" in _src and "for" in _src', "Use a list comprehension"]],
        cases: [[xs], [[2, 4]], [[]], [nums(10, -20, 20)]],
        steps: [["A comprehension reads: what to keep, the loop, then the filter.", "def odd_squares(nums):\n    return [n * n for n in nums if n % 2 == 1]"]],
        hints: ["[expression for n in nums if condition]", "[n * n for n in nums if n % 2 == 1]"] };
    },
    () => {
      const ps = times(ri(2, 4), () => T(pick(NAMES), ri(1, 99)));
      return { kind: "fn", name: "flip",
        q: "Write `flip(pairs)` that takes a list of `(a, b)` tuples and returns a list of `(b, a)` tuples.",
        cases: [[ps], [[]], [[T(1, 2)]]],
        steps: [["Unpack each tuple right in the loop, then build the flipped one.", "def flip(pairs):\n    return [(b, a) for a, b in pairs]"]],
        hints: ["for a, b in pairs unpacks each tuple.", "[(b, a) for a, b in pairs]"] };
    },
    () => {
      const xs = nums(ri(3, 7), 1, 100);
      return { kind: "fn", name: "stats",
        q: `Write \`stats(nums)\` that returns a tuple \`(smallest, largest, average)\` with the average rounded to 1 decimal. Assume the list isn't empty.`,
        cases: [[xs], [[5]], [[1, 2]], [nums(9, -30, 30)]],
        steps: [["Built-ins do the heavy lifting.", "def stats(nums):\n    avg = round(sum(nums) / len(nums), 1)"],
          ["Commas after return make a tuple.", "    return min(nums), max(nums), avg"]],
        hints: ["min(), max(), sum() and len() all work on lists.", "return min(nums), max(nums), round(sum(nums) / len(nums), 1)"] };
    },
    () => {
      const ws = sample([...WORDS, "a", "to", "sky", "map"], 6), k = ri(3, 5);
      return { kind: "fn", name: "long_words",
        q: `Write \`long_words(words, k)\` that returns a list of \`(word, length)\` tuples for every word longer than \`k\`, using a comprehension.`,
        need: [['"for" in _src', "Use a comprehension"]],
        cases: [[ws, k], [["hi", "hello"], 2], [[], 1], [sample(WORDS, 4), 10]],
        steps: [["The kept item is a tuple, so it needs parentheses.", "def long_words(words, k):\n    return [(w, len(w)) for w in words if len(w) > k]"]],
        hints: ["Keep (w, len(w)) when len(w) > k.", "[(w, len(w)) for w in words if len(w) > k]"] };
    },
    () => {
      const n = ri(2, 4), g = times(n, () => nums(n, 0, 9));
      return { kind: "fn", name: "diagonal",
        q: `Write \`diagonal(grid)\` for a square list of lists that returns the top-left to bottom-right diagonal. \`diagonal([[1, 2], [3, 4]])\` → \`[1, 4]\`.`,
        cases: [[[[1, 2], [3, 4]]], [g], [[[7]]], [times(5, () => nums(5, -9, 9))]],
        steps: [["Diagonal items have the same row and column index: grid[0][0], grid[1][1], and so on.", "def diagonal(grid):\n    return [grid[i][i] for i in range(len(grid))]"]],
        hints: ["Which items have matching row and column numbers?", "[grid[i][i] for i in range(len(grid))]"] };
    },
  ] },

  { id: "dicts", title: "Dictionaries", icon: "🗂️", lessons: ["u9l1", "u9l2"], gens: [
    () => {
      const t = times(ri(5, 8), () => pick(["the", "cat", "The", "sat", "on", "mat", "CAT", "a"])).join(" ");
      return { kind: "fn", name: "word_counts",
        q: "Write `word_counts(text)` that returns a dict of how many times each word appears, ignoring case. `word_counts(\"A b a\")` → `{\"a\": 2, \"b\": 1}`.",
        cases: [["A b a"], [t], [""], ["One"]],
        steps: [["Lowercase, then split into words.", "def word_counts(text):\n    counts = {}\n    for w in text.lower().split():"],
          ["The counting pattern: `.get(w, 0)` gives 0 the first time.", "        counts[w] = counts.get(w, 0) + 1\n    return counts"]],
        hints: ["Lowercase before you split.", "counts[w] = counts.get(w, 0) + 1"] };
    },
    () => {
      const its = sample(ITEMS, 4), prices = Object.fromEntries(its.map(i => [i, ri(1, 9)])), cart = Object.fromEntries(its.slice(0, 3).map(i => [i, ri(1, 5)]));
      return { kind: "fn", name: "cart_total",
        q: "Write `cart_total(cart, prices)`. `cart` maps item → quantity and `prices` maps item → price. Return the total cost.",
        cases: [[cart, prices], [{}, prices], [{ [its[3]]: 10 }, prices]],
        steps: [["Loop over the cart's items.", "def cart_total(cart, prices):\n    total = 0\n    for item in cart:"],
          ["Look up the price with the same key.", "        total += cart[item] * prices[item]\n    return total"]],
        hints: ["Both dicts use the item name as the key.", "total += cart[item] * prices[item]"] };
    },
    () => {
      const ns = sample(NAMES, 4), sc = Object.fromEntries(ns.map(n => [n, ri(50, 100)]));
      return { kind: "fn", name: "best",
        q: "Write `best(scores)` that returns the name with the highest score. On a tie, return the one that comes first. Return None for an empty dict.",
        cases: [[sc], [{}], [{ ana: 5, li: 5 }], [{ zoe: 1 }]],
        steps: [["Track the best name so far, starting with None.", "def best(scores):\n    top = None\n    for name in scores:"],
          ["Replace it only when a score is strictly bigger, so ties keep the first.", "        if top is None or scores[name] > scores[top]:\n            top = name\n    return top"]],
        hints: ["Use > not >= to keep the first one on a tie.", "if top is None or scores[name] > scores[top]: top = name"] };
    },
    () => {
      const ws = sample([...WORDS, "a", "to", "sky", "map", "pen", "be"], 7);
      return { kind: "fn", name: "by_length",
        q: "Write `by_length(words)` that groups words by length: a dict of length → list of words, in their original order.",
        cases: [[ws], [[]], [["hi", "yo", "hey"]]],
        steps: [["For each word, make sure its length has a list.", "def by_length(words):\n    groups = {}\n    for w in words:\n        n = len(w)\n        if n not in groups:\n            groups[n] = []"],
          ["Then add the word to that list.", "        groups[n].append(w)\n    return groups"]],
        hints: ["Create the list the first time you see a length.", "if n not in groups: groups[n] = [], then groups[n].append(w)"] };
    },
    () => {
      const its = sample(ITEMS, 3), st = Object.fromEntries(its.map(i => [i, ri(0, 9)])), add = pick(ITEMS);
      return { kind: "fn", name: "restock",
        q: "Write `restock(stock, item, n)` that returns a **new** dict with `n` added to `item`'s count (starting from 0 if it's missing). Don't change `stock`.",
        cases: [[st, its[0], ri(1, 9)], [st, add, 5], [{}, "tea", 2]],
        steps: [["Copy the dict first so the original stays the same.", "def restock(stock, item, n):\n    new = {}\n    for k in stock:\n        new[k] = stock[k]"],
          ["`.get(item, 0)` handles a missing item.", "    new[item] = new.get(item, 0) + n\n    return new"]],
        hints: ["Build a copy, then update the copy.", "new[item] = new.get(item, 0) + n"] };
    },
  ] },

  { id: "sets", title: "Sets", icon: "🔵", lessons: ["u9l3"], gens: [
    () => ({ kind: "fn", name: "unique_count",
      q: "Write `unique_count(items)` that returns how many different items there are.",
      cases: [[times(8, () => pick(NAMES.slice(0, 4)))], [[]], [[1, 1, 1]], [nums(10, 1, 6)]],
      steps: [["A set keeps one copy of each item. Its length is the number of different ones.", "def unique_count(items):\n    return len(set(items))"]],
      hints: ["Sets drop duplicates.", "return len(set(items))"] }),
    () => {
      const a = pick(WORDS), b = pick(WORDS);
      return { kind: "fn", name: "shared_letters",
        q: `Write \`shared_letters(a, b)\` that returns a sorted list of letters found in both words. \`shared_letters("${a}", "${b}")\` → \`${py([...new Set(a)].filter(c => b.includes(c)).sort())}\`.`,
        cases: [[a, b], [pick(WORDS), pick(WORDS)], ["abc", "xyz"], ["", "a"]],
        steps: [["A string turns into a set of its letters. `&` keeps what's in both.", "def shared_letters(a, b):\n    both = set(a) & set(b)"],
          ["`sorted()` turns the set into an ordered list.", "    return sorted(both)"]],
        hints: ["set(\"hello\") is {'h', 'e', 'l', 'o'}.", "return sorted(set(a) & set(b))"] };
    },
    () => {
      const have = sample(ITEMS, 5);
      return { kind: "fn", name: "has_all",
        q: "Write `has_all(needed, have)` that returns True if every item in `needed` is somewhere in `have`.",
        cases: [[have.slice(0, 2), have], [[...have.slice(0, 2), "gold"], have], [[], have], [["tea", "tea"], ["tea"]]],
        steps: [["Take away everything you have from what you need. If nothing is left, you have it all.", "def has_all(needed, have):\n    missing = set(needed) - set(have)\n    return len(missing) == 0"]],
        hints: ["Set difference: what's in one but not the other.", "len(set(needed) - set(have)) == 0"] };
    },
    () => {
      const a = sample(NAMES, 5), b = [...sample(a, 2), ...sample(NAMES, 2)];
      return { kind: "fn", name: "only_first",
        q: "Write `only_first(a, b)` that returns a sorted list of the items in `a` that are not in `b`, with no repeats.",
        cases: [[a, b], [[], ["x"]], [["x", "x", "y"], []], [b, a]],
        steps: [["`-` keeps what's in the first set but not the second.", "def only_first(a, b):\n    return sorted(set(a) - set(b))"]],
        hints: ["Turn both into sets.", "sorted(set(a) - set(b))"] };
    },
  ] },

  { id: "errors", title: "Handling Errors", icon: "🛡️", lessons: ["u10l1"], gens: [
    () => {
      const d = ri(-1, 0);
      return { kind: "fn", name: "to_int",
        q: `Write \`to_int(text, default)\` that returns \`text\` as an int, or \`default\` if it can't be converted. Use try / except.`,
        need: [['"try" in _src and "except" in _src', "Use try / except"]],
        cases: [[String(ri(1, 999)), d], ["abc", d], ["4.5", 0], ["-7", 0], ["", 99]],
        steps: [["Try the risky conversion.", "def to_int(text, default):\n    try:\n        return int(text)"],
          ["`int()` raises ValueError for bad text. Catch it and return the default.", "    except ValueError:\n        return default"]],
        hints: ["Which error does int(\"abc\") raise?", "except ValueError: return default"] };
    },
    () => {
      const xs = sample(WORDS, 3);
      return { kind: "fn", name: "safe_get",
        q: "Write `safe_get(items, i)` that returns `items[i]`, or None if that index doesn't exist. Use try / except.",
        need: [['"try" in _src and "except" in _src', "Use try / except"]],
        cases: [[xs, 1], [xs, 5], [xs, -1], [[], 0], [xs, -9]],
        steps: [["Try the lookup.", "def safe_get(items, i):\n    try:\n        return items[i]"],
          ["A bad index raises IndexError.", "    except IndexError:\n        return None"]],
        hints: ["What does [1, 2][7] raise?", "except IndexError: return None"] };
    },
    () => ({ kind: "fn", name: "safe_avg",
      q: "Write `safe_avg(nums)` that returns the average of `nums`, or `0` for an empty list. Use try / except instead of checking the length.",
      need: [['"try" in _src and "except" in _src', "Use try / except"]],
      cases: [[nums(5, 1, 50)], [[]], [[4]], [nums(8, -10, 10)]],
      steps: [["Dividing by len of an empty list divides by 0.", "def safe_avg(nums):\n    try:\n        return sum(nums) / len(nums)"],
        ["That raises ZeroDivisionError, so catch it.", "    except ZeroDivisionError:\n        return 0"]],
      hints: ["What happens when len(nums) is 0?", "except ZeroDivisionError: return 0"] }),
    () => ({ kind: "fn", name: "parse_price",
      q: "Write `parse_price(text)` that turns text like `\"$4.50\"` or `\"12\"` into a float. Return None if it isn't a valid price.",
      need: [['"try" in _src and "except" in _src', "Use try / except"]],
      cases: [["$4.50"], [String(ri(1, 99))], ["$" + ri(1, 999) / 10], ["free"], ["$"], ["3.2.1"]],
      steps: [["Remove the dollar sign, then try `float()`.", "def parse_price(text):\n    try:\n        return float(text.replace(\"$\", \"\"))"],
        ["Bad text raises ValueError.", "    except ValueError:\n        return None"]],
      hints: ["Strip the $ first with replace().", "float(text.replace(\"$\", \"\")) inside try, except ValueError: return None"] }),
  ] },

  { id: "classes", title: "Classes", icon: "🏰", lessons: ["u10l2", "u10l3"], gens: [
    () => {
      const ops = () => times(ri(4, 7), () => pick([["add", [ri(1, 20)]], ["spend", [ri(1, 30)]], ["balance", []]])).concat([["balance", []]]);
      return { kind: "cls", name: "Wallet",
        q: "Make a class `Wallet(start)` with `add(n)`, `spend(n)` (returns True and takes the money if there's enough, otherwise returns False), and `balance()`.",
        scen: [{ args: [10], ops: [["spend", [4]], ["spend", [20]], ["balance", []]] }, { args: [ri(0, 30)], ops: ops() }, { args: [0], ops: ops() }],
        steps: [["Store the money on `self`.", "class Wallet:\n    def __init__(self, start):\n        self.money = start\n\n    def add(self, n):\n        self.money += n\n\n    def balance(self):\n        return self.money"],
          ["spend checks first, and returns whether it worked.", "\n    def spend(self, n):\n        if n > self.money:\n            return False\n        self.money -= n\n        return True"]],
        hints: ["Keep the amount in self.money.", "spend: if n > self.money: return False, else subtract and return True"] };
    },
    () => {
      const ops = () => times(ri(4, 8), () => pick([["toggle", []], ["is_on", []], ["flips", []], ["on", []], ["off", []]]));
      return { kind: "cls", name: "Light",
        q: "Make a class `Light` that starts off, with `on()`, `off()`, `toggle()`, `is_on()`, and `flips()`, which returns how many times the light actually changed.",
        scen: [{ args: [], ops: [["on", []], ["on", []], ["flips", []], ["toggle", []], ["is_on", []], ["flips", []]] }, { args: [], ops: ops() }, { args: [], ops: ops() }],
        steps: [["Two pieces of state: is it on, and how many changes.", "class Light:\n    def __init__(self):\n        self.lit = False\n        self.changes = 0\n\n    def is_on(self):\n        return self.lit\n\n    def flips(self):\n        return self.changes"],
          ["on and off only count a flip when the state really changes. toggle reuses them.", "\n    def on(self):\n        if not self.lit:\n            self.lit = True\n            self.changes += 1\n\n    def off(self):\n        if self.lit:\n            self.lit = False\n            self.changes += 1\n\n    def toggle(self):\n        if self.lit:\n            self.off()\n        else:\n            self.on()"]],
        hints: ["Turning on a light that's already on isn't a flip.", "Keep self.lit and self.changes. Only add to changes when lit actually changes."] };
    },
    () => {
      const tasks = sample(["wash", "study", "cook", "run", "read", "shop"], 4);
      const ops = () => times(ri(5, 8), () => pick([["add", [pick(tasks)]], ["finish", [pick(tasks)]], ["count", []], ["tasks", []]])).concat([["tasks", []]]);
      return { kind: "cls", name: "TodoList",
        q: "Make a class `TodoList` with `add(task)` (ignores a task that's already on the list), `finish(task)` (removes it and returns True, or returns False if it isn't there), `count()`, and `tasks()` (the list, in the order added).",
        scen: [{ args: [], ops: [["add", ["a"]], ["add", ["a"]], ["count", []], ["finish", ["b"]], ["finish", ["a"]], ["tasks", []]] }, { args: [], ops: ops() }, { args: [], ops: ops() }],
        steps: [["A list on `self` keeps the order. add checks for duplicates.", "class TodoList:\n    def __init__(self):\n        self.items = []\n\n    def add(self, task):\n        if task not in self.items:\n            self.items.append(task)"],
          ["finish reports whether it found the task.", "\n    def finish(self, task):\n        if task in self.items:\n            self.items.remove(task)\n            return True\n        return False"],
          ["Return a copy from tasks() so outside code can't change your list.", "\n    def count(self):\n        return len(self.items)\n\n    def tasks(self):\n        return self.items[:]"]],
        hints: ["Use `in` to check before adding or removing.", "finish: if task in self.items: remove it and return True, else return False"] };
    },
    () => {
      const lives = ri(2, 4);
      const ops = () => times(ri(5, 9), () => pick([["hit", [ri(5, 50)]], ["miss", []], ["alive", []], ["score", []]])).concat([["score", []], ["alive", []]]);
      return { kind: "cls", name: "Player",
        q: `Make a class \`Player(name)\` that starts with ${lives} lives and 0 points. \`hit(points)\` adds points (only while alive), \`miss()\` loses a life (never below 0), \`alive()\` returns whether lives are left, and \`score()\` returns the points.`,
        scen: [{ args: ["kai"], ops: [["hit", [10]], ...times(lives, () => ["miss", []]), ["alive", []], ["hit", [5]], ["score", []]] }, { args: [pick(NAMES)], ops: ops() }, { args: [pick(NAMES)], ops: ops() }],
        steps: [["Set up the starting state.", `class Player:\n    def __init__(self, name):\n        self.name = name\n        self.lives = ${lives}\n        self.points = 0\n\n    def alive(self):\n        return self.lives > 0\n\n    def score(self):\n        return self.points`],
          ["Each action checks its rule before changing anything.", "\n    def hit(self, points):\n        if self.alive():\n            self.points += points\n\n    def miss(self):\n        if self.lives > 0:\n            self.lives -= 1"]],
        hints: ["Methods can call other methods with self.alive().", "hit: if self.alive(): self.points += points"] };
    },
  ] },
  ];

  // A fresh, playable problem from a topic. Each one is paired with a second
  // problem from the same topic, used after a walkthrough.
  function make(topic, avoid) {
    const choices = topic.gens.map((g, i) => i).filter(i => i !== avoid);
    const gi = pick(choices.length ? choices : [avoid]);
    return { ...build(topic.gens[gi]()), gi, from: topic.title, topic: topic.id };
  }
  function problem(topic, gi) {
    const s = gi == null ? make(topic) : { ...build(topic.gens[gi]()), gi, from: topic.title, topic: topic.id };
    s.alt = make(topic, s.gi);
    s.alt.alt = s;
    return s;
  }
  // n problems that cycle through every template before repeating one
  function set(topic, n) {
    const out = [];
    let order = [];
    while (out.length < n) {
      if (!order.length) order = shuffle(topic.gens.map((g, i) => i));
      out.push(problem(topic, order.pop()));
    }
    return out;
  }
  window.TOPICS = { list: TOPICS, set, problem, build };
})();
