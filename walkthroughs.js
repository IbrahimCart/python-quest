// Learn from mistakes: when a code challenge fails, the player can open a
// step-by-step walkthrough, then tap "I understand" to get a similar question
// built differently (the twin). If the twin fails too, it has its own
// walkthrough and the player goes back to the original challenge.
// walk: [{ say, code }] where code is the whole program so far; new lines are highlighted.
const wk = String.raw;

window.WALKTHROUGHS = {
u1l1: {
  walk: [
    { say: "Each line of output gets its own `print()`. Text goes inside quotes.", code: wk`print("Python Quest")
print("Level 1")` },
    { say: "A comment starts with `#`. Python skips it; it's a note for people reading the code.", code: wk`# Show the game title and the level
print("Python Quest")
print("Level 1")` },
  ],
  twin: {
    q: "Print exactly three lines: `Ready`, `Set`, `Go!`. Put a comment at the **end** of the last print line (on the same line, after the code).",
    starter: "",
    tests: wk`assert _out.strip().splitlines() == ["Ready", "Set", "Go!"], "Print Ready, Set, Go! on three lines"
assert any(l.strip().startswith("print") and "#" in l for l in _src.splitlines()), "Put a # comment on the same line as a print, after the code"`,
    hints: ["Three lines of output means three print() calls.", "A comment can follow code: print(\"Go!\")  # start"],
    walk: [
      { say: "One `print()` per line of output.", code: wk`print("Ready")
print("Set")
print("Go!")` },
      { say: "A comment doesn't need its own line. Anything after `#` is ignored, even at the end of code.", code: wk`print("Ready")
print("Set")
print("Go!")  # start the race` },
    ],
  },
},

u1l2: {
  walk: [
    { say: "The trap: `a = b` overwrites a, and the 5 is gone for good. So first save a copy of a.", code: wk`a = 5
b = 9
temp = a` },
    { say: "Now a can safely take b's value, and b takes the saved copy.", code: wk`a = 5
b = 9
temp = a
a = b
b = temp` },
    { say: "Print them in order. (Python shortcut you'll see later: `a, b = b, a`.)", code: wk`a = 5
b = 9
temp = a
a = b
b = temp
print(a)
print(b)` },
  ],
  twin: {
    q: "Rotate three values to the left: `a` gets b's value, `b` gets c's, and `c` gets a's old value. Then print a, b and c. Don't retype the numbers.",
    starter: wk`a = 1
b = 2
c = 3
`,
    tests: wk`assert (a, b, c) == (2, 3, 1), "a, b, c should end up as 2, 3, 1"
assert _out.split() == ["2", "3", "1"], "Print a, then b, then c"
g = _rerun(a=7, b=8, c=9)
assert (g["a"], g["b"], g["c"]) == (8, 9, 7), "Move the variables instead of typing numbers"`,
    hints: ["Which value gets overwritten first? Save that one.", "temp = a, then a = b, b = c, c = temp."],
    walk: [
      { say: "a gets overwritten first, so save it before anything else.", code: wk`a = 1
b = 2
c = 3
temp = a` },
      { say: "Shift each one left. c takes the saved copy of a.", code: wk`a = 1
b = 2
c = 3
temp = a
a = b
b = c
c = temp` },
      { say: "Print them.", code: wk`a = 1
b = 2
c = 3
temp = a
a = b
b = c
c = temp
print(a)
print(b)
print(c)` },
    ],
  },
},

u1l3: {
  walk: [
    { say: "Names can't contain spaces or dashes. Use underscores.", code: wk`total_price = 30
tax_rate = 0.1` },
    { say: "Python is case-sensitive: `Tax_rate` and `tax_rate` are different names. Spell them exactly the same everywhere.", code: wk`total_price = 30
tax_rate = 0.1
print(total_price * tax_rate + total_price)` },
  ],
  twin: {
    q: "This should print `Hi, Sam! You are 20.` but it crashes. Fix it using the names `first_name` and `user_age`.",
    starter: wk`first name = "Sam"
2user_age = 20
print("Hi, " + First_name + "! You are " + str(user_age) + ".")
`,
    tests: wk`assert first_name == "Sam" and user_age == 20, "Use first_name = \"Sam\" and user_age = 20"
assert _out.strip() == "Hi, Sam! You are 20.", "It should print Hi, Sam! You are 20."
assert _rerun(first_name="Li")["_out"].strip() == "Hi, Li! You are 20.", "Use the variables in the print"`,
    hints: ["Three rule breaks: a space, a name starting with a digit, and a capital letter.", "first_name = \"Sam\", user_age = 20, and use first_name (lowercase) in print()."],
    walk: [
      { say: "Names can't have spaces, and they can't start with a digit.", code: wk`first_name = "Sam"
user_age = 20` },
      { say: "`First_name` isn't `first_name`. Match the spelling exactly.", code: wk`first_name = "Sam"
user_age = 20
print("Hi, " + first_name + "! You are " + str(user_age) + ".")` },
    ],
  },
},

u2l1: {
  walk: [
    { say: "Only a float can hold the .5, so b carries the decimal part. Pick an int for a, then make b fill the gap to 10.5.", code: wk`a = 4
b = 6.5` },
    { say: "c has to be text, so convert a with `str()`. d just needs to be True or False.", code: wk`a = 4
b = 6.5
c = str(a)
d = True` },
  ],
  twin: {
    q: "Create `w` (str), `x` (int), `y` (float) and `z` (bool) so that `int(w) + x == 10`, `y * 2 == x`, and `z` is the result of `x > y`.",
    starter: "",
    tests: wk`assert type(w) is str, "w must be a str"
assert type(x) is int, "x must be an int"
assert type(y) is float, "y must be a float"
assert type(z) is bool, "z must be a bool"
assert y * 2 == x, f"y * 2 is {y * 2}, but it should equal x ({x})"
assert int(w) + x == 10, f"int(w) + x is {int(w) + x}, but it should be 10"
assert z == (x > y), "z should be the result of x > y"`,
    hints: ["Start with x and y: y is half of x, written as a float.", "x = 4, y = 2.0, then w = \"6\" and z = x > y."],
    walk: [
      { say: "y * 2 must equal x. Pick an even int for x, and half of it as a float for y.", code: wk`x = 4
y = 2.0` },
      { say: "w is text, and `int(w) + x` must be 10, so w is \"6\".", code: wk`x = 4
y = 2.0
w = "6"` },
      { say: "A comparison already gives a bool, so store it directly.", code: wk`x = 4
y = 2.0
w = "6"
z = x > y` },
    ],
  },
},

u2l2: {
  walk: [
    { say: "`isinstance(value, (int, float))` checks for either type. But it says True for True and False, because bool is a kind of int.", code: wk`value = True
is_number = isinstance(value, (int, float))` },
    { say: "So rule bools out with `and not`.", code: wk`value = True
is_number = isinstance(value, (int, float)) and not isinstance(value, bool)` },
  ],
  twin: {
    q: "Set `is_flag` to True only when `value` is a bool, and `is_whole` to True only when `value` is a real int (not a bool, not a float).",
    starter: wk`value = 5
`,
    tests: wk`for v, flag, whole in [(5, False, True), (True, True, False), (False, True, False), (2.0, False, False), ("3", False, False), (-7, False, True)]:
    g = _rerun(value=v)
    assert g.get("is_flag") is flag, f"value = {v!r}: is_flag should be {flag}, got {g.get('is_flag')!r}"
    assert g.get("is_whole") is whole, f"value = {v!r}: is_whole should be {whole}, got {g.get('is_whole')!r}"`,
    hints: ["isinstance(True, int) is True, so is_whole needs a second check.", "is_flag = isinstance(value, bool), then is_whole = isinstance(value, int) and not is_flag"],
    walk: [
      { say: "is_flag is the easy one: only bools pass `isinstance(value, bool)`.", code: wk`value = 5
is_flag = isinstance(value, bool)` },
      { say: "`isinstance(value, int)` lets bools in too. Block them by reusing is_flag.", code: wk`value = 5
is_flag = isinstance(value, bool)
is_whole = isinstance(value, int) and not is_flag` },
    ],
  },
},

u2l3: {
  walk: [
    { say: "`int(\"19.99\")` crashes because of the dot. `float()` can read it. The quantity has no dot, so `int()` is fine.", code: wk`price_text = "19.99"
qty_text = "3"
price = float(price_text)
qty = int(qty_text)` },
    { say: "Multiply, then `int()` drops the decimals, which rounds a positive number down.", code: wk`price_text = "19.99"
qty_text = "3"
price = float(price_text)
qty = int(qty_text)
print(int(price * qty))` },
  ],
  twin: {
    q: "Both values are text. Print the kilometers per liter, rounded down to a whole number (`15` for these values).",
    starter: wk`distance_text = "100"
liters_text = "6.5"
`,
    tests: wk`assert _out.strip() == "15", "100 ÷ 6.5 is 15.38..., so it should print 15"
assert _rerun(distance_text="50", liters_text="4")["_out"].strip() == "12", "Convert the text values instead of hard-coding"
assert _rerun(distance_text="9", liters_text="10")["_out"].strip() == "0", "0.9 rounds down to 0"`,
    hints: ["The liters can have a decimal point. Which conversion reads that?", "float() both, divide, then int() the result."],
    walk: [
      { say: "Liters can have a dot, so use `float()`. Converting distance with `float()` too keeps it simple.", code: wk`distance_text = "100"
liters_text = "6.5"
distance = float(distance_text)
liters = float(liters_text)` },
      { say: "Divide, then `int()` drops the decimals.", code: wk`distance_text = "100"
liters_text = "6.5"
distance = float(distance_text)
liters = float(liters_text)
print(int(distance / liters))` },
    ],
  },
},

u3l1: {
  walk: [
    { say: "Python does `/` before `+`, so this only divides c by 3.", code: wk`a = 88
b = 92
c = 79
print(a + b + c / 3)  # wrong: only c is divided` },
    { say: "Parentheses make the sum happen first.", code: wk`a = 88
b = 92
c = 79
print((a + b + c) / 3)` },
  ],
  twin: {
    q: "Three friends split a meal and the tip equally. Print one person's share.",
    starter: wk`meal = 42
tip = 9
`,
    tests: wk`assert _out.strip() == "17.0", "(42 + 9) / 3 is 17.0"
assert _rerun(meal=30, tip=0)["_out"].strip() == "10.0", "meal = 30, tip = 0 should print 10.0"
assert _rerun(meal=10, tip=5)["_out"].strip() == "5.0", "meal = 10, tip = 5 should print 5.0"`,
    hints: ["The whole bill gets split, not just the tip.", "print((meal + tip) / 3)"],
    walk: [
      { say: "Add first, then split. Without parentheses, only tip would be divided.", code: wk`meal = 42
tip = 9
print((meal + tip) / 3)` },
    ],
  },
},

u3l2: {
  walk: [
    { say: "`% 10` gives the last digit: 472 % 10 is 2.", code: wk`n = 472
last = n % 10` },
    { say: "`// 10` chops off the last digit (472 → 47). Then `% 10` gives 7.", code: wk`n = 472
last = n % 10
middle = n // 10 % 10` },
    { say: "`// 100` leaves just the first digit. Add all three.", code: wk`n = 472
last = n % 10
middle = n // 10 % 10
first = n // 100
print(first + middle + last)` },
  ],
  twin: {
    q: "`n` is a 3-digit number. Print it reversed **as a number** (472 → 274, 100 → 1). Use `//` and `%`, not strings.",
    starter: wk`n = 472
`,
    tests: wk`assert "str" not in _src, "Solve it with // and %, not str()"
assert _out.strip() == "274", "472 reversed is 274"
for v, want in [(905, "509"), (100, "1"), (999, "999"), (120, "21")]:
    got = _rerun(n=v)["_out"].strip()
    assert got == want, f"n = {v} should print {want}, got {got}"`,
    hints: ["Get the three digits first, the same way you'd sum them.", "Put them back with place values: last * 100 + middle * 10 + first"],
    walk: [
      { say: "Pull out each digit with `%` and `//`.", code: wk`n = 472
last = n % 10
middle = n // 10 % 10
first = n // 100` },
      { say: "Rebuild the number backwards: the last digit is now worth hundreds, and the first is worth ones.", code: wk`n = 472
last = n % 10
middle = n // 10 % 10
first = n // 100
print(last * 100 + middle * 10 + first)` },
    ],
  },
},

u3l3: {
  walk: [
    { say: "`a - b` is negative when b is bigger. `abs()` always gives the positive distance.", code: wk`a = 3.14159
b = -2.5
distance = abs(a - b)` },
    { say: "`round(x, 2)` keeps 2 decimals.", code: wk`a = 3.14159
b = -2.5
distance = abs(a - b)
print(round(distance, 2))` },
  ],
  twin: {
    q: "Print how far `price` is from `budget`, rounded to the **nearest whole dollar** with no decimal point (`2` here). It must work whether you're over or under budget.",
    starter: wk`budget = 50
price = 47.6
`,
    tests: wk`assert _out.strip() == "2", "47.6 is 2.4 away from 50, which rounds to 2"
assert _rerun(budget=10, price=16.8)["_out"].strip() == "7", "budget = 10, price = 16.8 should print 7"
assert _rerun(budget=20, price=19.9)["_out"].strip() == "0", "budget = 20, price = 19.9 should print 0"`,
    hints: ["Which function makes a difference positive?", "round() with no second argument gives a whole number: round(abs(price - budget))"],
    walk: [
      { say: "The gap can be negative either way, so wrap it in `abs()`.", code: wk`budget = 50
price = 47.6
gap = abs(price - budget)` },
      { say: "`round(x)` with no digits argument returns a whole int, so no `.0`.", code: wk`budget = 50
price = 47.6
gap = abs(price - budget)
print(round(gap))` },
    ],
  },
},

u3l4: {
  walk: [
    { say: "Growing by 4% means multiplying by 1.04. `balance *= 1.04` is short for `balance = balance * 1.04`.", code: wk`balance = 1000
balance *= 1.04` },
    { say: "Do it once per year, then round for printing.", code: wk`balance = 1000
balance *= 1.04
balance *= 1.04
balance *= 1.04
print(round(balance, 2))` },
  ],
  twin: {
    q: "Using only augmented assignment (`+=`, `-=`, `*=`): add 2 lives, lose 1, then double what's left. Print `lives` (8 here).",
    starter: wk`lives = 3
`,
    tests: wk`for op in ["+=", "-=", "*="]:
    assert op in _src, f"Use {op}"
assert _out.strip() == "8", "(3 + 2 - 1) × 2 is 8"
assert _rerun(lives=0)["_out"].strip() == "2", "Change lives instead of hard-coding the answer"`,
    hints: ["Each change is its own line that updates lives.", "lives += 2, lives -= 1, lives *= 2, then print(lives)."],
    walk: [
      { say: "Each event updates the same variable in place.", code: wk`lives = 3
lives += 2
lives -= 1` },
      { say: "Doubling is `*= 2`. Then print.", code: wk`lives = 3
lives += 2
lives -= 1
lives *= 2
print(lives)` },
    ],
  },
},

u4l1: {
  walk: [
    { say: "\"jupyter\" has 7 letters, at indexes 0 to 6. The middle one is index 3.", code: wk`word = "jupyter"
middle = len(word) // 2   # 7 // 2 is 3` },
    { say: "Use that number as the index. It works for any odd length.", code: wk`word = "jupyter"
middle = len(word) // 2   # 7 // 2 is 3
print(word[middle])` },
  ],
  twin: {
    q: "`word` has an **even** number of letters. Print its two middle characters together (`python` → `th`).",
    starter: wk`word = "python"
`,
    tests: wk`assert _out.strip() == "th", "The middle of python is th"
for w, want in [("ab", "ab"), ("abcd", "bc"), ("kayaks", "ya")]:
    got = _rerun(word=w)["_out"].strip()
    assert got == want, f"{w!r} should print {want!r}, got {got!r}"`,
    hints: ["For 6 letters, len // 2 is 3. Which two indexes are in the middle?", "word[len(word) // 2 - 1] + word[len(word) // 2]"],
    walk: [
      { say: "For 6 letters, `len(word) // 2` is 3. The two middle letters are at 2 and 3.", code: wk`word = "python"
half = len(word) // 2` },
      { say: "Join the one before `half` and the one at `half`.", code: wk`word = "python"
half = len(word) // 2
print(word[half - 1] + word[half])` },
    ],
  },
},

u4l2: {
  walk: [
    { say: "Count positions in \"2026-11-23\": 0–3 is the year, 4 is a dash, 5–6 is the month, 7 is a dash.", code: wk`date = "2026-11-23"
year = date[:4]` },
    { say: "A slice stops **before** its end index, so `[5:7]` gives positions 5 and 6. Leaving the end blank goes to the end.", code: wk`date = "2026-11-23"
year = date[:4]
month = date[5:7]
day = date[8:]` },
    { say: "Print each one.", code: wk`date = "2026-11-23"
year = date[:4]
month = date[5:7]
day = date[8:]
print(year)
print(month)
print(day)` },
  ],
  twin: {
    q: "`file` always ends in a 3-letter extension. Slice it into `name` and `ext` (without the dot), then print name, then ext. Names can be any length.",
    starter: wk`file = "report.pdf"
`,
    tests: wk`assert (name, ext) == ("report", "pdf"), f"name and ext are {name!r} and {ext!r}"
assert _out.split() == ["report", "pdf"], "Print name, then ext"
for f, n, e in [("a.txt", "a", "txt"), ("my.notes.doc", "my.notes", "doc")]:
    g = _rerun(file=f)
    assert (g["name"], g["ext"]) == (n, e), f"{f!r} should give {n!r} and {e!r}"`,
    hints: ["The name's length changes, but the end is always the same shape. Count from the end.", "Negative indexes: file[-3:] and file[:-4]"],
    walk: [
      { say: "The name length changes, so count from the **end** instead. `-3:` means the last 3 characters.", code: wk`file = "report.pdf"
ext = file[-3:]` },
      { say: "Everything except the last 4 (the dot plus 3 letters) is the name.", code: wk`file = "report.pdf"
ext = file[-3:]
name = file[:-4]
print(name)
print(ext)` },
    ],
  },
},

u4l3: {
  walk: [
    { say: "Split the digits into 3 slices: the first 3, the next 3, and the last 4.", code: wk`phone = "2065551234"
area = phone[:3]
mid = phone[3:6]
last = phone[6:]` },
    { say: "An f-string puts each one into a template with `{}`.", code: wk`phone = "2065551234"
area = phone[:3]
mid = phone[3:6]
last = phone[6:]
print(f"({area}) {mid}-{last}")` },
  ],
  twin: {
    q: "Print `card` masked so only the last 4 digits show: `**** **** **** 4444`. Use slicing and an f-string.",
    starter: wk`card = "4111222233334444"
`,
    tests: wk`assert 'f"' in _src or "f'" in _src, "Use an f-string"
assert _out.strip() == "**** **** **** 4444", "Print **** **** **** 4444"
assert _rerun(card="5500000000001234")["_out"].strip() == "**** **** **** 1234", "Slice card instead of typing the digits"`,
    hints: ["You only need one slice: the last 4 characters.", "f\"**** **** **** {card[-4:]}\""],
    walk: [
      { say: "Only the end matters. `[-4:]` is the last 4 characters.", code: wk`card = "4111222233334444"
last4 = card[-4:]` },
      { say: "The stars are fixed text in the f-string.", code: wk`card = "4111222233334444"
last4 = card[-4:]
print(f"**** **** **** {last4}")` },
    ],
  },
},

u4l4: {
  walk: [
    { say: "`split()` with no argument splits on any amount of whitespace and drops the empty bits.", code: wk`sentence = "  hello   big  WORLD "
words = sentence.split()   # ['hello', 'big', 'WORLD']` },
    { say: "`\" \".join()` glues them back with exactly one space. `.title()` capitalizes each word.", code: wk`sentence = "  hello   big  WORLD "
words = sentence.split()   # ['hello', 'big', 'WORLD']
clean = " ".join(words).title()
print(clean)` },
  ],
  twin: {
    q: "Turn `title` into a URL slug: all lowercase, words joined by single dashes. Store it in `slug` and print it (`my-first-post`).",
    starter: wk`title = "  My  First   POST "
`,
    tests: wk`assert slug == "my-first-post", f"slug is {slug!r}"
assert _rerun(title="Hello World")["slug"] == "hello-world", "It should work for any title"
assert _rerun(title="  ONE ")["slug"] == "one", "One word has no dashes"`,
    hints: ["Same tools as cleaning a sentence, with a different glue.", "\"-\".join(title.lower().split())"],
    walk: [
      { say: "Lowercase first, then `split()` to get clean words.", code: wk`title = "  My  First   POST "
words = title.lower().split()` },
      { say: "Join with a dash instead of a space.", code: wk`title = "  My  First   POST "
words = title.lower().split()
slug = "-".join(words)
print(slug)` },
    ],
  },
},

u5l1: {
  walk: [
    { say: "A comparison gives True or False, so you can store it directly. No if needed.", code: wk`a = "apple"
b = "mango"
same_length = len(a) == len(b)` },
    { say: "`<` on strings compares alphabetically.", code: wk`a = "apple"
b = "mango"
same_length = len(a) == len(b)
a_first = a < b` },
  ],
  twin: {
    q: "Set `same_word` to whether `a` and `b` are the same word ignoring case, and `b_longer` to whether `b` has more letters than `a`.",
    starter: wk`a = "Cat"
b = "cat"
`,
    tests: wk`assert same_word is True and b_longer is False, "Cat and cat are the same word and the same length"
g = _rerun(a="dog", b="horse")
assert g["same_word"] is False and g["b_longer"] is True, "dog and horse differ, and horse is longer"`,
    hints: ["Make both the same case before comparing.", "same_word = a.lower() == b.lower() and b_longer = len(b) > len(a)"],
    walk: [
      { say: "\"Cat\" == \"cat\" is False. Lowercase both, then compare.", code: wk`a = "Cat"
b = "cat"
same_word = a.lower() == b.lower()` },
      { say: "Compare the lengths with `>`.", code: wk`a = "Cat"
b = "cat"
same_word = a.lower() == b.lower()
b_longer = len(b) > len(a)` },
    ],
  },
},

u5l2: {
  walk: [
    { say: "Start with the smallest case. Once one branch matches, the rest are skipped.", code: wk`kg = 3
if kg <= 1:
    cost = 5` },
    { say: "`elif` only runs if kg is over 1, so here it's between 1 and 5. Charge 2 for each kg over 1.", code: wk`kg = 3
if kg <= 1:
    cost = 5
elif kg <= 5:
    cost = 5 + (kg - 1) * 2` },
    { say: "Everything else is over 5. 13 is what exactly 5 kg costs, plus 1 per extra kg.", code: wk`kg = 3
if kg <= 1:
    cost = 5
elif kg <= 5:
    cost = 5 + (kg - 1) * 2
else:
    cost = 13 + (kg - 5)` },
  ],
  twin: {
    q: "Set `fee` for parking `hours`. The first hour is free. Hours 2 and 3 cost 4 each. Every hour after 3 costs 6. The fee never goes above 30.",
    starter: wk`hours = 5
`,
    tests: wk`for h, want in [(1, 0), (2, 4), (3, 8), (5, 20), (6, 26), (7, 30), (10, 30)]:
    got = _rerun(hours=h).get("fee")
    assert got == want, f"{h} hours should cost {want}, got {got!r}"`,
    hints: ["Work out the fee in tiers like shipping, then deal with the cap separately.", "After the if / elif / else, add: if fee > 30: fee = 30"],
    walk: [
      { say: "Tiers first. Up to 1 hour is free; up to 3 hours charges 4 for each hour past the first.", code: wk`hours = 5
if hours <= 1:
    fee = 0
elif hours <= 3:
    fee = (hours - 1) * 4` },
      { say: "Past 3 hours: 8 for hours 2–3, plus 6 for each hour after 3.", code: wk`hours = 5
if hours <= 1:
    fee = 0
elif hours <= 3:
    fee = (hours - 1) * 4
else:
    fee = 8 + (hours - 3) * 6` },
      { say: "The cap is a separate check that runs after the tiers.", code: wk`hours = 5
if hours <= 1:
    fee = 0
elif hours <= 3:
    fee = (hours - 1) * 4
else:
    fee = 8 + (hours - 3) * 6
if fee > 30:
    fee = 30` },
    ],
  },
},

u5l3: {
  walk: [
    { say: "The basic rule: divisible by 4.", code: wk`year = 2024
is_leap = year % 4 == 0` },
    { say: "The exception: a century year must also divide by 400. So it's fine if it's **not** a century, **or** if it divides by 400. Parentheses keep that pair together.", code: wk`year = 2024
is_leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)` },
  ],
  twin: {
    q: "Set `can_enter`. People get in if they're 18 or older **and** have a ticket, **or** if they're on the guest list. Nobody gets in if they're banned.",
    starter: wk`age = 20
ticket = True
guest = False
banned = False
`,
    tests: wk`cases = [
    (20, True, False, False, True), (16, True, False, False, False), (20, False, False, False, False),
    (16, False, True, False, True), (20, True, False, True, False), (30, False, True, True, False),
]
for age_, ticket_, guest_, banned_, want in cases:
    got = _rerun(age=age_, ticket=ticket_, guest=guest_, banned=banned_).get("can_enter")
    assert got is want, f"age={age_}, ticket={ticket_}, guest={guest_}, banned={banned_} should give {want}, got {got!r}"`,
    hints: ["Build the normal rule first, then add the ban on top.", "can_enter = not banned and (guest or (age >= 18 and ticket))"],
    walk: [
      { say: "Two ways in: adult with a ticket, or guest.", code: wk`age = 20
ticket = True
guest = False
banned = False
allowed = guest or (age >= 18 and ticket)` },
      { say: "A ban beats everything, so it goes in front with `not ... and`.", code: wk`age = 20
ticket = True
guest = False
banned = False
allowed = guest or (age >= 18 and ticket)
can_enter = not banned and allowed` },
    ],
  },
},

u6l1: {
  walk: [
    { say: "The border is 2 longer than the word (one `*` on each side). A string times a number repeats it.", code: wk`def box(word):
    border = "*" * (len(word) + 2)` },
    { say: "Print border, word with stars, border. Everything inside the function is indented.", code: wk`def box(word):
    border = "*" * (len(word) + 2)
    print(border)
    print("*" + word + "*")
    print(border)` },
  ],
  twin: {
    q: "Write `underline(text, char)` that prints the text, then a line of `char` exactly as long as the text. `underline(\"Menu\", \"=\")` prints `Menu` then `====`.",
    starter: "",
    tests: wk`assert _capture(underline, "Menu", "=").splitlines() == ["Menu", "===="], "underline('Menu', '=') should print Menu then ===="
assert _capture(underline, "Hi there", "-").splitlines() == ["Hi there", "--------"], "The line must match the text's length"`,
    hints: ["Two parameters this time. Repeat char as many times as the text is long.", "print(text), then print(char * len(text))"],
    walk: [
      { say: "Two parameters go in the def line, separated by a comma.", code: wk`def underline(text, char):
    print(text)` },
      { say: "Repeat `char` once per character of text.", code: wk`def underline(text, char):
    print(text)
    print(char * len(text))` },
    ],
  },
},

u6l2: {
  walk: [
    { say: "`return` hands the value back to whoever called the function. `print` would only show it.", code: wk`def bmi(weight, height):
    return round(weight / height ** 2, 1)` },
    { say: "category can call bmi and reuse its answer, then decide with if / elif.", code: wk`def bmi(weight, height):
    return round(weight / height ** 2, 1)

def category(weight, height):
    b = bmi(weight, height)
    if b < 18.5:
        return "under"
    elif b < 25:
        return "normal"
    return "over"` },
  ],
  twin: {
    q: "Write `final_price(price, discount)` that returns the price after a percent discount, rounded to 2 decimals. Then `label(price, discount)` returns `\"cheap\"` if the final price is under 20, else `\"deal\"` if the discount is 50 or more, else `\"regular\"`.",
    starter: "",
    tests: wk`assert final_price(80, 25) == 60.0, "final_price(80, 25) should be 60.0"
assert final_price(19.99, 10) == 17.99, "final_price(19.99, 10) should be 17.99"
for p, d, want in [(30, 50, "cheap"), (100, 50, "deal"), (100, 10, "regular"), (18, 0, "cheap")]:
    got = label(p, d)
    assert got == want, f"label({p}, {d}) should be {want!r}, got {got!r}"`,
    hints: ["A 25% discount means you pay 75%: price * (1 - discount / 100).", "In label, call final_price first and check cheap before deal."],
    walk: [
      { say: "25% off means paying 75%. Return the rounded result.", code: wk`def final_price(price, discount):
    return round(price * (1 - discount / 100), 2)` },
      { say: "label reuses final_price. Order matters: check cheap first.", code: wk`def final_price(price, discount):
    return round(price * (1 - discount / 100), 2)

def label(price, discount):
    if final_price(price, discount) < 20:
        return "cheap"
    elif discount >= 50:
        return "deal"
    return "regular"` },
    ],
  },
},

u6l3: {
  walk: [
    { say: "Defaults go in the def line. If the caller leaves them out, those values are used.", code: wk`def greet(name, greeting="Hello", punct="!"):` },
    { say: "Build the text with an f-string. `greet(\"Ana\", punct=\".\")` names punct directly, so greeting keeps its default.", code: wk`def greet(name, greeting="Hello", punct="!"):
    return f"{greeting}, {name}{punct}"` },
  ],
  twin: {
    q: "Write `make_tag(text, tag=\"p\", cls=\"\")` that returns HTML like `<p>Hi</p>`. When `cls` is given, add it: `make_tag(\"Hi\", cls=\"big\")` → `<p class=\"big\">Hi</p>`.",
    starter: "",
    tests: wk`assert make_tag("Hi") == "<p>Hi</p>", 'make_tag("Hi") should be <p>Hi</p>'
assert make_tag("Go", "b") == "<b>Go</b>", 'make_tag("Go", "b") should be <b>Go</b>'
assert make_tag("Hi", cls="big") == '<p class="big">Hi</p>', 'make_tag("Hi", cls="big") should be <p class="big">Hi</p>'
assert make_tag("X", "h1", "t") == '<h1 class="t">X</h1>', 'make_tag("X", "h1", "t") should be <h1 class="t">X</h1>'`,
    hints: ["An empty string is falsy, so if cls: tells you whether one was given.", "if cls: return f'<{tag} class=\"{cls}\">{text}</{tag}>', otherwise return f\"<{tag}>{text}</{tag}>\""],
    walk: [
      { say: "Defaults in the def line. An empty string means \"no class\".", code: wk`def make_tag(text, tag="p", cls=""):
    return f"<{tag}>{text}</{tag}>"` },
      { say: "An empty string counts as False, so `if cls:` runs only when a class was passed. Use single quotes outside so the double quotes show up inside.", code: wk`def make_tag(text, tag="p", cls=""):
    if cls:
        return f'<{tag} class="{cls}">{text}</{tag}>'
    return f"<{tag}>{text}</{tag}>"` },
    ],
  },
},

u7l1: {
  walk: [
    { say: "Start a running total at 0, and loop over every number below the limit. `range(limit)` stops just before limit.", code: wk`limit = 10
total = 0
for n in range(limit):` },
    { say: "Only add n when it divides by 3 or by 5.", code: wk`limit = 10
total = 0
for n in range(limit):
    if n % 3 == 0 or n % 5 == 0:
        total += n` },
    { say: "Print once, after the loop (not indented).", code: wk`limit = 10
total = 0
for n in range(limit):
    if n % 3 == 0 or n % 5 == 0:
        total += n
print(total)` },
  ],
  twin: {
    q: "Print **how many** numbers from 1 to `limit` (including `limit`) divide by 4 but **not** by 6. For 24 that's 4, 8, 16 and 20, so `4`.",
    starter: wk`limit = 24
`,
    tests: wk`assert _out.strip() == "4", "For 24 the count is 4"
for v, want in [(3, "0"), (4, "1"), (100, "17")]:
    got = _rerun(limit=v)["_out"].strip()
    assert got == want, f"limit = {v} should print {want}, got {got}"`,
    hints: ["Count instead of add, and check the range includes limit.", "for n in range(1, limit + 1): if n % 4 == 0 and n % 6 != 0: count += 1"],
    walk: [
      { say: "To include limit, the range has to stop at limit + 1. Start at 1.", code: wk`limit = 24
count = 0
for n in range(1, limit + 1):` },
      { say: "Count (+1) instead of adding n. \"But not\" becomes `and ... != 0`.", code: wk`limit = 24
count = 0
for n in range(1, limit + 1):
    if n % 4 == 0 and n % 6 != 0:
        count += 1
print(count)` },
    ],
  },
},

u7l2: {
  walk: [
    { say: "You don't know how many steps it takes, so use `while`. It keeps going until n is 1.", code: wk`n = 6
steps = 0
while n != 1:` },
    { say: "Each time round: halve if even, otherwise 3n + 1. Use `//` so n stays an int.", code: wk`n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1` },
    { say: "Count the step inside the loop, print after it.", code: wk`n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1
    steps += 1
print(steps)` },
  ],
  twin: {
    q: "Start at 1 and keep doubling until the value is **at least** `target`. Print how many doublings that took (`target = 100` → `7`).",
    starter: wk`target = 100
`,
    tests: wk`assert _out.strip() == "7", "1 → 128 takes 7 doublings"
for v, want in [(1, "0"), (2, "1"), (1000, "10"), (64, "6")]:
    got = _rerun(target=v)["_out"].strip()
    assert got == want, f"target = {v} should print {want}, got {got}"`,
    hints: ["Keep looping while the value is still too small.", "value = 1, count = 0, while value < target: value *= 2 and count += 1"],
    walk: [
      { say: "This time the loop climbs up. Keep going while the value is still too small.", code: wk`target = 100
value = 1
count = 0
while value < target:` },
      { say: "Double and count, then print after the loop.", code: wk`target = 100
value = 1
count = 0
while value < target:
    value *= 2
    count += 1
print(count)` },
    ],
  },
},

u7l3: {
  walk: [
    { say: "Track two numbers: the run you're in now, and the best run so far. Both start at 0, so an empty string prints 0.", code: wk`s = "aaabbaaaa"
best = 0
current = 0` },
    { say: "Same character as the one before? The run grows. Otherwise a new run starts at 1. (`i > 0` skips comparing the first one.)", code: wk`s = "aaabbaaaa"
best = 0
current = 0
for i in range(len(s)):
    if i > 0 and s[i] == s[i - 1]:
        current += 1
    else:
        current = 1` },
    { say: "After each character, keep the bigger of current and best.", code: wk`s = "aaabbaaaa"
best = 0
current = 0
for i in range(len(s)):
    if i > 0 and s[i] == s[i - 1]:
        current += 1
    else:
        current = 1
    if current > best:
        best = current
print(best)` },
  ],
  twin: {
    q: "Print the most vowels (a, e, i, o, u) in a row in `word`. `beautiful` → `3` (the \"eau\"). A word with no vowels prints 0.",
    starter: wk`word = "beautiful"
`,
    tests: wk`assert _out.strip() == "3", "beautiful has eau, 3 in a row"
for v, want in [("rhythm", "0"), ("", "0"), ("queue", "4"), ("cat", "1")]:
    got = _rerun(word=v)["_out"].strip()
    assert got == want, f"word = {v!r} should print {want}, got {got}"`,
    hints: ["Same best / current pattern, but a consonant resets current to 0.", "for ch in word: if ch in \"aeiou\": current += 1, else: current = 0. Then update best."],
    walk: [
      { say: "Same pattern: the current streak and the best streak.", code: wk`word = "beautiful"
best = 0
current = 0` },
      { say: "A vowel grows the streak. Anything else breaks it, back to 0.", code: wk`word = "beautiful"
best = 0
current = 0
for ch in word:
    if ch in "aeiou":
        current += 1
    else:
        current = 0` },
      { say: "Keep the best after every character.", code: wk`word = "beautiful"
best = 0
current = 0
for ch in word:
    if ch in "aeiou":
        current += 1
    else:
        current = 0
    if current > best:
        best = current
print(best)` },
    ],
  },
},

u8l1: {
  walk: [
    { say: "Start with an empty result list and a total of 0.", code: wk`nums = [1, 2, 3, 4]
running = []
total = 0` },
    { say: "For each number, grow the total and save a snapshot of it.", code: wk`nums = [1, 2, 3, 4]
running = []
total = 0
for n in nums:
    total += n
    running.append(total)
print(running)` },
  ],
  twin: {
    q: "Build `changes`: how much each temperature in `temps` moved from the one before it (`[20, 22, 21, 25]` → `[2, -1, 4]`). Then print it.",
    starter: wk`temps = [20, 22, 21, 25]
`,
    tests: wk`assert changes == [2, -1, 4], f"changes is {changes!r}"
for v, want in [([5], []), ([], []), ([1, 1], [0]), ([10, 0, 10], [-10, 10])]:
    got = _rerun(temps=v)["changes"]
    assert got == want, f"temps = {v} should give {want}, got {got}"`,
    hints: ["You need each item and the one before it, so loop over indexes.", "for i in range(1, len(temps)): changes.append(temps[i] - temps[i - 1])"],
    walk: [
      { say: "Each change needs two items, so loop over indexes. Start at 1, because index 0 has nothing before it.", code: wk`temps = [20, 22, 21, 25]
changes = []
for i in range(1, len(temps)):` },
      { say: "Current minus previous.", code: wk`temps = [20, 22, 21, 25]
changes = []
for i in range(1, len(temps)):
    changes.append(temps[i] - temps[i - 1])
print(changes)` },
    ],
  },
},

u8l2: {
  walk: [
    { say: "Find the top score first.", code: wk`scores = [90, 85, 90, 70]
top = max(scores)` },
    { say: "Now find the biggest score that is **less** than top. Copies of 90 get skipped. `None` means \"nothing found yet\".", code: wk`scores = [90, 85, 90, 70]
top = max(scores)
second = None
for s in scores:
    if s < top and (second is None or s > second):
        second = s
print(second)` },
  ],
  twin: {
    q: "Print the top 3 **different** scores as a list, highest first. `[90, 85, 90, 70, 85, 60]` → `[90, 85, 70]`. If there are fewer than 3, print what there is.",
    starter: wk`scores = [90, 85, 90, 70, 85, 60]
`,
    tests: wk`assert _out.strip() == "[90, 85, 70]", "The top 3 different scores are [90, 85, 70]"
for v, want in [([5, 5, 5], "[5]"), ([1, 2, 3, 4], "[4, 3, 2]"), ([7, 3], "[7, 3]")]:
    got = _rerun(scores=v)["_out"].strip()
    assert got == want, f"scores = {v} should print {want}, got {got}"`,
    hints: ["Remove duplicates first, then sort and slice.", "Build unique with if s not in unique: unique.append(s). Then sorted(unique, reverse=True)[:3]"],
    walk: [
      { say: "Get rid of duplicates: only add a score if it isn't already in the new list.", code: wk`scores = [90, 85, 90, 70, 85, 60]
unique = []
for s in scores:
    if s not in unique:
        unique.append(s)` },
      { say: "Sort highest first, then slice the first 3. A slice past the end just gives what's there.", code: wk`scores = [90, 85, 90, 70, 85, 60]
unique = []
for s in scores:
    if s not in unique:
        unique.append(s)
print(sorted(unique, reverse=True)[:3])` },
    ],
  },
},

u8l3: {
  walk: [
    { say: "Unpack each tuple right in the for line. Keep the best point and its distance, starting at None.", code: wk`def closest(points):
    best = None
    best_dist = None
    for x, y in points:
        d = x * x + y * y` },
    { say: "Replace the best when there isn't one yet, or this one is closer. An empty list never enters the loop, so None is returned.", code: wk`def closest(points):
    best = None
    best_dist = None
    for x, y in points:
        d = x * x + y * y
        if best is None or d < best_dist:
            best = (x, y)
            best_dist = d
    return best` },
  ],
  twin: {
    q: "Write `bounds(points)` that returns `((min_x, min_y), (max_x, max_y))`: the smallest box around every point. Return None for an empty list.",
    starter: "",
    tests: wk`assert bounds([(1, 5), (3, -2), (0, 4)]) == ((0, -2), (3, 5)), "bounds([(1, 5), (3, -2), (0, 4)]) should be ((0, -2), (3, 5))"
assert bounds([(2, 2)]) == ((2, 2), (2, 2)), "One point is its own box"
assert bounds([]) is None, "An empty list should return None"`,
    hints: ["Handle the empty list first, then start all four values from the first point.", "for x, y in points: min_x = min(min_x, x), and the same for the other three."],
    walk: [
      { say: "Deal with the empty case first. Then start all four from the first point.", code: wk`def bounds(points):
    if not points:
        return None
    min_x, min_y = points[0]
    max_x, max_y = points[0]` },
      { say: "Unpack each point and stretch the box when needed.", code: wk`def bounds(points):
    if not points:
        return None
    min_x, min_y = points[0]
    max_x, max_y = points[0]
    for x, y in points:
        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x)
        max_y = max(max_y, y)
    return ((min_x, min_y), (max_x, max_y))` },
    ],
  },
},

u8l4: {
  walk: [
    { say: "As normal nested loops, it looks like this.", code: wk`def flat_evens(grid):
    result = []
    for row in grid:
        for n in row:
            if n % 2 == 0:
                result.append(n)
    return result` },
    { say: "A comprehension keeps the same order: the thing you keep, then the outer for, the inner for, and the if.", code: wk`def flat_evens(grid):
    return [n for row in grid for n in row if n % 2 == 0]` },
  ],
  twin: {
    q: "Write `pairs(a, b)` that returns every tuple `(x, y)` with x from `a` and y from `b` where x is less than y, using one list comprehension. `pairs([1, 2], [2, 3])` → `[(1, 2), (1, 3), (2, 3)]`.",
    starter: "",
    tests: wk`assert pairs([1, 2], [2, 3]) == [(1, 2), (1, 3), (2, 3)], "pairs([1, 2], [2, 3]) gave the wrong list"
assert pairs([5], [1, 2]) == [], "No x is less than any y here"
assert pairs([], [1]) == [], "An empty list gives []"
assert _src.count("for") >= 2 and "[" in _src, "Use one comprehension with two for clauses"`,
    hints: ["This time you keep a tuple, and the two loops go over different lists.", "[(x, y) for x in a for y in b if x < y]"],
    walk: [
      { say: "As nested loops: every x with every y, keeping the pairs where x < y.", code: wk`def pairs(a, b):
    result = []
    for x in a:
        for y in b:
            if x < y:
                result.append((x, y))
    return result` },
      { say: "Squash it into one comprehension in the same order. The kept item is a tuple, so it needs parentheses.", code: wk`def pairs(a, b):
    return [(x, y) for x in a for y in b if x < y]` },
    ],
  },
},

u9l1: {
  walk: [
    { say: "Build a brand-new dict so the original isn't changed.", code: wk`def invert(d):
    new = {}` },
    { say: "Loop over the keys. The old value becomes the new key.", code: wk`def invert(d):
    new = {}
    for k in d:
        new[d[k]] = k
    return new` },
  ],
  twin: {
    q: "Write `merge_scores(a, b)` that returns a new dict with every name from both dicts. If a name is in both, add its scores together. Don't change `a` or `b`.",
    starter: "",
    tests: wk`a = {"ana": 3, "li": 1}
b = {"ana": 2, "zoe": 5}
assert merge_scores(a, b) == {"ana": 5, "li": 1, "zoe": 5}, f"merge_scores gave {merge_scores(a, b)!r}"
assert a == {"ana": 3, "li": 1} and b == {"ana": 2, "zoe": 5}, "Don't change the original dicts"
assert merge_scores({}, {}) == {}, "Two empty dicts give {}"`,
    hints: ["Copy a into a new dict, then go through b.", "For each name in b: new[name] = new.get(name, 0) + b[name]"],
    walk: [
      { say: "Copy every entry of a into a new dict.", code: wk`def merge_scores(a, b):
    new = {}
    for name in a:
        new[name] = a[name]` },
      { say: "Add b's scores. `.get(name, 0)` gives 0 when the name isn't there yet.", code: wk`def merge_scores(a, b):
    new = {}
    for name in a:
        new[name] = a[name]
    for name in b:
        new[name] = new.get(name, 0) + b[name]
    return new` },
    ],
  },
},

u9l2: {
  walk: [
    { say: "A helper that counts letters. Lowercase and remove spaces first. `.get(ch, 0) + 1` is the counting pattern.", code: wk`def count(s):
    c = {}
    for ch in s.lower().replace(" ", ""):
        c[ch] = c.get(ch, 0) + 1
    return c` },
    { say: "Two strings are anagrams when their counts match. Dicts compare by content.", code: wk`def count(s):
    c = {}
    for ch in s.lower().replace(" ", ""):
        c[ch] = c.get(ch, 0) + 1
    return c

def is_anagram(a, b):
    return count(a) == count(b)` },
  ],
  twin: {
    q: "Write `most_common(text)` that returns the letter that appears most often, ignoring spaces and case. On a tie, return the one that shows up first. Return None for empty text.",
    starter: "",
    tests: wk`assert most_common("Hello World") == "l", "Hello World → l"
assert most_common("abab") == "a", "On a tie, return the one that appears first"
assert most_common("  B b a") == "b", "Ignore case and spaces"
assert most_common("") is None, "Empty text should return None"`,
    hints: ["Count first, then find the biggest count.", "Loop over the counts dict. Keep best and replace it only when counts[ch] > counts[best]."],
    walk: [
      { say: "Count each letter, same pattern as before.", code: wk`def most_common(text):
    counts = {}
    for ch in text.lower().replace(" ", ""):
        counts[ch] = counts.get(ch, 0) + 1` },
      { say: "Find the biggest. Dicts keep insertion order, and using `>` (not `>=`) means the earlier letter wins a tie.", code: wk`def most_common(text):
    counts = {}
    for ch in text.lower().replace(" ", ""):
        counts[ch] = counts.get(ch, 0) + 1
    best = None
    for ch in counts:
        if best is None or counts[ch] > counts[best]:
            best = ch
    return best` },
    ],
  },
},

u9l3: {
  walk: [
    { say: "Turn each list into a set. `&` keeps names in both.", code: wk`def common(a, b):
    return sorted(set(a) & set(b))` },
    { say: "`^` keeps names in exactly one. `sorted()` turns the set back into an ordered list.", code: wk`def common(a, b):
    return sorted(set(a) & set(b))

def only_one(a, b):
    return sorted(set(a) ^ set(b))` },
  ],
  twin: {
    q: "Write `has_duplicates(items)` that returns True if any item appears more than once, and `missing(nums, n)` that returns a sorted list of the numbers from 1 to n that aren't in `nums`.",
    starter: "",
    tests: wk`assert has_duplicates([1, 2, 1]) is True, "[1, 2, 1] has a duplicate"
assert has_duplicates(["a", "b"]) is False, "[a, b] has none"
assert has_duplicates([]) is False, "An empty list has none"
assert missing([1, 3, 5], 5) == [2, 4], "missing([1, 3, 5], 5) should be [2, 4]"
assert missing([], 2) == [1, 2] and missing([1, 2], 2) == [], "Handle empty and complete lists"`,
    hints: ["A set drops repeats. What does that do to its length?", "len(set(items)) != len(items). For missing: set(range(1, n + 1)) - set(nums)"],
    walk: [
      { say: "A set throws away repeats. If the set is shorter than the list, something repeated.", code: wk`def has_duplicates(items):
    return len(set(items)) != len(items)` },
      { say: "Make a set of everything that should be there, then subtract what is there.", code: wk`def has_duplicates(items):
    return len(set(items)) != len(items)

def missing(nums, n):
    return sorted(set(range(1, n + 1)) - set(nums))` },
    ],
  },
},

u10l1: {
  walk: [
    { say: "Loop over the items and collect good ones in a new list.", code: wk`def parse_ages(items):
    ages = []
    for item in items:` },
    { say: "`int()` raises ValueError for text like \"x\" or \"4.5\". `try` attempts it; `except` catches the error and skips that item.", code: wk`def parse_ages(items):
    ages = []
    for item in items:
        try:
            ages.append(int(item))
        except ValueError:
            continue
    return ages` },
  ],
  twin: {
    q: "Write `safe_divide(a, b)` that returns `a / b`. If b is 0, return `\"can't divide by zero\"`. If either isn't a number, return `\"numbers only\"`. Use try / except.",
    starter: "",
    tests: wk`assert "try" in _src and "except" in _src, "Use try / except"
assert safe_divide(6, 3) == 2.0, "safe_divide(6, 3) should be 2.0"
assert safe_divide(1, 0) == "can't divide by zero", "Dividing by 0 should return can't divide by zero"
assert safe_divide("6", 2) == "numbers only", "Text should return numbers only"
assert safe_divide(5, None) == "numbers only", "None should return numbers only"`,
    hints: ["Different mistakes raise different errors. Which one does 1 / 0 raise? And \"6\" / 2?", "except ZeroDivisionError: ... and except TypeError: ..."],
    walk: [
      { say: "Put the risky division inside `try`.", code: wk`def safe_divide(a, b):
    try:
        return a / b` },
      { say: "Each kind of error gets its own `except`. 1 / 0 raises ZeroDivisionError; \"6\" / 2 raises TypeError.", code: wk`def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "can't divide by zero"
    except TypeError:
        return "numbers only"` },
    ],
  },
},

u10l2: {
  walk: [
    { say: "`__init__` runs when you make a Rectangle. Save the values on `self` so the other methods can use them.", code: wk`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height` },
    { say: "Every method takes `self` first and reads the saved values from it.", code: wk`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height` },
  ],
  twin: {
    q: "Make a class `Counter(start=0)` with `up()`, `down()` (never goes below 0), `reset()` (back to 0) and `value()`.",
    starter: "",
    tests: wk`c = Counter()
assert c.value() == 0, "A new Counter starts at 0"
c.up(); c.up()
assert c.value() == 2, "Two up() calls should make it 2"
c.down(); c.down(); c.down()
assert c.value() == 0, "down() should never go below 0"
d = Counter(5)
assert d.value() == 5, "Counter(5) should start at 5"
d.reset()
assert d.value() == 0, "reset() goes back to 0"`,
    hints: ["The count is the object's state. Store it on self in __init__ and change it in the methods.", "down: if self.count > 0: self.count -= 1"],
    walk: [
      { say: "The count is stored on `self`. A default in `__init__` works like any function default.", code: wk`class Counter:
    def __init__(self, start=0):
        self.count = start

    def value(self):
        return self.count` },
      { say: "Methods change `self.count`. down only goes down when there's room.", code: wk`class Counter:
    def __init__(self, start=0):
        self.count = start

    def value(self):
        return self.count

    def up(self):
        self.count += 1

    def down(self):
        if self.count > 0:
            self.count -= 1

    def reset(self):
        self.count = 0` },
    ],
  },
},

u10l3: {
  walk: [
    { say: "Keep the items in a list on `self`. The end of the list is the top, so push is `append`.", code: wk`class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)` },
    { say: "pop and peek both have to check for empty first. `.pop()` removes the last item; `[-1]` just looks at it.", code: wk`class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if not self.items:
            return None
        return self.items.pop()

    def peek(self):
        if not self.items:
            return None
        return self.items[-1]` },
    { say: "size and is_empty just read the list's length.", code: wk`class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if not self.items:
            return None
        return self.items.pop()

    def peek(self):
        if not self.items:
            return None
        return self.items[-1]

    def size(self):
        return len(self.items)

    def is_empty(self):
        return len(self.items) == 0` },
  ],
  twin: {
    q: "Build a `Queue` class (first in, first out) with `enqueue(x)`, `dequeue()` (removes and returns the **front** item, or None if empty), `front()` (looks without removing, or None), `size()` and `is_empty()`.",
    starter: "",
    tests: wk`q = Queue()
assert q.is_empty() is True and q.size() == 0, "A new queue is empty"
assert q.dequeue() is None and q.front() is None, "dequeue() and front() return None when empty"
for x in [1, 2, 3]:
    q.enqueue(x)
assert q.front() == 1 and q.size() == 3, "After adding 1, 2, 3 the front is 1"
assert q.dequeue() == 1 and q.dequeue() == 2, "dequeue() returns the oldest item first"
assert q.size() == 1 and q.is_empty() is False, "One item should be left"`,
    hints: ["Same idea as a Stack, but items leave from the other end.", "dequeue: self.items.pop(0). front: self.items[0]."],
    walk: [
      { say: "Same setup as a Stack: a list on `self`, and new items go on the end.", code: wk`class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, x):
        self.items.append(x)` },
      { say: "The difference: items leave from the **front**. `.pop(0)` removes index 0, and `[0]` looks at it.", code: wk`class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, x):
        self.items.append(x)

    def dequeue(self):
        if not self.items:
            return None
        return self.items.pop(0)

    def front(self):
        if not self.items:
            return None
        return self.items[0]

    def size(self):
        return len(self.items)

    def is_empty(self):
        return len(self.items) == 0` },
    ],
  },
},
};
