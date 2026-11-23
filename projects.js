// One build-it project per unit. Unlocks when the unit's lessons are done.
// A code step with carry: true starts from the code you passed in the previous step, plus `add`.
const pj = String.raw;

window.PROJECTS = [
{ id: "p1", unit: "u1", title: "Profile Card", icon: "🪪", steps: [
  { t: "learn", title: "Build a profile card", body: [
    "You'll print a small profile card using variables.",
    "Each step builds on your code from the step before."
  ]},
  { t: "code", q: "Create `name` and `school` (any text) and print each one on its own line.",
    starter: pj`# Profile Card
`,
    tests: pj`assert isinstance(name, str) and isinstance(school, str), "name and school should be text"
lines = _out.strip().splitlines()
assert name in lines and school in lines, "Print name and school on their own lines"`,
    hint: "name = \"Sam\" and school = \"UW\", then print(name) and print(school).",
    solution: pj`# Profile Card
name = "Sam"
school = "UW"
print(name)
print(school)` },
  { t: "code", carry: true, add: pj`
# Step 2: add year, then a line of 20 dashes
`, q: "Add `year` (a whole number) and print it. Then print a line of exactly 20 dashes.",
    tests: pj`assert type(year) is int, "year should be an int"
lines = _out.strip().splitlines()
assert str(year) in lines, "Print year on its own line"
assert lines[-1] == "-" * 20, "The last line should be exactly 20 dashes"`,
    hint: "year = 2, print(year), then print(\"--------------------\") with 20 dashes.",
    solution: pj`# Profile Card
name = "Sam"
school = "UW"
print(name)
print(school)
year = 2
print(year)
print("--------------------")` },
]},
{ id: "p2", unit: "u2", title: "Type Inspector", icon: "🔍", steps: [
  { t: "learn", title: "Inspect some values", body: [
    "You'll convert text into numbers and check their types along the way."
  ]},
  { t: "code", q: "`raw` holds text. Make `f` the float version of it and `n` the int version of `f`. Print `f` then `n`.",
    starter: pj`raw = "3.7"
`,
    tests: pj`assert f == 3.7 and n == 3, "f should be 3.7 and n should be 3"
assert _out.split() == ["3.7", "3"], "Print f then n"
g = _rerun(raw="9.2")
assert g["f"] == 9.2 and g["n"] == 9, "Convert from raw, don't hard-code"`,
    hint: "f = float(raw) and n = int(f)",
    solution: pj`raw = "3.7"
f = float(raw)
n = int(f)
print(f)
print(n)` },
  { t: "code", carry: true, add: pj`
# Step 2: check the types
`, q: "Now print `type(f)`, then print whether `n` is an int using `isinstance`.",
    tests: pj`assert "isinstance" in _src, "Use isinstance()"
lines = _out.strip().splitlines()
assert "<class 'float'>" in lines, "Print type(f)"
assert lines[-1] == "True", "The last line should be isinstance(n, int), which is True"`,
    hint: "print(type(f)) and print(isinstance(n, int))",
    solution: pj`raw = "3.7"
f = float(raw)
n = int(f)
print(f)
print(n)
print(type(f))
print(isinstance(n, int))` },
]},
{ id: "p3", unit: "u3", title: "Tip Calculator", icon: "🧾", steps: [
  { t: "learn", title: "Split the bill", body: [
    "You'll work out the tip, the total, and what each person pays."
  ]},
  { t: "code", q: "Make `tip`: `bill` times `tip_percent` divided by 100. Print it rounded to 2 decimals.",
    starter: pj`bill = 48.50
tip_percent = 18
`,
    tests: pj`assert abs(tip - 8.73) < 0.001, "tip should be 8.73"
assert _out.strip() == "8.73", "Print tip rounded to 2 decimals"
assert _rerun(bill=100, tip_percent=20)["_out"].strip() == "20.0", "Use bill and tip_percent"`,
    hint: "tip = bill * tip_percent / 100, then print(round(tip, 2))",
    solution: pj`bill = 48.50
tip_percent = 18
tip = bill * tip_percent / 100
print(round(tip, 2))` },
  { t: "code", carry: true, add: pj`
people = 3
# Step 2: total and each person's share
`, q: "Make `total` (bill plus tip) and `share` (total split between `people`). Print `share` rounded to 2 decimals.",
    tests: pj`assert abs(total - 57.23) < 0.001, "total should be bill + tip"
assert _out.strip().splitlines()[-1] == "19.08", "The last line should be the share, 19.08"
assert _rerun(bill=90, tip_percent=0, people=3)["_out"].strip().splitlines()[-1] == "30.0", "Divide total by people"`,
    hint: "total = bill + tip, share = total / people, print(round(share, 2))",
    solution: pj`bill = 48.50
tip_percent = 18
tip = bill * tip_percent / 100
print(round(tip, 2))
people = 3
total = bill + tip
share = total / people
print(round(share, 2))` },
]},
{ id: "p4", unit: "u4", title: "Username Maker", icon: "🏷️", steps: [
  { t: "learn", title: "Make a username", body: [
    "You'll build a username from a first and last name with indexing, methods and f-strings."
  ]},
  { t: "code", q: "Make `username`: the first letter of `first` plus all of `last`, all lowercase. Print it (`alovelace`).",
    starter: pj`first = "Ada"
last = "Lovelace"
`,
    tests: pj`assert username == "alovelace", 'username should be "alovelace"'
assert _out.strip() == "alovelace", "Print username"
assert _rerun(first="Grace", last="Hopper")["username"] == "ghopper", "Build it from first and last"`,
    hint: "username = first[0].lower() + last.lower()",
    solution: pj`first = "Ada"
last = "Lovelace"
username = first[0].lower() + last.lower()
print(username)` },
  { t: "code", carry: true, add: pj`
year = 2026
# Step 2: add the last two digits of year
`, q: "Add the last two digits of `year` to the end of `username` with `+=`. Then print `Your username: alovelace26` using an f-string.",
    tests: pj`assert username == "alovelace26", 'username should be "alovelace26"'
assert _out.strip().splitlines()[-1] == "Your username: alovelace26", "The last line should be: Your username: alovelace26"
assert _rerun(year=1999)["username"].endswith("99"), "Slice the digits from year"`,
    hint: "username += str(year)[-2:] then print(f\"Your username: {username}\")",
    solution: pj`first = "Ada"
last = "Lovelace"
username = first[0].lower() + last.lower()
print(username)
year = 2026
username += str(year)[-2:]
print(f"Your username: {username}")` },
]},
{ id: "p5", unit: "u5", title: "Ticket Pricer", icon: "🎟️", steps: [
  { t: "learn", title: "Price a movie ticket", body: [
    "You'll use if / elif / else and `and` to set a ticket price."
  ]},
  { t: "code", q: "Set `price`: 0 if age is under 5, 8 if under 13, otherwise 15. Print `Price: <price>`.",
    starter: pj`age = 20
`,
    tests: pj`for a, want in [(3, 0), (5, 8), (12, 8), (13, 15), (40, 15)]:
    got = _rerun(age=a).get("price")
    assert got == want, f"age {a} should cost {want}, got {got!r}"
assert _out.strip() == "Price: 15", "Print it like: Price: 15"`,
    hint: "if age < 5: ... elif age < 13: ... else: ...  then print(f\"Price: {price}\")",
    solution: pj`age = 20
if age < 5:
    price = 0
elif age < 13:
    price = 8
else:
    price = 15
print(f"Price: {price}")` },
  { t: "code", carry: true, add: pj`
is_student = True
# Step 2: student discount
`, q: "Students aged 13 or older get 3 off. Apply it with `and`, then print `Price: <price>` again.",
    tests: pj`assert _out.strip().splitlines()[-1] == "Price: 12", "A 20-year-old student pays 12"
assert _rerun(is_student=False)["_out"].strip().splitlines()[-1] == "Price: 15", "Non-students pay full price"
assert _rerun(age=10)["_out"].strip().splitlines()[-1] == "Price: 8", "Kids under 13 don't get the discount"`,
    hint: "if is_student and age >= 13: price -= 3",
    solution: pj`age = 20
if age < 5:
    price = 0
elif age < 13:
    price = 8
else:
    price = 15
print(f"Price: {price}")
is_student = True
if is_student and age >= 13:
    price -= 3
print(f"Price: {price}")` },
]},
{ id: "p6", unit: "u6", title: "Temperature Converter", icon: "🌡️", steps: [
  { t: "learn", title: "Convert temperatures", body: [
    "You'll write small functions that return values, then use them together."
  ]},
  { t: "code", q: "Write `c_to_f(c)` that returns Fahrenheit: `c * 9 / 5 + 32`.",
    starter: pj`def c_to_f(c):
    pass
`,
    tests: pj`assert c_to_f(0) == 32, "c_to_f(0) should be 32"
assert c_to_f(100) == 212, "c_to_f(100) should be 212"
assert c_to_f(-40) == -40, "c_to_f(-40) should be -40"`,
    hint: "return c * 9 / 5 + 32",
    solution: pj`def c_to_f(c):
    return c * 9 / 5 + 32` },
  { t: "code", carry: true, add: pj`

# Step 2: the other direction
`, q: "Add `f_to_c(f)` that returns Celsius rounded to 1 decimal: `(f - 32) * 5 / 9`.",
    tests: pj`assert c_to_f(100) == 212, "Keep c_to_f working"
assert f_to_c(212) == 100, "f_to_c(212) should be 100"
assert f_to_c(70) == 21.1, "f_to_c(70) should be 21.1"`,
    hint: "return round((f - 32) * 5 / 9, 1)",
    solution: pj`def c_to_f(c):
    return c * 9 / 5 + 32

def f_to_c(f):
    return round((f - 32) * 5 / 9, 1)` },
  { t: "code", carry: true, add: pj`

# Step 3: describe the weather
`, q: "Add `describe(c, unit=\"C\")` that returns `\"30C is 86.0F\"` for `describe(30)`. If unit is `\"F\"`, return `\"86F is 30.0C\"` for `describe(86, \"F\")`.",
    tests: pj`assert describe(30) == "30C is 86.0F", 'describe(30) should be "30C is 86.0F"'
assert describe(86, "F") == "86F is 30.0C", 'describe(86, "F") should be "86F is 30.0C"'`,
    hint: "if unit == \"C\": return f\"{c}C is {c_to_f(c)}F\"  else: return f\"{c}F is {f_to_c(c)}C\"",
    solution: pj`def c_to_f(c):
    return c * 9 / 5 + 32

def f_to_c(f):
    return round((f - 32) * 5 / 9, 1)

def describe(c, unit="C"):
    if unit == "C":
        return f"{c}C is {c_to_f(c)}F"
    return f"{c}F is {f_to_c(c)}C"` },
]},
{ id: "p7", unit: "u7", title: "FizzBuzz", icon: "🥤", steps: [
  { t: "learn", title: "A classic interview warm-up", body: [
    "FizzBuzz shows up in real interviews. You'll build it in two steps."
  ]},
  { t: "code", q: "Use a loop to print the numbers 1 to 15, one per line.",
    starter: pj``,
    tests: pj`assert _out.split() == [str(i) for i in range(1, 16)], "Print 1 through 15"`,
    hint: "for n in range(1, 16): print(n)",
    solution: pj`for n in range(1, 16):
    print(n)` },
  { t: "code", carry: true, add: "", q: "Change your loop: print `Fizz` for multiples of 3, `Buzz` for multiples of 5, and `FizzBuzz` for multiples of both. Print the number otherwise.",
    tests: pj`want = []
for i in range(1, 16):
    want.append("FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else str(i))
got = _out.split()
assert got == want, f"Line {next((i + 1 for i, (a, b) in enumerate(zip(got, want)) if a != b), len(got) + 1)} is wrong. Check FizzBuzz first"`,
    hint: "Check n % 15 == 0 first, then n % 3, then n % 5, else print(n).",
    solution: pj`for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)` },
]},
{ id: "p8", unit: "u8", title: "To-Do List", icon: "✅", steps: [
  { t: "learn", title: "Manage a to-do list", body: [
    "You'll add tasks to a list, print them numbered, and remove finished ones."
  ]},
  { t: "code", q: "Append three tasks (any text) to `todos`. Then print them numbered like `1. Study` using `enumerate(todos, 1)`.",
    starter: pj`todos = []
`,
    tests: pj`assert len(todos) == 3, "todos should have 3 tasks"
lines = _out.strip().splitlines()
assert lines == [f"{i}. {t}" for i, t in enumerate(todos, 1)], "Print each task like: 1. Study"`,
    hint: "for i, task in enumerate(todos, 1): print(f\"{i}. {task}\")",
    solution: pj`todos = []
todos.append("Study")
todos.append("Gym")
todos.append("Laundry")
for i, task in enumerate(todos, 1):
    print(f"{i}. {task}")` },
  { t: "code", carry: true, add: pj`
# Step 2: finish the first task
`, q: "The first task is done. Remove it with `pop(0)`, then print `Done: <task>` and `<n> left`.",
    tests: pj`assert len(todos) == 2, "todos should have 2 tasks left"
lines = _out.strip().splitlines()
assert lines[-2].startswith("Done: "), "Print Done: <task>"
assert lines[-1] == "2 left", "The last line should be: 2 left"`,
    hint: "done = todos.pop(0), print(f\"Done: {done}\"), print(f\"{len(todos)} left\")",
    solution: pj`todos = []
todos.append("Study")
todos.append("Gym")
todos.append("Laundry")
for i, task in enumerate(todos, 1):
    print(f"{i}. {task}")
done = todos.pop(0)
print(f"Done: {done}")
print(f"{len(todos)} left")` },
]},
{ id: "p9", unit: "u9", title: "Word Counter", icon: "📊", steps: [
  { t: "learn", title: "Count words", body: [
    "You'll count words with a dict, the same pattern used in lots of interview problems."
  ]},
  { t: "code", q: "Write `word_counts(text)` that lowercases the text, splits it into words, and returns a dict of counts.",
    starter: pj`def word_counts(text):
    counts = {}
    return counts
`,
    tests: pj`assert word_counts("the cat the hat") == {"the": 2, "cat": 1, "hat": 1}, "Count each word"
assert word_counts("A a A") == {"a": 3}, "Ignore upper/lower case"
assert word_counts("") == {}, "Empty text gives {}"`,
    hint: "for w in text.lower().split(): counts[w] = counts.get(w, 0) + 1",
    solution: pj`def word_counts(text):
    counts = {}
    for w in text.lower().split():
        counts[w] = counts.get(w, 0) + 1
    return counts` },
  { t: "code", carry: true, add: pj`

# Step 2: find the most common word
`, q: "Add `top_word(text)` that returns the most common word. Loop over the counts and keep the best one so far.",
    tests: pj`assert top_word("the cat the hat") == "the", 'top_word should be "the"'
assert top_word("b a b a b") == "b", 'top_word should be "b"'`,
    hint: "best = None; for w, c in word_counts(text).items(): if best is None or c > word_counts(text)[best]: best = w",
    solution: pj`def word_counts(text):
    counts = {}
    for w in text.lower().split():
        counts[w] = counts.get(w, 0) + 1
    return counts

def top_word(text):
    counts = word_counts(text)
    best = None
    for w, c in counts.items():
        if best is None or c > counts[best]:
            best = w
    return best` },
]},
{ id: "p10", unit: "u10", title: "Bank Account", icon: "🏦", steps: [
  { t: "learn", title: "Model a bank account", body: [
    "You'll build a class with data and methods, step by step."
  ]},
  { t: "code", q: "Make class `Account`: `__init__(self, owner)` sets `owner` and `balance = 0`. Add `deposit(self, amount)` that adds to balance.",
    starter: pj`class Account:
    pass
`,
    tests: pj`a = Account("Ana")
assert a.owner == "Ana" and a.balance == 0, "New accounts start with balance 0"
a.deposit(50)
a.deposit(25)
assert a.balance == 75, "deposit should add to balance"`,
    hint: "def __init__(self, owner): self.owner = owner; self.balance = 0  and  def deposit(self, amount): self.balance += amount",
    solution: pj`class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount` },
  { t: "code", carry: true, add: pj`
    # Step 2: add withdraw here (indented inside the class)
`, q: "Add `withdraw(self, amount)`: if there's enough money, subtract it and return True. Otherwise return False and leave the balance alone.",
    tests: pj`a = Account("Ana")
a.deposit(100)
assert a.withdraw(30) is True, "withdraw(30) from 100 should return True"
assert a.balance == 70, "balance should be 70 after withdrawing 30"
assert a.withdraw(500) is False, "withdrawing too much should return False"
assert a.balance == 70, "A failed withdraw shouldn't change the balance"`,
    hint: "if amount > self.balance: return False   then   self.balance -= amount  and  return True",
    solution: pj`class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True` },
]},
];
