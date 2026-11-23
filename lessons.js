// Python Quest course content.
// Step types:
//   learn: { t, title, body: [paragraphs], code? }
//   mcq:   { t, q, code?, options: [...], a: correctIndex, why }
//   code:  { t, q, starter, tests, hint, solution }
// Inline formatting in text: `code` and **bold**.
// Code tests run after the learner's code, in the same namespace. Helpers available:
//   _out      everything the learner's code printed
//   _src      the learner's source code
//   _rerun(name=value, ...)  re-runs the code with those variables replaced; returns its namespace (with _out)
//   _capture(fn, *args)      calls fn and returns what it printed
const py = String.raw;

window.COURSE = [
// ───────────────────────────── UNIT 1 ─────────────────────────────
{ id: "u1", title: "Getting Started", icon: "🚀", hue: 220, lessons: [
  { id: "u1l1", title: "Your First Program", steps: [
    { t: "learn", title: "Talking to the screen", body: [
      "Python runs your code from top to bottom, one line at a time.",
      "`print()` shows whatever you put inside its parentheses.",
      "Text goes inside quotes so Python knows it is text and not code."
    ], code: py`print("Hello!")
print(42)` },
    { t: "learn", title: "Comments", body: [
      "Everything after a `#` on a line is a **comment**. Python skips it.",
      "Comments are notes for people reading your code."
    ], code: py`# This whole line is ignored
print("Hi")  # this part is ignored too` },
    { t: "mcq", q: "What does this show?", code: py`print("5 + 3")`,
      options: ["8", "5 + 3", "\"5 + 3\"", "An error"], a: 1,
      why: "The quotes make it text, so Python prints it exactly as written instead of doing the math." },
    { t: "mcq", q: "Which line does Python skip completely?",
      options: ["`# print('hi')`", "`print('# hi')`", "`print('hi')`"], a: 0,
      why: "A `#` outside quotes starts a comment. Inside quotes it is just a normal character." },
    { t: "code", q: "Print exactly: `Hello, Python!`",
      starter: py`# Write your code below
`,
      tests: py`assert _out.strip().splitlines() == ["Hello, Python!"], "Print exactly: Hello, Python!"`,
      hint: "Use print() with the text inside quotes.",
      solution: py`print("Hello, Python!")` },
  ]},
  { id: "u1l2", title: "Variables", steps: [
    { t: "learn", title: "A labeled box", body: [
      "A **variable** stores a value under a name so you can use it later.",
      "`=` puts the value on the right into the name on the left. This is called **assignment**.",
      "Assigning to the same name again replaces the old value. That is **reassignment**."
    ], code: py`score = 10
print(score)   # 10
score = 15
print(score)   # 15` },
    { t: "mcq", q: "What does this print?", code: py`x = 3
x = 7
print(x)`, options: ["3", "7", "3 7", "An error"], a: 1,
      why: "The second assignment replaces 3 with 7." },
    { t: "mcq", q: "Which line stores the text Sam in a variable called `name`?",
      options: ["`name = 'Sam'`", "`'Sam' = name`", "`name == 'Sam'`", "`name: Sam`"], a: 0,
      why: "The name goes on the left of a single `=`, and the value goes on the right." },
    { t: "code", q: "Create a variable `city` that holds the text `\"Tacoma\"`, then print it.",
      starter: py`# Create city, then print it
`,
      tests: py`assert "city" in globals(), "Create a variable named city"
assert city == "Tacoma", 'city should hold "Tacoma"'
assert _out.strip() == "Tacoma", "Print city"`,
      hint: "city = \"Tacoma\" on one line, print(city) on the next.",
      solution: py`city = "Tacoma"
print(city)` },
  ]},
  { id: "u1l3", title: "Naming & Dynamic Typing", steps: [
    { t: "learn", title: "Naming rules", body: [
      "Names can use letters, digits and `_`, but they **can't start with a digit**.",
      "No spaces or symbols, and keywords like `if` or `for` are off-limits.",
      "Names are case-sensitive: `age` and `Age` are two different variables.",
      "Style: lowercase **snake_case** with descriptive words, like `total_price`. Avoid one-letter names."
    ]},
    { t: "learn", title: "Dynamic typing", body: [
      "Python is **dynamically typed**: you never declare a type. The value decides it.",
      "The same variable can later hold a value of a different type."
    ], code: py`item = 5        # Python knows this is an int
item = "five"   # now it holds a str` },
    { t: "mcq", q: "Which is a valid variable name?",
      options: ["`2nd_place`", "`user name`", "`user_name`", "`for`"], a: 2,
      why: "`2nd_place` starts with a digit, `user name` has a space, and `for` is a keyword." },
    { t: "mcq", q: "Which name follows Python style best?",
      options: ["`TotalPrice`", "`tp`", "`total_price`", "`TOTALPRICE`"], a: 2,
      why: "Python variables use lowercase snake_case with descriptive words." },
    { t: "code", q: "This code breaks the naming rules. Rename `1st_score` to `first_score` and `Player Name` to `player_name` everywhere.",
      starter: py`1st_score = 90
Player Name = "Ana"
print(1st_score)
print(Player Name)
`,
      tests: py`assert first_score == 90, "first_score should be 90"
assert player_name == "Ana", 'player_name should be "Ana"'
assert _out.split() == ["90", "Ana"], "Print both values"`,
      hint: "Change the names in all four lines.",
      solution: py`first_score = 90
player_name = "Ana"
print(first_score)
print(player_name)` },
  ]},
]},
// ───────────────────────────── UNIT 2 ─────────────────────────────
{ id: "u2", title: "Data Types", icon: "🧩", hue: 265, lessons: [
  { id: "u2l1", title: "The Core Types", steps: [
    { t: "learn", title: "Four everyday types", body: [
      "`int`: whole numbers like `7` or `-3`.",
      "`float`: numbers with a decimal point like `2.5` or `3.0`.",
      "`str`: text in quotes like `'hi'`.",
      "`bool`: only `True` or `False`.",
      "`type(x)` tells you which type a value is."
    ], code: py`print(type(7))      # <class 'int'>
print(type(2.5))    # <class 'float'>
print(type("hi"))   # <class 'str'>
print(type(True))   # <class 'bool'>` },
    { t: "mcq", q: "What is the type of `3.0`?", options: ["int", "float", "str", "bool"], a: 1,
      why: "Any number written with a decimal point is a float, even if it ends in .0." },
    { t: "mcq", q: "What is the type of `\"42\"`?", options: ["int", "str", "float"], a: 1,
      why: "The quotes make it text, even though it looks like a number." },
    { t: "mcq", q: "Which one is a bool?", options: ["`'True'`", "`True`", "`1`", "`true`"], a: 1,
      why: "Booleans are capitalized and have no quotes. Lowercase `true` isn't defined in Python." },
    { t: "code", q: "Create `age` (an int), `height` (a float), `name` (a str) and `is_student` (a bool). Any values work.",
      starter: py``,
      tests: py`assert type(age) is int, "age should be an int (a whole number)"
assert type(height) is float, "height should be a float (has a decimal point)"
assert type(name) is str, "name should be a str (text in quotes)"
assert type(is_student) is bool, "is_student should be True or False"`,
      hint: "Example: age = 20, height = 5.9, name = \"Sam\", is_student = True",
      solution: py`age = 20
height = 5.9
name = "Sam"
is_student = True` },
  ]},
  { id: "u2l2", title: "isinstance()", steps: [
    { t: "learn", title: "Is it this type?", body: [
      "`isinstance(value, type)` asks: is this value of that type? It returns `True` or `False`.",
      "Pass a tuple to accept several types: `isinstance(x, (int, float))`.",
      "It is handy for checking a value before you use it."
    ], code: py`print(isinstance(5, int))            # True
print(isinstance("hi", str))         # True
print(isinstance(2.5, (int, float))) # True` },
    { t: "mcq", q: "What does this print?", code: py`print(isinstance(3.14, int))`,
      options: ["True", "False", "3", "An error"], a: 1, why: "3.14 is a float, not an int." },
    { t: "mcq", q: "What does this print?", code: py`print(isinstance("7", (int, float)))`,
      options: ["True", "False"], a: 1, why: "\"7\" is a str. The quotes matter." },
    { t: "code", q: "Given `value = 12.5`, create `is_float`: the result of an `isinstance` check that `value` is a float. Print it.",
      starter: py`value = 12.5
`,
      tests: py`assert "isinstance" in _src, "Use isinstance()"
assert is_float is True, "is_float should be True for 12.5"
assert _out.strip() == "True", "Print is_float"
assert _rerun(value=7)["is_float"] is False, "is_float should be False when value is an int"`,
      hint: "is_float = isinstance(value, float)",
      solution: py`value = 12.5
is_float = isinstance(value, float)
print(is_float)` },
  ]},
  { id: "u2l3", title: "Converting Types", steps: [
    { t: "learn", title: "Changing a value's type", body: [
      "`int()`, `float()`, `str()` and `bool()` convert values.",
      "`int()` chops off the decimal part. It does **not** round.",
      "Text that isn't a number can't be converted: `int('hi')` raises a `ValueError`.",
      "`int('3.5')` fails too. Go through float first: `int(float('3.5'))`."
    ], code: py`print(int(3.9))       # 3
print(float("2.5"))   # 2.5
print(str(10) + "!")  # 10!` },
    { t: "mcq", q: "What is `int(7.8)`?", options: ["7", "8", "7.8", "An error"], a: 0,
      why: "int() drops the decimal part instead of rounding." },
    { t: "mcq", q: "Which line raises an error?",
      options: ["`int('12')`", "`float('1.5')`", "`int('1.5')`", "`str(1.5)`"], a: 2,
      why: "int() can't read a decimal point inside text. Use int(float('1.5'))." },
    { t: "code", q: "`a` and `b` hold text. Convert them to ints, add them, and print the sum.",
      starter: py`a = "17"
b = "25"
`,
      tests: py`assert _out.strip() == "42", "The sum should print as 42"
assert _rerun(a="1", b="2")["_out"].strip() == "3", "Convert a and b, don't hard-code the answer"`,
      hint: "print(int(a) + int(b))",
      solution: py`a = "17"
b = "25"
print(int(a) + int(b))` },
  ]},
]},
// ───────────────────────────── UNIT 3 ─────────────────────────────
{ id: "u3", title: "Numbers & Math", icon: "🔢", hue: 160, lessons: [
  { id: "u3l1", title: "Arithmetic", steps: [
    { t: "learn", title: "The basic operators", body: [
      "`+` add, `-` subtract, `*` multiply, `/` divide.",
      "`/` always gives a float: `6 / 3` is `2.0`.",
      "Mixing an int and a float in any operation gives a float.",
      "Order of operations works like math: `*` and `/` before `+` and `-`. Parentheses change the order."
    ], code: py`print(7 + 3)        # 10
print(6 / 3)        # 2.0
print(2 + 1.5)      # 3.5
print((2 + 3) * 4)  # 20` },
    { t: "mcq", q: "What does this print?", code: py`print(8 / 2)`, options: ["4", "4.0", "4.00", "An error"], a: 1,
      why: "`/` always returns a float." },
    { t: "mcq", q: "What does this print?", code: py`print(2 + 3 * 4)`, options: ["20", "14", "24"], a: 1,
      why: "Multiplication happens first: 3 * 4 = 12, then 2 + 12." },
    { t: "code", q: "A pizza costs `price = 18` and is split between `people = 4`. Print how much each person pays.",
      starter: py`price = 18
people = 4
`,
      tests: py`assert _out.strip() == "4.5", "Each person pays 4.5"
assert _rerun(price=30, people=3)["_out"].strip() == "10.0", "Use the variables, not a fixed number"`,
      hint: "print(price / people)",
      solution: py`price = 18
people = 4
print(price / people)` },
  ]},
  { id: "u3l2", title: "Floor Division, Modulo & Powers", steps: [
    { t: "learn", title: "Sharing cookies", body: [
      "`//` (floor division) divides and rounds **down** to a whole number.",
      "`%` (modulo) gives the **remainder**.",
      "7 cookies, 3 friends: each gets `7 // 3` = 2, with `7 % 3` = 1 left over.",
      "`n % 2 == 0` means n is even.",
      "`**` raises to a power: `2 ** 3` is 8."
    ], code: py`print(7 // 3)   # 2
print(7 % 3)    # 1
print(-7 // 2)  # -4  (rounds down, not toward 0)
print(2 ** 3)   # 8` },
    { t: "mcq", q: "What is `17 % 5`?", options: ["3", "2", "3.4", "12"], a: 1,
      why: "5 goes into 17 three times (15), leaving 2." },
    { t: "mcq", q: "What is `-7 // 2`?", options: ["-3", "-4", "-3.5"], a: 1,
      why: "-3.5 rounded **down** is -4. Floor division always rounds toward negative infinity." },
    { t: "mcq", q: "What is `3 ** 2`?", options: ["6", "9", "5", "32"], a: 1, why: "3 squared is 3 × 3 = 9." },
    { t: "code", q: "`total_minutes = 135`. Create `hours` and `minutes` (the leftover minutes) with `//` and `%`, then print them like `2 h 15 min`.",
      starter: py`total_minutes = 135
`,
      tests: py`assert hours == 2 and minutes == 15, "hours should be 2 and minutes 15"
assert _out.strip() == "2 h 15 min", "Print it like: 2 h 15 min"
g = _rerun(total_minutes=61)
assert g["hours"] == 1 and g["minutes"] == 1, "Compute from total_minutes using // and %"`,
      hint: "hours = total_minutes // 60 and minutes = total_minutes % 60. Then print(hours, \"h\", minutes, \"min\").",
      solution: py`total_minutes = 135
hours = total_minutes // 60
minutes = total_minutes % 60
print(hours, "h", minutes, "min")` },
  ]},
  { id: "u3l3", title: "Float Quirks & Number Tools", steps: [
    { t: "learn", title: "Floats aren't exact", body: [
      "Computers store floats in binary, so some decimals can't be stored exactly.",
      "`0.1 + 0.2` gives `0.30000000000000004`.",
      "So don't compare floats with `==` directly. Round them first."
    ], code: py`print(0.1 + 0.2)                # 0.30000000000000004
print(round(0.1 + 0.2, 2) == 0.3) # True` },
    { t: "learn", title: "Handy number functions", body: [
      "`round(x, n)` rounds to n decimal places; `round(x)` rounds to a whole number.",
      "`abs(x)` gives the distance from zero, so it's always positive.",
      "`pow(a, b)` is the same as `a ** b`."
    ], code: py`print(round(3.567, 1))  # 3.6
print(abs(-8))          # 8
print(pow(2, 5))        # 32` },
    { t: "mcq", q: "What does this print?", code: py`print(0.1 + 0.2 == 0.3)`, options: ["True", "False"], a: 1,
      why: "The sum is 0.30000000000000004, which isn't exactly 0.3." },
    { t: "mcq", q: "What is `abs(-8) + abs(3)`?", options: ["-5", "5", "11", "-11"], a: 2, why: "8 + 3 = 11." },
    { t: "code", q: "`price = 19.987`. Print it rounded to 2 decimal places.",
      starter: py`price = 19.987
`,
      tests: py`assert _out.strip() == "19.99", "It should print 19.99"
assert _rerun(price=1.234)["_out"].strip() == "1.23", "Round price, don't hard-code it"`,
      hint: "print(round(price, 2))",
      solution: py`price = 19.987
print(round(price, 2))` },
  ]},
  { id: "u3l4", title: "Augmented Assignment", steps: [
    { t: "learn", title: "Shortcuts for updating", body: [
      "`x += 1` is short for `x = x + 1`.",
      "The same shortcut exists for the others: `-=`, `*=`, `/=`, `//=`, `%=`, `**=`.",
      "It works on strings too: `+=` adds text to the end."
    ], code: py`count = 5
count += 2   # 7
count *= 3   # 21
name = "Sam"
name += "!"  # "Sam!"` },
    { t: "mcq", q: "What does this print?", code: py`x = 10
x -= 3
x *= 2
print(x)`, options: ["14", "4", "17", "20"], a: 0, why: "10 - 3 = 7, then 7 × 2 = 14." },
    { t: "code", q: "Start with `coins = 50`. Add 25, then double it, then subtract 30, using augmented assignment each time. Print `coins`.",
      starter: py`coins = 50
`,
      tests: py`assert coins == 120, "coins should end at 120"
assert "+=" in _src and "*=" in _src and "-=" in _src, "Use +=, *= and -="
assert _out.strip() == "120", "Print coins"`,
      hint: "coins += 25, then coins *= 2, then coins -= 30.",
      solution: py`coins = 50
coins += 25
coins *= 2
coins -= 30
print(coins)` },
  ]},
]},
// ───────────────────────────── UNIT 4 ─────────────────────────────
{ id: "u4", title: "Strings", icon: "🔤", hue: 30, lessons: [
  { id: "u4l1", title: "Strings & Indexing", steps: [
    { t: "learn", title: "Text and positions", body: [
      "Strings are text in single or double quotes. Triple quotes make a multi-line string.",
      "`len(s)` counts the characters.",
      "Each character has an **index**, starting at **0**.",
      "Negative indexes count from the end: `s[-1]` is the last character."
    ], code: py`word = "python"
print(word[0])    # p
print(word[-1])   # n
print(len(word))  # 6` },
    { t: "mcq", q: "What does this print?", code: py`word = "python"
print(word[2])`, options: ["y", "t", "p", "h"], a: 1, why: "Index 0 is p, 1 is y, 2 is t." },
    { t: "mcq", q: "What happens here?", code: py`s = "code"
print(s[4])`, options: ["e", "c", "IndexError", "Nothing"], a: 2,
      why: "\"code\" has indexes 0 to 3. Index 4 is out of range." },
    { t: "code", q: "`word = \"interview\"`. Print its first letter, then its last letter using a negative index.",
      starter: py`word = "interview"
`,
      tests: py`assert _out.split() == ["i", "w"], "Print i then w, on separate lines"
assert "-1" in _src, "Use a negative index for the last letter"
assert _rerun(word="hello")["_out"].split() == ["h", "o"], "Index into word, don't hard-code letters"`,
      hint: "word[0] and word[-1]",
      solution: py`word = "interview"
print(word[0])
print(word[-1])` },
  ]},
  { id: "u4l2", title: "Slicing", steps: [
    { t: "learn", title: "Taking a piece", body: [
      "`s[start:stop]` takes characters from start up to, but **not including**, stop.",
      "Leave out start to begin at 0. Leave out stop to go to the end.",
      "A third number is the step: `s[::2]` takes every other character and `s[::-1]` reverses."
    ], code: py`word = "python"
print(word[0:2])   # py
print(word[2:])    # thon
print(word[-3:])   # hon
print(word[::-1])  # nohtyp` },
    { t: "mcq", q: "What is `\"python\"[1:4]`?", options: ["pyt", "yth", "ytho", "th"], a: 1,
      why: "Indexes 1, 2 and 3. The stop index (4) isn't included." },
    { t: "mcq", q: "What is `\"hello\"[::-1]`?", options: ["hello", "olleh", "h", "An error"], a: 1,
      why: "A step of -1 walks backward through the string." },
    { t: "code", q: "`text = \"racecar\"`. Create `reversed_text` using slicing, then print whether it equals `text` (it should print True).",
      starter: py`text = "racecar"
`,
      tests: py`assert "[::-1]" in _src, "Reverse with slicing: [::-1]"
assert reversed_text == text[::-1], "reversed_text should be text reversed"
assert _out.strip() == "True", "Print reversed_text == text"
assert _rerun(text="hello")["_out"].strip() == "False", "Compare the reversed text with text"`,
      hint: "reversed_text = text[::-1], then print(reversed_text == text)",
      solution: py`text = "racecar"
reversed_text = text[::-1]
print(reversed_text == text)` },
  ]},
  { id: "u4l3", title: "Joining & f-strings", steps: [
    { t: "learn", title: "Building strings", body: [
      "`+` joins strings and `*` repeats them: `'ha' * 3` is `'hahaha'`.",
      "You can't `+` a string and a number. Convert with `str()` first.",
      "**f-strings** are easier. Put `f` before the quote and variables inside `{}`."
    ], code: py`age = 20
print("Age: " + str(age))   # Age: 20
print(f"Next year: {age + 1}")  # Next year: 21` },
    { t: "mcq", q: "What happens?", code: py`print("Age: " + 20)`, options: ["Age: 20", "Age: + 20", "TypeError"], a: 2,
      why: "Python won't add a str and an int. Use str(20) or an f-string." },
    { t: "mcq", q: "What does this print?", code: py`name = "Ana"
print(f"Hi {name}!")`, options: ["Hi {name}!", "Hi Ana!", "Hi name!"], a: 1,
      why: "In an f-string, {name} is replaced by the variable's value." },
    { t: "code", q: "Use an f-string to print `Ana scored 95 points` from `name` and `score`.",
      starter: py`name = "Ana"
score = 95
`,
      tests: py`assert 'f"' in _src or "f'" in _src, "Use an f-string"
assert _out.strip() == "Ana scored 95 points", "Print: Ana scored 95 points"
assert _rerun(name="Li", score=7)["_out"].strip() == "Li scored 7 points", "Use the variables inside {}"`,
      hint: "print(f\"{name} scored {score} points\")",
      solution: py`name = "Ana"
score = 95
print(f"{name} scored {score} points")` },
  ]},
  { id: "u4l4", title: "String Methods", steps: [
    { t: "learn", title: "Methods", body: [
      "A **method** is a function that belongs to a value. Call it with a dot: `s.upper()`.",
      "Strings are **immutable**: methods return a *new* string. The original stays the same unless you reassign it."
    ], code: py`name = "sam"
print(name.upper())  # SAM
print(name)          # sam (unchanged)
name = name.upper()  # reassign to keep it` },
    { t: "learn", title: "The ones you'll use most", body: [
      "`upper()`, `lower()`, `title()`, `capitalize()` change letter case.",
      "`strip()` removes spaces from both ends. `replace(old, new)` swaps text.",
      "`split(sep)` breaks a string into a list. `sep.join(list)` glues a list back together.",
      "`startswith(x)`, `endswith(x)`, `find(x)` (-1 if missing), `count(x)`."
    ], code: py`print("  hi  ".strip())         # hi
print("a,b,c".split(","))       # ['a', 'b', 'c']
print("-".join(["a", "b"]))     # a-b
print("banana".count("a"))      # 3` },
    { t: "mcq", q: "What does this print?", code: py`name = "sam"
name.upper()
print(name)`, options: ["SAM", "sam", "Sam"], a: 1,
      why: "upper() returned a new string, but it was never saved. name is unchanged." },
    { t: "mcq", q: "What is `\"hello\".find(\"z\")`?", options: ["0", "None", "-1", "An error"], a: 2,
      why: "find() returns -1 when the text isn't there." },
    { t: "code", q: "Clean up `raw`: remove the outer spaces and make it Title Case. Store the result in `clean` and print it.",
      starter: py`raw = "  tHe QUICK brown fox  "
`,
      tests: py`assert clean == "The Quick Brown Fox", 'clean should be "The Quick Brown Fox"'
assert _out.strip() == "The Quick Brown Fox", "Print clean"
assert _rerun(raw=" hi there ")["clean"] == "Hi There", "Use string methods on raw"`,
      hint: "You can chain methods: raw.strip().title()",
      solution: py`raw = "  tHe QUICK brown fox  "
clean = raw.strip().title()
print(clean)` },
  ]},
]},
// ───────────────────────────── UNIT 5 ─────────────────────────────
{ id: "u5", title: "Decisions", icon: "🔀", hue: 340, lessons: [
  { id: "u5l1", title: "Comparisons", steps: [
    { t: "learn", title: "True or False?", body: [
      "Comparisons give back a bool: `True` or `False`.",
      "`==` equal, `!=` not equal, `>`, `<`, `>=`, `<=`.",
      "Don't mix up `=` (assign) with `==` (compare).",
      "Comparisons can be chained: `1 < x < 10`."
    ], code: py`x = 5
print(x == 5)      # True
print(x != 5)      # False
print(1 < x < 10)  # True` },
    { t: "mcq", q: "What does this print?", code: py`print(5 == 5.0)`, options: ["True", "False"], a: 0,
      why: "They're equal in value, even though one is an int and one a float." },
    { t: "mcq", q: "What does this print?", code: py`print("a" == "A")`, options: ["True", "False"], a: 1,
      why: "String comparison is case-sensitive." },
    { t: "code", q: "`age = 19`. Create `can_vote`, which is True when age is 18 or more. Print it.",
      starter: py`age = 19
`,
      tests: py`assert can_vote is True, "can_vote should be True for 19"
assert _out.strip() == "True", "Print can_vote"
assert _rerun(age=17)["can_vote"] is False, "can_vote should be False for 17"
assert _rerun(age=18)["can_vote"] is True, "18 counts as old enough"`,
      hint: "can_vote = age >= 18",
      solution: py`age = 19
can_vote = age >= 18
print(can_vote)` },
  ]},
  { id: "u5l2", title: "if / elif / else", steps: [
    { t: "learn", title: "Choosing a path", body: [
      "`if` runs its block only when the condition is True.",
      "`elif` checks another condition when the earlier ones were False. `else` catches everything left.",
      "Only the **first** True branch runs, so order matters.",
      "End each condition with `:` and indent the block by 4 spaces."
    ], code: py`temp = 30
if temp > 25:
    print("Hot")
elif temp > 10:
    print("Mild")
else:
    print("Cold")` },
    { t: "mcq", q: "What does this print?", code: py`temp = 15
if temp > 25:
    print("Hot")
elif temp > 10:
    print("Cool")
else:
    print("Cold")`, options: ["Hot", "Cool", "Cold", "Cool and Cold"], a: 1,
      why: "15 > 25 is False, 15 > 10 is True, so \"Cool\" runs and the rest is skipped." },
    { t: "mcq", q: "What does this print?", code: py`score = 95
if score >= 70:
    print("C")
elif score >= 90:
    print("A")`, options: ["A", "C", "A and C"], a: 1,
      why: "95 >= 70 is True first, so Python never reaches the elif. Put the most specific check first." },
    { t: "code", q: "Set `grade` to `\"A\"` for score 90+, `\"B\"` for 80+, `\"C\"` for 70+, and `\"F\"` otherwise. Print `grade`.",
      starter: py`score = 84
`,
      tests: py`assert grade == "B", "84 should be a B"
for s, want in [(95, "A"), (90, "A"), (80, "B"), (75, "C"), (70, "C"), (50, "F")]:
    got = _rerun(score=s).get("grade")
    assert got == want, f"score {s} should give {want}, got {got!r}"
assert _out.strip() == "B", "Print grade"`,
      hint: "Start with if score >= 90:, then elif score >= 80:, then elif score >= 70:, then else:",
      solution: py`score = 84
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(grade)` },
  ]},
  { id: "u5l3", title: "and, or, not & in", steps: [
    { t: "learn", title: "Combining conditions", body: [
      "`and`: both sides must be True. `or`: at least one. `not`: flips True and False.",
      "**Falsy** values act like False: `0`, `''`, `[]`, `None`. Almost everything else is **truthy**.",
      "`in` checks membership: `'a' in 'cat'` is True. `not in` is the opposite."
    ], code: py`name = ""
if not name:
    print("Name is empty")
print("py" in "python")   # True` },
    { t: "mcq", q: "What does this print?", code: py`print(True and not False)`, options: ["True", "False"], a: 0,
      why: "not False is True, and True and True is True." },
    { t: "mcq", q: "What does this print?", code: py`if "":
    print("yes")
else:
    print("no")`, options: ["yes", "no", "Nothing"], a: 1, why: "An empty string is falsy." },
    { t: "mcq", q: "What does this print?", code: py`print("py" in "happy")`, options: ["True", "False"], a: 0,
      why: "\"happy\" ends with \"py\", so it's inside." },
    { t: "code", q: "Print `Valid` if `email` contains `@` **and** ends with `.edu`, otherwise print `Invalid`.",
      starter: py`email = "student@school.edu"
`,
      tests: py`assert _out.strip() == "Valid", "student@school.edu should be Valid"
for e, want in [("a@b.edu", "Valid"), ("ab.edu", "Invalid"), ("a@b.com", "Invalid")]:
    got = _rerun(email=e)["_out"].strip()
    assert got == want, f"{e} should print {want}, got {got!r}"`,
      hint: "if \"@\" in email and email.endswith(\".edu\"):",
      solution: py`email = "student@school.edu"
if "@" in email and email.endswith(".edu"):
    print("Valid")
else:
    print("Invalid")` },
  ]},
]},
// ───────────────────────────── UNIT 6 ─────────────────────────────
{ id: "u6", title: "Functions", icon: "🧰", hue: 190, lessons: [
  { id: "u6l1", title: "Defining Functions", steps: [
    { t: "learn", title: "Reusable code", body: [
      "A **function** is a reusable block of code. Define it with `def`, then call it with its name and `()`.",
      "The code inside only runs when the function is called.",
      "**Parameters** are the names in the definition. **Arguments** are the values you pass in when calling."
    ], code: py`def greet(name):       # name is a parameter
    print("Hello,", name)

greet("Sam")           # "Sam" is an argument
greet("Ali")` },
    { t: "mcq", q: "In `def add(a, b):`, what are `a` and `b`?", options: ["Parameters", "Arguments", "Return values"], a: 0,
      why: "Names in the definition are parameters. The values you pass when calling are arguments." },
    { t: "mcq", q: "What does this print?", code: py`def hi():
    print("hi")`, options: ["hi", "Nothing", "An error"], a: 1,
      why: "The function is defined but never called." },
    { t: "code", q: "Define `greet(name)` that prints `Hello, <name>!`, for example `Hello, Sam!`. Then call it with `\"Sam\"`.",
      starter: py`def greet(name):
    # your code here
    pass

`,
      tests: py`assert "Hello, Sam!" in _out, "Call greet(\"Sam\") so it prints Hello, Sam!"
assert _capture(greet, "Lee").strip() == "Hello, Lee!", "greet(\"Lee\") should print Hello, Lee!"`,
      hint: "Inside: print(f\"Hello, {name}!\"). Then on a new line with no indent: greet(\"Sam\")",
      solution: py`def greet(name):
    print(f"Hello, {name}!")

greet("Sam")` },
  ]},
  { id: "u6l2", title: "Return Values", steps: [
    { t: "learn", title: "Giving back a result", body: [
      "`return` sends a value back to whoever called the function, so you can store it or use it.",
      "`print` only shows a value. A function without `return` gives back `None`.",
      "`return` ends the function right away."
    ], code: py`def square(n):
    return n * n

result = square(4)
print(result + 1)   # 17` },
    { t: "mcq", q: "What does this print?", code: py`def f():
    print(5)

x = f()
print(x)`, options: ["5 then 5", "5 then None", "None", "5"], a: 1,
      why: "f() prints 5 but returns nothing, so x is None." },
    { t: "code", q: "Write `area(width, height)` that **returns** the area of a rectangle.",
      starter: py`def area(width, height):
    pass
`,
      tests: py`assert area(3, 4) == 12, "area(3, 4) should return 12"
assert area(2.5, 2) == 5.0, "area(2.5, 2) should return 5.0"
assert area(0, 9) == 0, "area(0, 9) should return 0"`,
      hint: "return width * height",
      solution: py`def area(width, height):
    return width * height` },
  ]},
  { id: "u6l3", title: "Defaults & Scope", steps: [
    { t: "learn", title: "Default values", body: [
      "Parameters can have defaults: `def power(x, exp=2)`. Callers can leave them out.",
    ], code: py`def power(x, exp=2):
    return x ** exp

print(power(3))     # 9
print(power(2, 5))  # 32` },
    { t: "learn", title: "Scope", body: [
      "Variables created inside a function are **local**. They don't exist outside it.",
      "Pass values in with parameters and get them out with `return`."
    ]},
    { t: "mcq", q: "What happens?", code: py`def f():
    secret = 1

f()
print(secret)`, options: ["1", "None", "NameError"], a: 2,
      why: "secret only exists inside f." },
    { t: "code", q: "Write `make_tag(text, tag=\"p\")` that returns the text wrapped in a tag: `make_tag(\"hi\")` gives `<p>hi</p>`, and `make_tag(\"hi\", \"b\")` gives `<b>hi</b>`.",
      starter: py`def make_tag(text, tag="p"):
    pass
`,
      tests: py`assert make_tag("hi") == "<p>hi</p>", 'make_tag("hi") should return <p>hi</p>'
assert make_tag("hi", "b") == "<b>hi</b>", 'make_tag("hi", "b") should return <b>hi</b>'`,
      hint: "return f\"<{tag}>{text}</{tag}>\"",
      solution: py`def make_tag(text, tag="p"):
    return f"<{tag}>{text}</{tag}>"` },
  ]},
]},
// ───────────────────────────── UNIT 7 ─────────────────────────────
{ id: "u7", title: "Loops", icon: "🔁", hue: 45, lessons: [
  { id: "u7l1", title: "for Loops & range", steps: [
    { t: "learn", title: "Repeat for each item", body: [
      "A `for` loop runs its block once for each item.",
      "`range(n)` counts from 0 up to n - 1. `range(start, stop, step)` works like slicing.",
      "You can loop over the characters of a string too."
    ], code: py`for i in range(3):
    print(i)        # 0, 1, 2

for ch in "hey":
    print(ch)       # h, e, y` },
    { t: "mcq", q: "What numbers does `range(2, 10, 3)` give?", options: ["2, 5, 8", "2, 5, 8, 11", "3, 6, 9", "2, 3, 4"], a: 0,
      why: "Start at 2, add 3 each time, stop before 10." },
    { t: "mcq", q: "How many times does this print?", code: py`for i in range(1, 5):
    print("hi")`, options: ["5", "4", "1"], a: 1, why: "1, 2, 3, 4: stop (5) isn't included." },
    { t: "code", q: "Use a loop to print the numbers 1 to 5, each on its own line.",
      starter: py``,
      tests: py`assert "for" in _src or "while" in _src, "Use a loop"
assert _out.split() == ["1", "2", "3", "4", "5"], "Print 1 through 5"`,
      hint: "for n in range(1, 6):",
      solution: py`for n in range(1, 6):
    print(n)` },
  ]},
  { id: "u7l2", title: "while, break & continue", steps: [
    { t: "learn", title: "Repeat while True", body: [
      "`while` keeps looping as long as its condition is True. Something must change, or it loops forever.",
      "`break` leaves the loop immediately. `continue` skips to the next round."
    ], code: py`n = 3
while n > 0:
    print(n)
    n -= 1
print("Liftoff!")` },
    { t: "mcq", q: "What does this print?", code: py`n = 1
while n < 20:
    n *= 2
print(n)`, options: ["16", "32", "20", "64"], a: 1,
      why: "1, 2, 4, 8, 16, 32. At 32 the condition fails." },
    { t: "mcq", q: "What does this print?", code: py`for i in range(5):
    if i == 3:
        break
    print(i)`, options: ["0 1 2", "0 1 2 3", "0 1 2 4", "3"], a: 0,
      why: "When i is 3, break exits before printing." },
    { t: "code", q: "Start at `n = 100`. While n is greater than 1, halve it with `//=` and count the steps. Print the count.",
      starter: py`n = 100
steps = 0
`,
      tests: py`assert "while" in _src, "Use a while loop"
assert _out.strip() == "6", "100 takes 6 halvings to reach 1"
assert _rerun(n=8)["_out"].strip() == "3", "Count steps from n, don't hard-code"`,
      hint: "while n > 1: then n //= 2 and steps += 1. Print steps after the loop.",
      solution: py`n = 100
steps = 0
while n > 1:
    n //= 2
    steps += 1
print(steps)` },
  ]},
  { id: "u7l3", title: "Loop Patterns", steps: [
    { t: "learn", title: "Accumulate and count", body: [
      "**Accumulator**: start a total at 0 (or `''`) and add to it each time through the loop.",
      "**Counter**: add 1 whenever something matches.",
      "`enumerate(seq)` gives you the index and the item together."
    ], code: py`total = 0
for n in [4, 5, 6]:
    total += n
print(total)            # 15

for i, ch in enumerate("ab"):
    print(i, ch)        # 0 a, 1 b` },
    { t: "mcq", q: "What does this print?", code: py`total = 0
for n in range(1, 4):
    total += n
print(total)`, options: ["6", "10", "3", "4"], a: 0, why: "1 + 2 + 3 = 6." },
    { t: "code", q: "Count the vowels (a, e, i, o, u) in `text`, ignoring upper/lower case. Print the count.",
      starter: py`text = "Programming is fun"
`,
      tests: py`assert _out.strip() == "5", "Programming is fun has 5 vowels"
assert _rerun(text="EDUCATION")["_out"].strip() == "5", "Uppercase vowels count too"
assert _rerun(text="xyz")["_out"].strip() == "0", "No vowels should print 0"`,
      hint: "Loop over text.lower() and add 1 when ch in \"aeiou\".",
      solution: py`text = "Programming is fun"
count = 0
for ch in text.lower():
    if ch in "aeiou":
        count += 1
print(count)` },
  ]},
]},
// ───────────────────────────── UNIT 8 ─────────────────────────────
{ id: "u8", title: "Lists & Tuples", icon: "📦", hue: 120, lessons: [
  { id: "u8l1", title: "Lists", steps: [
    { t: "learn", title: "Many values, in order", body: [
      "A **list** holds values in order: `nums = [3, 1, 4]`.",
      "Index and slice lists just like strings.",
      "`len(nums)` counts items and `nums.append(x)` adds to the end.",
      "Lists are **mutable**: you can change an item in place, like `nums[0] = 9`.",
      "`sum(nums)`, `min(nums)` and `max(nums)` work on number lists."
    ], code: py`nums = [3, 1, 4]
nums.append(5)
nums[0] = 9
print(nums)        # [9, 1, 4, 5]
print(len(nums))   # 4` },
    { t: "mcq", q: "What does this print?", code: py`a = [1, 2, 3]
a.append(4)
print(len(a))`, options: ["3", "4", "5"], a: 1, why: "append adds one item." },
    { t: "mcq", q: "What does this print?", code: py`a = [10, 20, 30]
a[1] = 99
print(a)`, options: ["[10, 20, 30]", "[99, 20, 30]", "[10, 99, 30]", "TypeError"], a: 2,
      why: "Lists are mutable, and index 1 is the second item." },
    { t: "code", q: "Make a list `scores` with 70, 85 and 90. Append 100, then print the average (sum divided by count).",
      starter: py``,
      tests: py`assert scores == [70, 85, 90, 100], "scores should be [70, 85, 90, 100]"
assert _out.strip() == "86.25", "The average is 86.25"`,
      hint: "print(sum(scores) / len(scores))",
      solution: py`scores = [70, 85, 90]
scores.append(100)
print(sum(scores) / len(scores))` },
  ]},
  { id: "u8l2", title: "List Methods & Sorting", steps: [
    { t: "learn", title: "Changing lists", body: [
      "`pop()` removes and returns the last item. `pop(i)` removes index i.",
      "`remove(x)` deletes the first x. `insert(i, x)` adds x at index i.",
      "`lst.sort()` sorts in place and returns None. `sorted(lst)` returns a new sorted list.",
      "Add `reverse=True` to sort from biggest to smallest."
    ], code: py`a = [3, 1, 2]
b = sorted(a)
print(a, b)               # [3, 1, 2] [1, 2, 3]
a.sort(reverse=True)
print(a)                  # [3, 2, 1]` },
    { t: "mcq", q: "What does this print?", code: py`a = [5, 6, 7]
x = a.pop()
print(x, a)`, options: ["7 [5, 6]", "5 [6, 7]", "[5, 6] 7", "None [5, 6]"], a: 0,
      why: "pop() takes the last item off and returns it." },
    { t: "mcq", q: "What does this print?", code: py`a = [3, 1, 2]
a = a.sort()
print(a)`, options: ["[1, 2, 3]", "None", "[3, 1, 2]"], a: 1,
      why: "sort() changes the list in place and returns None, and that None was saved into a." },
    { t: "code", q: "From `nums`, create `top3`: the three largest numbers, biggest first.",
      starter: py`nums = [8, 3, 5, 1, 9]
`,
      tests: py`assert top3 == [9, 8, 5], "top3 should be [9, 8, 5]"
assert _rerun(nums=[1, 2, 3, 4])["top3"] == [4, 3, 2], "Work from nums, don't hard-code"`,
      hint: "sorted(nums, reverse=True) then slice the first 3 with [:3].",
      solution: py`nums = [8, 3, 5, 1, 9]
top3 = sorted(nums, reverse=True)[:3]` },
  ]},
  { id: "u8l3", title: "Tuples & Unpacking", steps: [
    { t: "learn", title: "Fixed groups", body: [
      "A **tuple** is like a list but **immutable**: `point = (3, 4)`.",
      "Use tuples for groups of values that belong together and shouldn't change.",
      "**Unpacking** gives each item a name: `x, y = point`.",
      "Swap two variables in one line: `a, b = b, a`."
    ], code: py`point = (3, 4)
x, y = point
print(x + y)   # 7` },
    { t: "mcq", q: "What happens?", code: py`t = (1, 2, 3)
t[0] = 9`, options: ["t becomes (9, 2, 3)", "TypeError", "Nothing"], a: 1, why: "Tuples can't be changed." },
    { t: "mcq", q: "What does this print?", code: py`a, b = 1, 2
a, b = b, a
print(a, b)`, options: ["1 2", "2 1", "2 2"], a: 1, why: "The values swap in one step." },
    { t: "code", q: "Write `min_max(nums)` that returns a tuple `(smallest, largest)`.",
      starter: py`def min_max(nums):
    pass
`,
      tests: py`assert min_max([4, 1, 9]) == (1, 9), "min_max([4, 1, 9]) should be (1, 9)"
assert min_max([5]) == (5, 5), "min_max([5]) should be (5, 5)"
assert isinstance(min_max([2, 3]), tuple), "Return a tuple"`,
      hint: "return min(nums), max(nums)",
      solution: py`def min_max(nums):
    return min(nums), max(nums)` },
  ]},
  { id: "u8l4", title: "List Comprehensions", steps: [
    { t: "learn", title: "Lists in one line", body: [
      "A list comprehension builds a list in one line: `[expression for item in seq]`.",
      "Add a filter at the end: `[n for n in nums if n % 2 == 0]`."
    ], code: py`squares = [n * n for n in range(5)]
print(squares)   # [0, 1, 4, 9, 16]

evens = [n for n in range(10) if n % 2 == 0]
print(evens)     # [0, 2, 4, 6, 8]` },
    { t: "mcq", q: "What is `[x * 2 for x in range(3)]`?", options: ["[2, 4, 6]", "[0, 2, 4]", "[0, 1, 2]"], a: 1,
      why: "range(3) is 0, 1, 2, and each is doubled." },
    { t: "code", q: "From `words`, make `long_words`: only words longer than 3 letters, in UPPERCASE.",
      starter: py`words = ["hi", "python", "is", "awesome"]
`,
      tests: py`assert long_words == ["PYTHON", "AWESOME"], 'long_words should be ["PYTHON", "AWESOME"]'
assert _rerun(words=["abcd", "abc"])["long_words"] == ["ABCD"], "Use len(w) > 3 as the filter"`,
      hint: "[w.upper() for w in words if len(w) > 3]",
      solution: py`words = ["hi", "python", "is", "awesome"]
long_words = [w.upper() for w in words if len(w) > 3]` },
  ]},
]},
// ───────────────────────────── UNIT 9 ─────────────────────────────
{ id: "u9", title: "Dictionaries & Sets", icon: "🗂️", hue: 290, lessons: [
  { id: "u9l1", title: "Dictionaries", steps: [
    { t: "learn", title: "Keys and values", body: [
      "A **dict** maps keys to values: `ages = {'ana': 20, 'li': 22}`.",
      "Read a value with `ages['ana']`. Add or change one with `ages['sam'] = 19`.",
      "A missing key raises `KeyError`. `ages.get('zoe', 0)` returns 0 instead.",
      "`in` checks keys: `'ana' in ages` is True."
    ], code: py`ages = {"ana": 20, "li": 22}
ages["sam"] = 19
print(ages["li"])          # 22
print(ages.get("zoe", 0))  # 0` },
    { t: "mcq", q: "What does this print?", code: py`d = {"a": 1}
d["b"] = 2
d["a"] = 5
print(len(d))`, options: ["2", "3", "1"], a: 0, why: "Setting \"a\" again replaces its value instead of adding a new key." },
    { t: "mcq", q: "What does this print?", code: py`d = {"a": 1}
print(d.get("z"))`, options: ["0", "None", "KeyError"], a: 1, why: "get() returns None for a missing key when no default is given." },
    { t: "code", q: "Start with `stock`. Add `\"kiwi\"` with 7, then increase apple by 3. Print `stock[\"apple\"]`.",
      starter: py`stock = {"apple": 5, "pear": 2}
`,
      tests: py`assert stock == {"apple": 8, "pear": 2, "kiwi": 7}, "stock should be apple 8, pear 2, kiwi 7"
assert _out.strip() == "8", "Print stock[\"apple\"]"`,
      hint: "stock[\"kiwi\"] = 7 and stock[\"apple\"] += 3",
      solution: py`stock = {"apple": 5, "pear": 2}
stock["kiwi"] = 7
stock["apple"] += 3
print(stock["apple"])` },
  ]},
  { id: "u9l2", title: "Looping & Counting", steps: [
    { t: "learn", title: "Walking through a dict", body: [
      "`for key in d` loops over keys. `d.items()` gives key and value pairs.",
      "`d.keys()` and `d.values()` give just one side.",
      "**Counting pattern**: `counts[x] = counts.get(x, 0) + 1`. It shows up in a lot of interview problems."
    ], code: py`counts = {}
for ch in "aab":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)   # {'a': 2, 'b': 1}` },
    { t: "mcq", q: "What does this print?", code: py`d = {"a": 1, "b": 2}
for k, v in d.items():
    print(k * v)`, options: ["a then bb", "1 then 2", "ab", "TypeError"], a: 0,
      why: "A string times an int repeats it: \"a\" * 1 and \"b\" * 2." },
    { t: "code", q: "Write `char_count(s)` that returns a dict of how many times each character appears.",
      starter: py`def char_count(s):
    counts = {}
    # your loop here
    return counts
`,
      tests: py`assert char_count("hello") == {"h": 1, "e": 1, "l": 2, "o": 1}, "char_count(\"hello\") is wrong"
assert char_count("") == {}, "An empty string should give {}"
assert char_count("aaa") == {"a": 3}, "char_count(\"aaa\") should be {'a': 3}"`,
      hint: "for ch in s: counts[ch] = counts.get(ch, 0) + 1",
      solution: py`def char_count(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts` },
  ]},
  { id: "u9l3", title: "Sets", steps: [
    { t: "learn", title: "Unique values only", body: [
      "A **set** holds unique values in no particular order: `{1, 2, 3}`.",
      "`set(lst)` removes duplicates. An empty set is `set()`, because `{}` is an empty dict.",
      "`add(x)` inserts, and checking `x in s` is very fast.",
      "`a | b` union, `a & b` intersection, `a - b` difference."
    ], code: py`seen = set([1, 1, 2, 3, 3])
print(seen)            # {1, 2, 3}
print({1, 2} & {2, 3}) # {2}` },
    { t: "mcq", q: "What does this print?", code: py`print(len(set([1, 1, 2, 2, 3])))`, options: ["5", "3", "2"], a: 1,
      why: "Duplicates are dropped, leaving 1, 2, 3." },
    { t: "mcq", q: "What is `type({})`?", options: ["set", "dict", "list"], a: 1, why: "Empty braces make a dict. Use set() for an empty set." },
    { t: "code", q: "Write `has_duplicates(lst)` that returns True if any value appears more than once.",
      starter: py`def has_duplicates(lst):
    pass
`,
      tests: py`assert has_duplicates([1, 2, 3, 1]) is True, "[1, 2, 3, 1] has a duplicate"
assert has_duplicates([1, 2, 3]) is False, "[1, 2, 3] has no duplicates"
assert has_duplicates([]) is False, "An empty list has no duplicates"`,
      hint: "Compare len(set(lst)) with len(lst).",
      solution: py`def has_duplicates(lst):
    return len(set(lst)) != len(lst)` },
  ]},
]},
// ───────────────────────────── UNIT 10 ─────────────────────────────
{ id: "u10", title: "Errors & Classes", icon: "🏰", hue: 10, lessons: [
  { id: "u10l1", title: "Handling Errors", steps: [
    { t: "learn", title: "try / except", body: [
      "Errors (exceptions) stop your program. Common ones: `ValueError`, `TypeError`, `IndexError`, `KeyError`, `ZeroDivisionError`.",
      "`try` runs code that might fail. `except` runs only if that error happens.",
      "Catch the specific error you expect, not every error."
    ], code: py`try:
    n = int("abc")
except ValueError:
    n = 0
print(n)   # 0` },
    { t: "mcq", q: "What does this print?", code: py`try:
    print(1 / 0)
except ZeroDivisionError:
    print("oops")`, options: ["0", "oops", "ZeroDivisionError", "inf"], a: 1,
      why: "Dividing by zero raises ZeroDivisionError, so the except block runs." },
    { t: "code", q: "Write `safe_divide(a, b)` that returns `a / b`, or `None` if b is 0. Use try/except.",
      starter: py`def safe_divide(a, b):
    pass
`,
      tests: py`assert "try" in _src and "except" in _src, "Use try and except"
assert safe_divide(10, 4) == 2.5, "safe_divide(10, 4) should be 2.5"
assert safe_divide(5, 0) is None, "safe_divide(5, 0) should return None"`,
      hint: "try: return a / b, then except ZeroDivisionError: return None",
      solution: py`def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None` },
  ]},
  { id: "u10l2", title: "Classes & Objects", steps: [
    { t: "learn", title: "Blueprints", body: [
      "A **class** is a blueprint. An **object** is one thing built from it.",
      "`__init__` runs when you create an object and sets up its starting data.",
      "`self` is the object itself. `self.name = name` stores data on it."
    ], code: py`class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = 0

rex = Dog("Rex")
print(rex.name)    # Rex` },
    { t: "mcq", q: "Inside a class, what is `self`?", options: ["The class itself", "The object being used", "A keyword for return", "The first argument you pass"], a: 1,
      why: "self refers to the specific object, so each object keeps its own data." },
    { t: "code", q: "Make a class `Player` whose `__init__` takes `name`, sets `self.name` to it, and sets `self.score` to 0.",
      starter: py`class Player:
    pass
`,
      tests: py`p = Player("Ana")
assert p.name == "Ana", "p.name should be the name passed in"
assert p.score == 0, "score should start at 0"`,
      hint: "def __init__(self, name): then self.name = name and self.score = 0",
      solution: py`class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0` },
  ]},
  { id: "u10l3", title: "Methods", steps: [
    { t: "learn", title: "Functions inside a class", body: [
      "A method is a function defined inside a class. Its first parameter is `self`.",
      "Methods can read and change the object's data through `self`."
    ], code: py`class Counter:
    def __init__(self):
        self.n = 0

    def inc(self):
        self.n += 1

c = Counter()
c.inc()
print(c.n)   # 1` },
    { t: "mcq", q: "What does this print?", code: py`class Counter:
    def __init__(self):
        self.n = 0
    def inc(self):
        self.n += 1

c = Counter()
c.inc()
c.inc()
print(c.n)`, options: ["0", "1", "2"], a: 2, why: "Each call adds 1 to that object's n." },
    { t: "code", q: "Add two methods to `Player`: `add_points(n)` increases score by n, and `level()` returns `score // 100 + 1`.",
      starter: py`class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0

    # add_points and level go here
`,
      tests: py`p = Player("Ana")
assert p.level() == 1, "A new player is level 1"
p.add_points(150)
assert p.score == 150, "add_points(150) should make score 150"
assert p.level() == 2, "150 points is level 2"
p.add_points(60)
assert p.level() == 3, "210 points is level 3"`,
      hint: "def add_points(self, n): self.score += n   and   def level(self): return self.score // 100 + 1",
      solution: py`class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0

    def add_points(self, n):
        self.score += n

    def level(self):
        return self.score // 100 + 1` },
  ]},
]},
];
