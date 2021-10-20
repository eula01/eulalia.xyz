---
title: 'Inspecting Python Bytecode'
date: '2021-10-11'
tags: ['python']
description: 'Inspecting Python bytecode'
---

## Python

Python has grown on me! Its simplicity makes it feel closer to an extension of thought than any other language I’m familiar with. Guido van Rossum himself captures this sentiment perfectly:

> Syntactically, Python code looks like executable pseudocode

High-level features like list comprehensions, slices, and negative indexes almost embed a minigame directly into the source files, the objective being to reduce line counts and constantly look for greater levels of elegance, without rendering your code unreadable.

Python lets you think creatively, as compared with a language like Go, where there’s often a single way to do something, like handling errors for example. I’ve noticed that whenever I write Go, I’ll be focused on whether what I’m doing is _correct_ and _performant_, whereas in Python I'm focused on being _succinct_ and _beautiful_. I think this makes programming in Python a little more artistic than other languages, which is very enjoyable.

## Error

If you ever find yourself being tempted (by a talking python) to pick fruits from the Tree of Brevity, then tread carefully; the road ahead is time-consuming and full of potholes! I fell into one recently by trying to squeeze multiple array lookups on the same line. If just one of those lookups is out of range, then you won’t know which array threw the exception.

```py
>>> foo = [9, 3, 7]
>>> bar = [2, 1, 9]
>>> print(foo[5], bar[2])

Traceback (most recent call last):
File "<stdin>", line 3, in <module>
IndexError: list index out of range
```

Here, we receive an IndexError after an invalid lookup on foo, but the traceback only gives us the line number and **not the column offset**. For such a trivial example this doesn’t seem too bad, but imagine that you’re dealing with a large and dynamic dataset, as is often the case in Python, and you're trying to minimize line count (probably not the best heuristic, in hindsight).

I think this is a design oversight. Why would a language that puts so much emphasis on simplicity and brevity not handle cases where people try to do exactly that? The obvious workaround is to split lookups across multiple lines, but this feels too hacky and dissatisfying for a syntax like Python.

Anyways, let's use the dis module and see if inspecting the bytecode can help up understand our problem:

```py
>>> import dis
>>> 
>>> test = '''
...        foo = [9, 3, 7]
...        bar = [2, 1, 9]
...        print(foo[5], bar[2])
...        '''
>>> print(dis.dis(compile(test, "", "exec")))

#  line     instruction     opcode         oparg      the actual resolved 
# number      number                                      argument

  2           0           LOAD_CONST         0          (9)
              2           LOAD_CONST         1          (3)
              4           LOAD_CONST         2          (7)
              6           BUILD_LIST         3          
              8           STORE_NAME         0          (foo)

  3          10           LOAD_CONST         3          (2)
             12           LOAD_CONST         4          (1)
             14           LOAD_CONST         0          (9)
             16           BUILD_LIST         3          
             18           STORE_NAME         1          (bar)

  4          20           LOAD_NAME          2          (print)
             22           LOAD_NAME          0          (foo)
             24           LOAD_CONST         5          (5)
             26           BINARY_SUBSCR   
             28           LOAD_NAME          1          (bar)
             30           LOAD_CONST         3          (2)
             32           BINARY_SUBSCR   
             34           CALL_FUNCTION      2          
             36           POP_TOP         
             38           LOAD_CONST         6          (None)
             40           RETURN_VALUE
```
FYI, `line number` starts at `2` because source files are 1-indexed, and there are no operations on the first line (`'''`)

Looking at the `BINARY_SUBSCR` operation (instruction number `26`), we can see that the lookup on `foo` is evaluated before the lookup on `bar`, but that still doesn't tell us which one threw the `IndexError`.

Actually, we can't tell from the bytecode alone, as it does not have access to the column number. When Python is [compiled](https://nedbatchelder.com/blog/201803/is_python_interpreted_or_compiled_yes.html), we drop a bunch of meta-resolution about the source code to remove noise and increase performance, leaving the PythonVM with only what it needs– thus all runtime errors lack this detail. 

To highlight this, let's look at an error that is thrown _before_ runtime, i.e. during parsing:

```py
>>> foo = [1, 2, 3 4]
  File "<stdin>", line 1
    foo = [1, 2, 3 4]
                   ^
SyntaxError: invalid syntax
```

The column offset points at the last valid token with a little `^`. So, are we lost? Not just yet...


## PEP 657: Harbinger of Clarity

[PEP 657](https://www.python.org/dev/peps/pep-0657/), authored by Pablo Galindo, proposes a mapping between instruction numbers and the column offsets on each line! It's implemented in Python 3.11, which is currently in alpha and set to release in October 2022. You can test it out [here](https://github.com/python/cpython).

It will make our traceback from earlier look like this:

```py
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
    print(foo[5], bar[5])
          ~~~^^^
IndexError: list index out of range
```

As we've discussed, a feature like this carries a memory cost, which the authors have acknowledged:

> We understand that the extra cost of this information may not be acceptable for some users, so we propose an opt-out mechanism which will cause generated code objects to not have the extra information while also allowing pyc files to not include the extra information.

So you can opt-out by passing `-Xno_debug_ranges` to `python`.

Now, as we wait for Pablo Galino's PEP to drop, Pablo Escobar waits with us :)

![Pablo](pablowait.gif)
