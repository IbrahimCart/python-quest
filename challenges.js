// Harder, problem-style code challenges. Each one replaces its lesson's code step.
// Tests include hidden edge cases, so hard-coding the example won't pass.
// hints: [a nudge, a stronger hint]. Hints cost XP; the solution unlocks after 3 failed checks.
const cr = String.raw;

window.CHALLENGES = {
u1l1: {
  q: "Print exactly two lines: `Python Quest`, then `Level 1`. Add a comment that explains what the program does.",
  starter: "",
  tests: cr`assert _out.strip().splitlines() == ["Python Quest", "Level 1"], "Print exactly two lines: Python Quest, then Level 1"
assert "#" in _src, "Add a comment (it starts with #)"`,
  hints: ["Each line of output needs its own print().", "Text goes inside quotes. A comment can sit on its own line and starts with #."],
  solution: cr`# Show the game title and the level
print("Python Quest")
print("Level 1")` },

u1l2: {
  q: "Swap the values: make `a` hold b's value and `b` hold a's value, then print a, then b. Don't type 5 or 9 anywhere else.",
  starter: cr`a = 5
b = 9
`,
  tests: cr`assert (a, b) == (9, 5), "a should end up as 9 and b as 5"
assert _out.split() == ["9", "5"], "Print a, then b"
g = _rerun(a=1, b=2)
assert (g["a"], g["b"]) == (2, 1), "Swap the variables instead of typing the numbers"`,
  hints: ["If you run a = b first, a's old value is lost. Where could you keep a copy?", "Save it first: temp = a, then a = b, then b = temp."],
  solution: cr`a = 5
b = 9
temp = a
a = b
b = temp
print(a)
print(b)` },

u1l3: {
  q: "This should print the price with tax (`33.0`), but the names break Python's rules. Fix it using the names `total_price` and `tax_rate`.",
  starter: cr`Total Price = 30
tax-rate = 0.1
print(total price * Tax_rate + Total Price)
`,
  tests: cr`assert total_price == 30 and tax_rate == 0.1, "Use total_price = 30 and tax_rate = 0.1"
assert _out.strip() == "33.0", "It should print 33.0"
assert _rerun(total_price=100)["_out"].strip() == "110.0", "Calculate from the variables"`,
  hints: ["Names can't have spaces or dashes, and Python treats Tax_rate and tax_rate as different names.", "Use total_price and tax_rate everywhere, including inside print()."],
  solution: cr`total_price = 30
tax_rate = 0.1
print(total_price * tax_rate + total_price)` },

u2l1: {
  q: "Create `a` (int), `b` (float), `c` (str) and `d` (bool) so that `a + b` equals `10.5` and `c == str(a)`.",
  starter: "",
  tests: cr`assert type(a) is int, "a must be an int"
assert type(b) is float, "b must be a float"
assert type(c) is str, "c must be a str"
assert type(d) is bool, "d must be a bool"
assert a + b == 10.5, f"a + b is {a + b}, but it should be 10.5"
assert c == str(a), f"c should be the text version of a, which is {str(a)!r}"`,
  hints: ["Only a float can hold the .5, so b carries the decimal part.", "Try a = 4 and b = 6.5. Then c = str(a), and d is True or False."],
  solution: cr`a = 4
b = 6.5
c = str(a)
d = True` },

u2l2: {
  q: "Set `is_number` to True only when `value` is an int or a float. Trap: in Python, True and False count as ints, but booleans must give False here.",
  starter: cr`value = True
`,
  tests: cr`for v, want in [(5, True), (2.5, True), (True, False), (False, False), ("5", False), (None, False)]:
    got = _rerun(value=v).get("is_number")
    assert got is want, f"value = {v!r} should give {want}, got {got!r}"`,
  hints: ["isinstance(True, int) is True. You need a second check to rule out bools.", "Combine checks: isinstance(value, (int, float)) and not isinstance(value, bool)"],
  solution: cr`value = True
is_number = isinstance(value, (int, float)) and not isinstance(value, bool)` },

u2l3: {
  q: "Both values are text. Print the total cost in whole dollars, rounded down (`59` for these values).",
  starter: cr`price_text = "19.99"
qty_text = "3"
`,
  tests: cr`assert _out.strip() == "59", "19.99 × 3 is 59.97, so it should print 59"
assert _rerun(price_text="2.50", qty_text="4")["_out"].strip() == "10", "Convert the text values instead of hard-coding"
assert _rerun(price_text="0.99", qty_text="1")["_out"].strip() == "0", "0.99 rounds down to 0"`,
  hints: ["int() can't read \"19.99\" directly. Which conversion can?", "float() the price, int() the quantity, multiply, then int() the result to drop the cents."],
  solution: cr`price_text = "19.99"
qty_text = "3"
print(int(float(price_text) * int(qty_text)))` },

u3l1: {
  q: "Print the average of the three scores. Watch the order of operations.",
  starter: cr`a = 88
b = 92
c = 79
`,
  tests: cr`assert abs(float(_out.strip()) - 259 / 3) < 1e-9, "The average of 88, 92 and 79 is about 86.33"
assert _rerun(a=90, b=90, c=90)["_out"].strip() == "90.0", "Three 90s should average 90.0"
assert _rerun(a=0, b=0, c=3)["_out"].strip() == "1.0", "0, 0 and 3 should average 1.0"`,
  hints: ["a + b + c / 3 only divides c by 3.", "Group the sum first: (a + b + c) / 3"],
  solution: cr`a = 88
b = 92
c = 79
print((a + b + c) / 3)` },

u3l2: {
  q: "`n` is a 3-digit number. Print the sum of its digits (472 → 13). Use `//` and `%`, not strings.",
  starter: cr`n = 472
`,
  tests: cr`assert "str" not in _src, "Solve it with // and %, not str()"
assert _out.strip() == "13", "4 + 7 + 2 = 13"
for v, want in [(905, "14"), (100, "1"), (999, "27")]:
    got = _rerun(n=v)["_out"].strip()
    assert got == want, f"n = {v} should print {want}, got {got}"`,
  hints: ["n % 10 gives the last digit. What does n // 10 give?", "Last digit: n % 10. Middle: n // 10 % 10. First: n // 100."],
  solution: cr`n = 472
print(n % 10 + n // 10 % 10 + n // 100)` },

u3l3: {
  q: "Print how far apart `a` and `b` are on the number line, rounded to 2 decimals (`5.64` here). It must work whichever one is bigger.",
  starter: cr`a = 3.14159
b = -2.5
`,
  tests: cr`assert _out.strip() == "5.64", "The distance is 5.64"
assert _rerun(a=1, b=4)["_out"].strip() == "3", "a = 1, b = 4 should print 3"
assert _rerun(a=4, b=1)["_out"].strip() == "3", "a = 4, b = 1 should print 3"`,
  hints: ["a - b can be negative. Which function always gives a positive distance?", "round(abs(a - b), 2)"],
  solution: cr`a = 3.14159
b = -2.5
print(round(abs(a - b), 2))` },

u3l4: {
  q: "The balance grows 4% each year. Use `*=` to apply 3 years of growth, then print the balance rounded to 2 decimals.",
  starter: cr`balance = 1000
`,
  tests: cr`assert "*=" in _src, "Use *="
assert _out.strip() == "1124.86", "1000 after 3 years at 4% is 1124.86"
assert _rerun(balance=400)["_out"].strip() == "449.95", "Grow from balance instead of hard-coding"`,
  hints: ["Growing by 4% means multiplying by 1.04.", "balance *= 1.04 three times, then print(round(balance, 2))."],
  solution: cr`balance = 1000
balance *= 1.04
balance *= 1.04
balance *= 1.04
print(round(balance, 2))` },

u4l1: {
  q: "Print the middle character of `word`. Assume it has an odd number of letters. It must work for any length.",
  starter: cr`word = "jupyter"
`,
  tests: cr`assert _out.strip() == "y", "The middle of jupyter is y"
for w, want in [("abc", "b"), ("x", "x"), ("kayak", "y")]:
    got = _rerun(word=w)["_out"].strip()
    assert got == want, f"{w!r} should print {want!r}, got {got!r}"`,
  hints: ["len(word) gives the length. Which index sits in the middle?", "word[len(word) // 2]"],
  solution: cr`word = "jupyter"
print(word[len(word) // 2])` },

u4l2: {
  q: "Use slicing to create `year`, `month` and `day` (as text) from `date`, then print them on separate lines.",
  starter: cr`date = "2026-11-23"
`,
  tests: cr`assert (year, month, day) == ("2026", "11", "23"), "year, month and day should be 2026, 11 and 23"
assert _out.split() == ["2026", "11", "23"], "Print year, month and day"
g = _rerun(date="1999-01-05")
assert (g["year"], g["month"], g["day"]) == ("1999", "01", "05"), "Slice from date instead of hard-coding"`,
  hints: ["Count positions: indexes 0 to 3 are the year, and index 4 is a dash.", "date[:4], date[5:7] and date[8:]"],
  solution: cr`date = "2026-11-23"
year = date[:4]
month = date[5:7]
day = date[8:]
print(year)
print(month)
print(day)` },

u4l3: {
  q: "Print `phone` formatted like `(206) 555-1234` using slicing and an f-string.",
  starter: cr`phone = "2065551234"
`,
  tests: cr`assert 'f"' in _src or "f'" in _src, "Use an f-string"
assert _out.strip() == "(206) 555-1234", "Print (206) 555-1234"
assert _rerun(phone="4255550000")["_out"].strip() == "(425) 555-0000", "Slice phone instead of typing the digits"`,
  hints: ["The area code is the first 3 characters, then 3 more, then the last 4.", "f\"({phone[:3]}) {phone[3:6]}-{phone[6:]}\""],
  solution: cr`phone = "2065551234"
print(f"({phone[:3]}) {phone[3:6]}-{phone[6:]}")` },

u4l4: {
  q: "Clean up `sentence`: capitalize each word and use exactly one space between words. Store it in `clean` and print it (`Hello Big World`).",
  starter: cr`sentence = "  hello   big  WORLD "
`,
  tests: cr`assert clean == "Hello Big World", f"clean is {clean!r}"
assert _rerun(sentence="  the   QUICK fox")["clean"] == "The Quick Fox", "It should work for any messy sentence"`,
  hints: ["split() with no argument splits on any amount of whitespace and drops the empty bits.", "\" \".join(sentence.split()).title()"],
  solution: cr`sentence = "  hello   big  WORLD "
clean = " ".join(sentence.split()).title()
print(clean)` },

u5l1: {
  q: "Set `same_length` to whether `a` and `b` have the same number of characters, and `a_first` to whether `a` comes before `b` alphabetically. Strings can be compared with `<`.",
  starter: cr`a = "apple"
b = "mango"
`,
  tests: cr`assert same_length is True and a_first is True, "apple and mango are the same length, and apple comes first"
g = _rerun(a="pear", b="fig")
assert g["same_length"] is False and g["a_first"] is False, "For pear and fig, the lengths differ and fig comes first"`,
  hints: ["len() gives each length, and == compares them.", "same_length = len(a) == len(b) and a_first = a < b"],
  solution: cr`a = "apple"
b = "mango"
same_length = len(a) == len(b)
a_first = a < b` },

u5l2: {
  q: "Set `cost` for a package weighing `kg`. Up to 1 kg costs 5. Up to 5 kg costs 5 plus 2 for each kg over 1. Over 5 kg costs 13 plus 1 for each kg over 5.",
  starter: cr`kg = 3
`,
  tests: cr`for w, want in [(0.5, 5), (1, 5), (3, 9), (5, 13), (8, 16)]:
    got = _rerun(kg=w).get("cost")
    assert got == want, f"{w} kg should cost {want}, got {got!r}"`,
  hints: ["Check the smallest case first: if kg <= 1.", "elif kg <= 5: cost = 5 + (kg - 1) * 2, else: cost = 13 + (kg - 5)"],
  solution: cr`kg = 3
if kg <= 1:
    cost = 5
elif kg <= 5:
    cost = 5 + (kg - 1) * 2
else:
    cost = 13 + (kg - 5)` },

u5l3: {
  q: "Set `is_leap` to True or False. A year is a leap year if it's divisible by 4, except century years (divisible by 100), which must also be divisible by 400.",
  starter: cr`year = 2024
`,
  tests: cr`for y, want in [(2024, True), (2023, False), (1900, False), (2000, True), (2100, False)]:
    got = _rerun(year=y).get("is_leap")
    assert got is want, f"{y} should give {want}, got {got!r}"`,
  hints: ["2000 is a leap year but 1900 isn't. What's different about them?", "year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)"],
  solution: cr`year = 2024
is_leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)` },

u6l1: {
  q: "Write `box(word)` that prints the word inside a border of `*`. For example, `box(\"hi\")` prints `****`, then `*hi*`, then `****`.",
  starter: "",
  tests: cr`assert _capture(box, "hi").splitlines() == ["****", "*hi*", "****"], "box('hi') should print ****, *hi*, ****"
assert _capture(box, "Python").splitlines() == ["********", "*Python*", "********"], "The border has to match the word's length"`,
  hints: ["The border is the word's length plus 2. You can repeat a string with *.", "print(\"*\" * (len(word) + 2)), then print(\"*\" + word + \"*\"), then the border again."],
  solution: cr`def box(word):
    border = "*" * (len(word) + 2)
    print(border)
    print("*" + word + "*")
    print(border)` },

u6l2: {
  q: "Write `bmi(weight, height)` that returns weight ÷ height² rounded to 1 decimal. Then write `category(weight, height)` that returns `\"under\"` below 18.5, `\"normal\"` below 25, and `\"over\"` otherwise.",
  starter: "",
  tests: cr`assert bmi(70, 1.75) == 22.9, "bmi(70, 1.75) should return 22.9"
assert bmi(50, 2) == 12.5, "bmi(50, 2) should return 12.5"
for w, want in [(50, "under"), (70, "normal"), (90, "over")]:
    got = category(w, 1.75)
    assert got == want, f"category({w}, 1.75) should be {want!r}, got {got!r}"`,
  hints: ["height squared is height ** 2. Make bmi return the value, not print it.", "In category, call b = bmi(weight, height) first, then use if / elif / else."],
  solution: cr`def bmi(weight, height):
    return round(weight / height ** 2, 1)

def category(weight, height):
    b = bmi(weight, height)
    if b < 18.5:
        return "under"
    elif b < 25:
        return "normal"
    return "over"` },

u6l3: {
  q: "Write `greet(name, greeting=\"Hello\", punct=\"!\")` that returns text like `Hello, Sam!`. It must also handle `greet(\"Li\", \"Hi\", \"?\")` and `greet(\"Ana\", punct=\".\")`.",
  starter: "",
  tests: cr`assert greet("Sam") == "Hello, Sam!", 'greet("Sam") should return "Hello, Sam!"'
assert greet("Li", "Hi", "?") == "Hi, Li?", 'greet("Li", "Hi", "?") should return "Hi, Li?"'
assert greet("Ana", punct=".") == "Hello, Ana.", 'greet("Ana", punct=".") should return "Hello, Ana."'`,
  hints: ["The defaults go in the def line: def greet(name, greeting=\"Hello\", punct=\"!\"):", "return f\"{greeting}, {name}{punct}\". Calling with punct=\".\" uses a keyword argument, which skips greeting."],
  solution: cr`def greet(name, greeting="Hello", punct="!"):
    return f"{greeting}, {name}{punct}"` },

u7l1: {
  q: "Print the sum of every number below `limit` that is a multiple of 3 or 5. For 10, that's 3 + 5 + 6 + 9 = 23.",
  starter: cr`limit = 10
`,
  tests: cr`assert _out.strip() == "23", "For 10 the sum is 23"
for v, want in [(1, "0"), (16, "60"), (1000, "233168")]:
    got = _rerun(limit=v)["_out"].strip()
    assert got == want, f"limit = {v} should print {want}, got {got}"`,
  hints: ["Loop over range(limit) and keep a running total.", "Add n to the total when n % 3 == 0 or n % 5 == 0."],
  solution: cr`limit = 10
total = 0
for n in range(limit):
    if n % 3 == 0 or n % 5 == 0:
        total += n
print(total)` },

u7l2: {
  q: "Collatz: if n is even, halve it. If it's odd, make it 3n + 1. Repeat until n is 1, then print how many steps it took (6 takes 8 steps).",
  starter: cr`n = 6
`,
  tests: cr`assert _out.strip() == "8", "6 takes 8 steps"
for v, want in [(1, "0"), (2, "1"), (27, "111")]:
    got = _rerun(n=v)["_out"].strip()
    assert got == want, f"n = {v} should print {want}, got {got}"`,
  hints: ["Use while n != 1: and count each step.", "Inside the loop: if n % 2 == 0: n //= 2, else: n = 3 * n + 1. Then steps += 1."],
  solution: cr`n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1
    steps += 1
print(steps)` },

u7l3: {
  q: "Print the length of the longest run of the same character in a row in `s` (4 here). An empty string should print 0.",
  starter: cr`s = "aaabbaaaa"
`,
  tests: cr`assert _out.strip() == "4", "The longest run in aaabbaaaa is 4"
for v, want in [("abc", "1"), ("", "0"), ("zz", "2"), ("abbbcc", "3")]:
    got = _rerun(s=v)["_out"].strip()
    assert got == want, f"s = {v!r} should print {want}, got {got}"`,
  hints: ["Track two numbers: the current run length and the best so far.", "Loop over the indexes. If s[i] == s[i - 1], add 1 to current; otherwise reset it to 1. Update best each time."],
  solution: cr`s = "aaabbaaaa"
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

u8l1: {
  q: "Build a new list `running` where each item is the total of `nums` so far (`[1, 2, 3, 4]` → `[1, 3, 6, 10]`), then print it.",
  starter: cr`nums = [1, 2, 3, 4]
`,
  tests: cr`assert running == [1, 3, 6, 10], f"running is {running!r}"
for v, want in [([5], [5]), ([], []), ([2, -2, 2], [2, 0, 2])]:
    got = _rerun(nums=v)["running"]
    assert got == want, f"nums = {v} should give {want}, got {got}"`,
  hints: ["Keep a running total, and append it to running after each number.", "Start with running = [] and total = 0. Then for n in nums: total += n and running.append(total)."],
  solution: cr`nums = [1, 2, 3, 4]
running = []
total = 0
for n in nums:
    total += n
    running.append(total)
print(running)` },

u8l2: {
  q: "Print the second-highest **different** score: 85 here, because 90 appears twice. Assume there are at least two different scores.",
  starter: cr`scores = [90, 85, 90, 70]
`,
  tests: cr`assert _out.strip() == "85", "The second-highest different score is 85"
for v, want in [([1, 2], "1"), ([5, 5, 4, 4, 3], "4"), ([3, 9, 9, 9], "3")]:
    got = _rerun(scores=v)["_out"].strip()
    assert got == want, f"scores = {v} should print {want}, got {got}"`,
  hints: ["Duplicates of the top score are what make this tricky. Find the top score first.", "top = max(scores). Then loop and keep the biggest score that is less than top."],
  solution: cr`scores = [90, 85, 90, 70]
top = max(scores)
second = None
for s in scores:
    if s < top and (second is None or s > second):
        second = s
print(second)` },

u8l3: {
  q: "Points are `(x, y)` tuples. Write `closest(points)` that returns the point nearest to `(0, 0)`, comparing `x*x + y*y`. Return None for an empty list.",
  starter: "",
  tests: cr`assert closest([(3, 4), (1, 1), (-2, 0)]) == (1, 1), "(1, 1) is closest"
assert closest([(0, -3), (2, 2)]) == (2, 2), "(2, 2) is closer than (0, -3)"
assert closest([(5, 5)]) == (5, 5), "With one point, return it"
assert closest([]) is None, "An empty list should return None"`,
  hints: ["Unpack in the loop: for x, y in points:", "Keep best and best_dist. Start best as None, and replace it whenever x*x + y*y is smaller."],
  solution: cr`def closest(points):
    best = None
    best_dist = None
    for x, y in points:
        d = x * x + y * y
        if best is None or d < best_dist:
            best = (x, y)
            best_dist = d
    return best` },

u8l4: {
  q: "Write `flat_evens(grid)` that returns every even number from a list of lists, in order, using a single list comprehension. `[[1, 2], [3, 4, 6]]` → `[2, 4, 6]`.",
  starter: "",
  tests: cr`assert flat_evens([[1, 2], [3, 4, 6]]) == [2, 4, 6], "flat_evens([[1, 2], [3, 4, 6]]) should be [2, 4, 6]"
assert flat_evens([[], [1, 3]]) == [], "No evens should give []"
assert flat_evens([[8], [0, -2]]) == [8, 0, -2], "0 and negative evens count too"
assert _src.count("for") >= 2 and "[" in _src, "Use one comprehension with two for clauses"`,
  hints: ["A comprehension can have two for clauses, written in the same order as nested loops.", "[n for row in grid for n in row if n % 2 == 0]"],
  solution: cr`def flat_evens(grid):
    return [n for row in grid for n in row if n % 2 == 0]` },

u9l1: {
  q: "Write `invert(d)` that returns a new dict with the keys and values swapped. `{\"a\": 1, \"b\": 2}` → `{1: \"a\", 2: \"b\"}`.",
  starter: "",
  tests: cr`assert invert({"a": 1, "b": 2}) == {1: "a", 2: "b"}, "invert should swap keys and values"
assert invert({}) == {}, "An empty dict gives {}"
d = {"x": 9}
invert(d)
assert d == {"x": 9}, "Don't change the original dict"`,
  hints: ["Start an empty dict and fill it while looping over d.", "for k in d: new[d[k]] = k"],
  solution: cr`def invert(d):
    new = {}
    for k in d:
        new[d[k]] = k
    return new` },

u9l2: {
  q: "Write `is_anagram(a, b)`: True if both use exactly the same letters the same number of times, ignoring case and spaces. `\"Dormitory\"` and `\"dirty room\"` → True.",
  starter: "",
  tests: cr`assert is_anagram("Dormitory", "dirty room") is True, "Dormitory / dirty room is an anagram"
assert is_anagram("listen", "silent") is True, "listen / silent is an anagram"
assert is_anagram("abc", "abd") is False, "abc / abd is not"
assert is_anagram("aab", "abb") is False, "The letter counts have to match"
assert is_anagram("", "") is True, "Two empty strings count as anagrams"`,
  hints: ["Count the letters of each string into a dict (lowercase first, skip spaces), then compare the dicts with ==.", "Write a helper count(s) that loops over s.lower().replace(\" \", \"\") using c[ch] = c.get(ch, 0) + 1."],
  solution: cr`def count(s):
    c = {}
    for ch in s.lower().replace(" ", ""):
        c[ch] = c.get(ch, 0) + 1
    return c

def is_anagram(a, b):
    return count(a) == count(b)` },

u9l3: {
  q: "Write `common(a, b)` that returns a sorted list of names in **both** lists, and `only_one(a, b)` that returns a sorted list of names in **exactly one** of them.",
  starter: "",
  tests: cr`a = ["ana", "li", "sam"]
b = ["li", "zoe", "sam", "li"]
assert common(a, b) == ["li", "sam"], f"common gave {common(a, b)!r}"
assert only_one(a, b) == ["ana", "zoe"], f"only_one gave {only_one(a, b)!r}"
assert common([], ["x"]) == [] and only_one([], ["x"]) == ["x"], "Handle empty lists"`,
  hints: ["Turn each list into a set first.", "& gives the names in both. For exactly one, use ^ (or (A | B) - (A & B)). Wrap the result in sorted()."],
  solution: cr`def common(a, b):
    return sorted(set(a) & set(b))

def only_one(a, b):
    return sorted(set(a) ^ set(b))` },

u10l1: {
  q: "Write `parse_ages(items)` that turns a list of strings into a list of ints, skipping anything that isn't a whole number. `[\"20\", \"x\", \"35\", \"4.5\"]` → `[20, 35]`.",
  starter: "",
  tests: cr`assert "try" in _src and "except" in _src, "Use try / except"
assert parse_ages(["20", "x", "35", "4.5"]) == [20, 35], "parse_ages gave the wrong list"
assert parse_ages(["", "abc"]) == [], "Nothing valid should give []"
assert parse_ages(["-3", "7"]) == [-3, 7], "Negative whole numbers are fine"`,
  hints: ["int() raises ValueError for text like \"x\" or \"4.5\".", "Loop. Inside: try: ages.append(int(item)) except ValueError: continue"],
  solution: cr`def parse_ages(items):
    ages = []
    for item in items:
        try:
            ages.append(int(item))
        except ValueError:
            continue
    return ages` },

u10l2: {
  q: "Make a class `Rectangle(width, height)` with the methods `area()`, `perimeter()` and `is_square()`.",
  starter: "",
  tests: cr`r = Rectangle(3, 4)
assert r.area() == 12, "Rectangle(3, 4).area() should be 12"
assert r.perimeter() == 14, "Rectangle(3, 4).perimeter() should be 14"
assert r.is_square() is False, "A 3 by 4 rectangle isn't a square"
assert Rectangle(5, 5).is_square() is True, "A 5 by 5 rectangle is a square"`,
  hints: ["__init__ should store width and height on self.", "area: self.width * self.height. perimeter: 2 * (width + height). is_square: width == height."],
  solution: cr`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height` },

u10l3: {
  q: "Build a `Stack` class (last in, first out) with `push(x)`, `pop()` (returns the top item, or None if empty), `peek()` (the top item without removing it, or None), `size()` and `is_empty()`.",
  starter: "",
  tests: cr`s = Stack()
assert s.is_empty() is True and s.size() == 0, "A new stack is empty"
assert s.pop() is None and s.peek() is None, "pop() and peek() return None when empty"
for x in [1, 2, 3]:
    s.push(x)
assert s.peek() == 3 and s.size() == 3, "After pushing 1, 2, 3 the top is 3"
assert s.pop() == 3 and s.pop() == 2, "pop() returns the most recent item first"
assert s.size() == 1 and s.is_empty() is False, "One item should be left"`,
  hints: ["Store the items in a list on self. The end of the list is the top.", "push: append. pop: return None if not self.items, else self.items.pop(). peek: self.items[-1]."],
  solution: cr`class Stack:
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
};

// Project steps rewritten as specs (what to build, not how). Applied to each project's code steps in order.
window.PROJECT_SPECS = {
  p1: [
    { q: "Store your `name` and `school` in variables (any text) and print each on its own line.", hints: ["Two variables, two print() calls."] },
    { q: "Add a `year` (a whole number) and print it. Then finish the card with a line of exactly 20 dashes.", hints: ["A string can be repeated with *.", "print(\"-\" * 20)"] },
  ],
  p2: [
    { q: "`raw` is text. Create `f` (raw as a float) and `n` (that float as an int), then print f and then n.", hints: ["You need two conversions: text to float, then float to int."] },
    { q: "Print the type of `f`, then print whether `n` is an int.", hints: ["type() and isinstance()"] },
  ],
  p3: [
    { q: "Work out the `tip` on the bill at `tip_percent` percent, and print it rounded to 2 decimals.", hints: ["18 percent of x is x * 18 / 100.", "round(tip, 2)"] },
    { q: "Work out the `total` and each person's `share` when it's split between `people`. Print the share rounded to 2 decimals.", hints: ["The total is the bill plus the tip.", "share = total / people"] },
  ],
  p4: [
    { q: "Make `username`: the first initial plus the last name, all lowercase (`alovelace`). Print it.", hints: ["first[0] is the initial.", "Lowercase both parts with .lower()."] },
    { q: "Add the last two digits of `year` to `username`, then print `Your username: alovelace26` using an f-string.", hints: ["year is a number, so convert it before slicing.", "str(year)[-2:]"] },
  ],
  p5: [
    { q: "Set `price`: under 5 is free, under 13 pays 8, and everyone else pays 15. Print it like `Price: 15`.", hints: ["Check the youngest group first.", "if / elif / else, then an f-string."] },
    { q: "Students aged 13 or older get 3 off. Apply the discount and print the price again.", hints: ["Both things must be true, so use and.", "if is_student and age >= 13: price -= 3"] },
  ],
  p6: [
    { q: "Write `c_to_f(c)` that returns the temperature in Fahrenheit (F = C × 9/5 + 32).", hints: ["Return the value instead of printing it."] },
    { q: "Add `f_to_c(f)` that converts back to Celsius, rounded to 1 decimal.", hints: ["Undo the steps in reverse: subtract 32 first, then multiply by 5/9."] },
    { q: "Add `describe(temp, unit=\"C\")` that returns `\"30C is 86.0F\"` for `describe(30)` and `\"86F is 30.0C\"` for `describe(86, \"F\")`. Reuse your other functions.", hints: ["Use if unit == \"C\" to choose which function to call.", "f\"{temp}C is {c_to_f(temp)}F\""] },
  ],
  p7: [
    { q: "Print the numbers 1 to 15, one per line.", hints: ["range(1, 16)"] },
    { q: "Now FizzBuzz it: multiples of 3 print `Fizz`, multiples of 5 print `Buzz`, multiples of both print `FizzBuzz`, and everything else prints the number.", hints: ["Order matters. Which check has to come first?", "Check n % 15 == 0 before the 3 and 5 checks."] },
  ],
  p8: [
    { q: "Add three tasks to `todos`, then print them numbered from 1, like `1. Study`.", hints: ["enumerate(todos, 1) starts counting at 1."] },
    { q: "The first task is done. Remove it, print `Done: <task>`, then print how many are left, like `2 left`.", hints: ["pop(0) removes and returns the first item."] },
  ],
  p9: [
    { q: "Write `word_counts(text)` that returns a dict counting each word, ignoring upper/lower case.", hints: ["lower(), then split().", "The counting pattern: counts[w] = counts.get(w, 0) + 1"] },
    { q: "Add `top_word(text)` that returns the most common word.", hints: ["Reuse word_counts().", "Loop over the counts and keep the best word so far."] },
  ],
  p10: [
    { q: "Create class `Account(owner)`. New accounts start with a balance of 0. Add `deposit(amount)`.", hints: ["Set self.owner and self.balance in __init__."] },
    { q: "Add `withdraw(amount)`: take the money out and return True. If there isn't enough, return False and change nothing.", hints: ["Check amount > self.balance first."] },
  ],
  final: [
    { q: "Step 1: Make class `Student(name)` with a `scores` list. `add_score(score)` accepts numbers or numeric text, stores them as ints and returns True. For text that isn't a number, or a score outside 0–100, it returns False and stores nothing.", hints: ["int() raises ValueError for bad text. Catch it.", "After converting, check the range before you append."] },
    { q: "Step 2: Add `average()`: the mean score rounded to 1 decimal, or 0 when there are no scores.", hints: ["Guard against the empty case before dividing.", "sum() and len()"] },
    { q: "Step 3: Add `letter()`: A for 90+, B for 80+, C for 70+, D for 60+, otherwise F, based on the average.", hints: ["Reuse self.average().", "Check from the highest grade down."] },
    { q: "Step 4: Make class `Gradebook` that keeps Students in a dict by name. `add_student(name)` returns that student, creating them only if they're new. `record(name, score)` records a score (adding the student if needed) and returns whether it worked.", hints: ["self.students = {} in __init__.", "record() can call add_student(), then add_score() on the result."] },
    { q: "Step 5: Add `report()`: a list of lines like `Ana: 92.5 (A)`, sorted by name. Add `top_student()`: the name with the best average, or None if there are no students.", hints: ["sorted(self.students) gives the names in order.", "For top_student(), keep the best name while looping."] },
    { q: "Step 6: Use your classes on `data`. Record every entry and count the ones that fail. Then print each report line, `Top student: <name>`, and `Skipped: <count>`.", hints: ["record() returns False for bad entries.", "Unpack in the loop: for name, score in data:"] },
  ],
};
