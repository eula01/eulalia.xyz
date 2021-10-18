---
title: 'Inspecting Python Bytecode'
date: '2021-10-11'
tags: ['python']
description: 'Inspecting Python bytecode'
ogimage: './og-image.png'
---

The more Python I write, the more I appreciate it! Python’s simplicity makes it feel closer to an extension of thought than any other language I’m familiar with. Guido van Rossum captures this sentiment perfectly:

> Syntactically, Python code looks like executable pseudocode

High-level features like list comprehensions, slices, and negative indexes almost embed a minigame directly into the source files, the objective being to reduce line counts and constantly look for greater levels of elegance, without rendering your code unreadable.

Python lets you think creatively, as compared with a language like Go, where there’s often a single way to do something; handling errors and reading files are strongly idiomatic. I’ve noticed that when I write Go, I’ll be focused on whether what I’m doing is correct and performant, whereas in Python it’s whether what I’m doing is succinct and beautiful.

If you ever find yourself being tempted by a talking python to eat from the Tree of Brevity, then tread carefully, for the road ahead is time-consuming and full of potholes! I fell into one recently whilst trying to squeeze multiple array lookups on the same line, desperate to regain one extra line count. Don’t do this! If just one of those lookups is out of range, then you won’t know which array threw the exception. Also, in hindsight, optimizing for line count is probably not the correct heuristic– I mean paintbrush– remember, you’re an artist, not a programmer now!

```py
>>> foo = [9, 3, 7]
 >>> bar = [2, 1, 9]
>>> print(foo[5], bar[2])

Traceback (most recent call last):
File "<stdin>", line 1, in <module>
IndexError: list index out of range
```

Here, we receive an IndexError after an invalid lookup on foo, but the traceback only gives us the line and not the column! For such a trivial example this doesn’t seem too bad, but now imagine that you’re dealing with complex and uncertain datasets, and for each line you delete you get a small hit of dopamine.
Btw, people coming from JavaScript may find this behavior strange, because referencing a non-existent property on a JavaScript object won’t raise an index error, but will instead evaluate to ‘undefined’. And yes, we’re still talking about arrays here:

```js
>>> typeof []
>>> 'object'
```

Anyways, the reason for the lack of detail in our traceback is because IndexErrors are actually exceptions, not syntax errors. The difference being that exceptions are thrown at runtime, which don’t have access to the column count, whilst syntax errors are thrown during parsing, which do:

```py
>>> while True print('Hello world')
  File "<stdin>", line 1
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

When Python is compiled into bytecode and executed, we drop a bunch of meta-resolution about the source code in the interest of performance, leaving the PythonVM with only what it needs.

Let’s use the dis module to inspect the bytecode and truly understand this:

```py
>>> import dis
>>>
>>> test ='''
... foo = [9, 3, 7]
... bar = [2, 1, 9]
... print(foo[5], bar[2])
... '''
>>> print(dis.dis(compile(test, "", "exec")))

  2           0 LOAD_CONST               0 (9)
              2 LOAD_CONST               1 (3)
              4 LOAD_CONST               2 (7)
              6 BUILD_LIST               3
              8 STORE_NAME               0 (foo)

  3          10 LOAD_CONST               3 (2)
             12 LOAD_CONST               4 (1)
             14 LOAD_CONST               0 (9)
             16 BUILD_LIST               3
             18 STORE_NAME               1 (bar)

  4          20 LOAD_NAME                2 (print)
             22 LOAD_NAME                0 (foo)
             24 LOAD_CONST               5 (5)
             26 BINARY_SUBSCR
             28 LOAD_NAME                1 (bar)
             30 LOAD_CONST               3 (2)
             32 BINARY_SUBSCR
             34 CALL_FUNCTION            2
             36 POP_TOP
             38 LOAD_CONST               6 (None)
             40 RETURN_VALUE
```

The output is organized as follows. FYI, the line number starts at 2, because the `'''` counts as a line, and it's 1-indexed.

| line number | instruction number | opcode     | oparg | the actual resolved argument |
| ----------- | ------------------ | ---------- | ----- | ---------------------------- |
| 2           | 0                  | LOAD_CONST | 0     | (9)                          |
|             | 2                  | LOAD_CONST | 1     | (3)                          |
| ...         | ...                | ...        | ...   | ...                          |

We can clearly see that a lookup on `foo` is evaluated before a lookup on `bar`, as per instruction #26. I would love to dive into bytecode right now, but for now, take some [documentation](https://docs.python.org/3/library/dis.html#opcode-BINARY_SUBSCR).

We've found the problem, but this isn't a debugging session: there's nothing to be done here. Or is there?... 

### Our Saviour, 3.11

Pablo Galindo, author of [PEP 657](https://www.python.org/dev/peps/pep-0657/) implemented in Python 3.11, which is currently in alpha and set to release in October 2022. You can find the download here.

As discussed, this feature carries a memory cost, which the authors have acknowledged:

> We understand that the extra cost of this information may not be acceptable for some users, so we propose an opt-out mechanism which will cause generated code objects to not have the extra information while also allowing pyc files to not include the extra information.

So they made it opt-out by passing `-Xno_debug_ranges` to `python`.

As we wait for Pablo Galino's PEP to drop, Pablo Escobar waits with us :)

![Pablo](https://c.tenor.com/bZpnYV69q7kAAAAM/kyriostsahs-lonely.gif)