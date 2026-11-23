// Tap-to-code practice, merged into each lesson by app.js:
//   fill  goes right after the lesson's first learn card
//   order goes right before the lesson's code challenge
// fill:  code uses ___ for each blank; answers[i] is the right chip (or a list of accepted chips)
// order: lines are in the correct order; the app shuffles them
const pr = String.raw;

window.PRACTICE = {
  u1l1: {
    fill: { q: "Make this print the text Hi!", code: pr`print(___)`, answers: [pr`"Hi!"`], chips: [pr`"Hi!"`, "Hi!", "#Hi!"] },
  },
  u1l2: {
    fill: { q: "Store 10 in `score` so the last line works.", code: pr`___ = 10
print(score)`, answers: ["score"], chips: ["score", "10", "print", "=="] },
    order: { q: "Put the lines in order so it prints 6.", lines: [pr`points = 5`, pr`points = points + 1`, pr`print(points)`] },
  },
  u1l3: {
    fill: { q: "Pick the valid, well-styled name that makes this run.", code: pr`___ = "Ana"
print(first_name)`, answers: ["first_name"], chips: ["first_name", "first name", "1st_name", "FirstName"] },
  },
  u2l1: {
    fill: { q: "Show the type of 3.5. It should print `<class 'float'>`.", code: pr`print(___(3.5))`, answers: ["type"], chips: ["type", "print", "float", "str"] },
  },
  u2l2: {
    fill: { q: "Make this print True.", code: pr`print(isinstance(42, ___))`, answers: ["int"], chips: ["int", "str", "float", "42"] },
  },
  u2l3: {
    fill: { q: "Make this print 21.", code: pr`age = "20"
print(___(age) + 1)`, answers: ["int"], chips: ["int", "str", "float", "type"] },
    order: { q: "Put the lines in order so it prints 14.", lines: [pr`text = "7"`, pr`number = int(text)`, pr`print(number * 2)`] },
  },
  u3l1: {
    fill: { q: "Make this print 2.5.", code: pr`print(10 ___ 4)`, answers: ["/"], chips: ["/", "//", "%", "*"] },
  },
  u3l2: {
    fill: { q: "Check whether n is even. It should print True.", code: pr`n = 14
print(n ___ 2 == 0)`, answers: ["%"], chips: ["%", "//", "/", "**"] },
    order: { q: "Put the lines in order so it prints 2.", lines: [pr`seconds = 125`, pr`minutes = seconds // 60`, pr`print(minutes)`] },
  },
  u3l3: {
    fill: { q: "Make this print 7.", code: pr`print(___(-7))`, answers: ["abs"], chips: ["abs", "round", "int", "pow"] },
  },
  u3l4: {
    fill: { q: "Take away one life. It should print 2.", code: pr`lives = 3
lives ___ 1
print(lives)`, answers: ["-="], chips: ["-=", "+=", "==", "="] },
    order: { q: "Put the lines in order so it prints `Hi there`.", lines: [pr`msg = "Hi"`, pr`msg += " there"`, pr`print(msg)`] },
  },
  u4l1: {
    fill: { q: "Print the last letter, n.", code: pr`word = "Python"
print(word[___])`, answers: [["-1", "5"]], chips: ["-1", "0", "6", "1"] },
  },
  u4l2: {
    fill: { q: "Print just `hel`.", code: pr`print("hello"[___])`, answers: [[":3", "0:3"]], chips: [":3", "3:", "1:3", "::3"] },
  },
  u4l3: {
    fill: { q: "Turn this into an f-string so it prints `Hi Li`.", code: pr`name = "Li"
print(___"Hi {name}")`, answers: ["f"], chips: ["f", "r", "s", "str"] },
    order: { q: "Put the lines in order so it prints `hahaha`.", lines: [pr`word = "ha"`, pr`laugh = word * 3`, pr`print(laugh)`] },
  },
  u4l4: {
    fill: { q: "Break the text into a list: `['a', 'b', 'c']`.", code: pr`print("a-b-c".___("-"))`, answers: ["split"], chips: ["split", "join", "strip", "replace"] },
    order: { q: "Put the lines in order so it prints `HI`.", lines: [pr`raw = "  hi  "`, pr`clean = raw.strip()`, pr`print(clean.upper())`] },
  },
  u5l1: {
    fill: { q: "Make this print True.", code: pr`x = 7
print(x ___ 7)`, answers: ["=="], chips: ["==", "=", "!=", ">"] },
  },
  u5l2: {
    fill: { q: "Complete the if / else so it prints Kid.", code: pr`age = 12
if age >= 13___
    print("Teen")
___:
    print("Kid")`, answers: [":", "else"], chips: [":", "else", "elif", ";"] },
    order: { q: "Put the lines in order so it prints Hot.", lines: [pr`temp = 30`, pr`if temp > 25:`, pr`    print("Hot")`, pr`else:`, pr`    print("Not hot")`] },
  },
  u5l3: {
    fill: { q: "Check if the email has an @. It should print True.", code: pr`print("@" ___ "a@b.com")`, answers: ["in"], chips: ["in", "not in", "==", "and"] },
  },
  u6l1: {
    fill: { q: "Define the function, then call it.", code: pr`___ greet():
    print("Hi!")

greet___`, answers: ["def", "()"], chips: ["def", "()", "function", "return"] },
    order: { q: "Put the lines in order so it prints `Go Blue`.", lines: [pr`def cheer(team):`, pr`    print("Go", team)`, pr`cheer("Blue")`] },
  },
  u6l2: {
    fill: { q: "Send the result back so this prints 10.", code: pr`def double(n):
    ___ n * 2

print(double(5))`, answers: ["return"], chips: ["return", "print", "def", "yield"] },
  },
  u6l3: {
    fill: { q: "Give `name` a default so this prints `Hi friend`.", code: pr`def hello(name=___):
    print("Hi", name)

hello()`, answers: [pr`"friend"`], chips: [pr`"friend"`, "friend", "None", "name"] },
  },
  u7l1: {
    fill: { q: "Loop three times, printing 0, 1, 2.", code: pr`for i in ___(3):
    print(i)`, answers: ["range"], chips: ["range", "len", "list", "int"] },
    order: { q: "Put the lines in order so it prints 6.", lines: [pr`total = 0`, pr`for n in range(4):`, pr`    total += n`, pr`print(total)`] },
  },
  u7l2: {
    fill: { q: "Make the loop count up so it prints 0, 1, 2 and stops.", code: pr`n = 0
while n < 3:
    print(n)
    n ___ 1`, answers: ["+="], chips: ["+=", "-=", "=", "=="] },
    order: { q: "Put the lines in order so it counts down 3, 2, 1.", lines: [pr`n = 3`, pr`while n > 0:`, pr`    print(n)`, pr`    n -= 1`] },
  },
  u7l3: {
    fill: { q: "Count the a's in banana. It should print 3.", code: pr`count = 0
for ch in "banana":
    if ch == "a":
        count ___ 1
print(count)`, answers: ["+="], chips: ["+=", "=", "==", "-="] },
  },
  u8l1: {
    fill: { q: "Add 3 to the end of the list.", code: pr`nums = [1, 2]
nums.___(3)
print(nums)`, answers: ["append"], chips: ["append", "add", "push", "insert"] },
    order: { q: "Put the lines in order so it prints 2.", lines: [pr`pets = ["cat"]`, pr`pets.append("dog")`, pr`print(len(pets))`] },
  },
  u8l2: {
    fill: { q: "Print a new sorted list: `[1, 2, 3]`.", code: pr`print(___([3, 1, 2]))`, answers: ["sorted"], chips: ["sorted", "sort", "max", "list"] },
  },
  u8l3: {
    fill: { q: "Unpack the tuple so this prints 9.", code: pr`point = (4, 9)
x, ___ = point
print(y)`, answers: ["y"], chips: ["y", "9", "point", "[y]"] },
  },
  u8l4: {
    fill: { q: "Finish the list comprehension: `[0, 1, 4, 9]`.", code: pr`print([n * n for n ___ range(4)])`, answers: ["in"], chips: ["in", "of", "from", "to"] },
    order: { q: "Put the lines in order so it prints `[2, 4]`.", lines: [pr`nums = [1, 2, 3, 4]`, pr`evens = [n for n in nums if n % 2 == 0]`, pr`print(evens)`] },
  },
  u9l1: {
    fill: { q: "Look up ana's age. It should print 20.", code: pr`ages = {"ana": 20}
print(ages___)`, answers: [pr`["ana"]`], chips: [pr`["ana"]`, ".ana", "(ana)", "[0]"] },
    order: { q: "Put the lines in order so it prints 90.", lines: [pr`scores = {}`, pr`scores["ana"] = 90`, pr`print(scores["ana"])`] },
  },
  u9l2: {
    fill: { q: "Loop over keys and values together.", code: pr`d = {"a": 1, "b": 2}
for k, v in d.___():
    print(k, v)`, answers: ["items"], chips: ["items", "keys", "values", "get"] },
  },
  u9l3: {
    fill: { q: "Count the unique values. It should print 2.", code: pr`print(len(___([1, 1, 2])))`, answers: ["set"], chips: ["set", "list", "dict", "len"] },
  },
  u10l1: {
    fill: { q: "Catch the error so it prints `Not a number`.", code: pr`try:
    print(int("hi"))
___ ValueError:
    print("Not a number")`, answers: ["except"], chips: ["except", "catch", "else", "finally"] },
    order: { q: "Put the lines in order to handle dividing by zero.", lines: [pr`try:`, pr`    x = 1 / 0`, pr`except ZeroDivisionError:`, pr`    print("Can't divide by 0")`] },
  },
  u10l2: {
    fill: { q: "Name the setup method so this prints Tom.", code: pr`class Cat:
    def ___(self, name):
        self.name = name

c = Cat("Tom")
print(c.name)`, answers: ["__init__"], chips: ["__init__", "init", "__new__", "Cat"] },
  },
  u10l3: {
    fill: { q: "Methods take the object as their first parameter.", code: pr`class Light:
    def __init__(self):
        self.on = False

    def toggle(___):
        self.on = not self.on

light = Light()
light.toggle()
print(light.on)`, answers: ["self"], chips: ["self", "this", "on", "Light"] },
    order: { q: "Put the lines in order so it prints 1.", lines: [pr`class Counter:`, pr`    def __init__(self):`, pr`        self.n = 1`, pr`c = Counter()`, pr`print(c.n)`] },
  },
};
