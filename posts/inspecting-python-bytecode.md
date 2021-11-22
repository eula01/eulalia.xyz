---
title: 'Tracebacks in Python'
date: '2021-10-11'
tags: ['python']
description: 'Tracebacks in Python'
---

## Python

Python is closest to an extension of thought than any other language I've used, which makes development fast. Guido van Rossum expresses this sentiment best:

> Syntactically, Python code looks like executable pseudocode

In adherence to [Parkinson's law](https://en.wikipedia.org/wiki/Parkinson%27s_law), time saved writing Python may be reinvested into making it look pretty. High-level features like list comprehensions and negative indexes almost embed a minigame into the source code, the objective being to reduce line counts and increase elegance without compromising on redability.

I think this makes Python more artistic than other languages, because readability is quite a subjective end.

## Dangerous Game

I got suckered recently whilst balancing that line between readable and pythonic, by trying to squeeze multiple array lookups on the same line. The problem is that if one of those lookups is out of range, then you won’t know which one threw the exception:

```py
>>> foo = [9, 3, 7]
>>> bar = [2, 1, 9]
>>> print(foo[5], bar[2])

Traceback (most recent call last):
File "<stdin>", line 3, in <module>
IndexError: list index out of range
```

As shown, we get an IndexError after an invalid lookup on foo, but the traceback only gives us the line number and **not the column offset**. The obvious solution is to:

```py
>>> print(
>>>     foo[5], 
>>>     bar[2]
>>> )
```

But... you're asking me to make a 300% line count increase... in PYTHON!? That feels way too hacky and dissatisfying.

I think this is a design oversight. Why would a language that puts so much emphasis on brevity not handle cases where people try to be brief?

Lets check the bytecode and see if there's a better solution.

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
FYI, `line number` starts at `2` because source files are 1-indexed, and there are no operations on line 1 (`'''`)

Looking at the `BINARY_SUBSCR` operation (instruction number `26`), we can see that the lookup on `foo` is evaluated before the lookup on `bar`, but that still doesn't tell us which one threw the `IndexError`. Sadly, the bytecode itself has lost access to the column number.

When Python is [compiled](https://nedbatchelder.com/blog/201803/is_python_interpreted_or_compiled_yes.html), we drop a bunch of meta-resolution about the source code to remove noise and increase performance, leaving the PythonVM with only what it needs– thus **all runtime errors** lack detail. 

To highlight this, let's look at an error that is thrown _before runtime_, i.e. during parsing:

```py
>>> foo = [1, 2 3]
  File "<stdin>", line 1
    foo = [1, 2 3]
                ^
SyntaxError: invalid syntax
```

As shown, we get the column offset with the `^`. Is it possible to get this resolution at runtime too?


## PEP 657: Harbinger of Clarity

Behold [PEP 657](https://www.python.org/dev/peps/pep-0657/), authored by Pablo Galindo, which proposes a mapping between instruction numbers and column offsets on each line! It's implemented in Python 3.11, which is currently in alpha and set to release in October 2022. You can test it out [here](https://github.com/python/cpython).

It will make our traceback from earlier look something like this:

```py
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
    print(foo[5], bar[5])
          ~~~^^^
IndexError: list index out of range
```

As we've discussed, a feature like this carries a memory cost, which the authors have acknowledged:

> We understand that the extra cost of this information may not be acceptable for some users, so we propose an opt-out mechanism which will cause generated code objects to not have the extra information while also allowing pyc files to not include the extra information.

So you may opt-out by passing `-Xno_debug_ranges` to `python`.


POV Pablo Escobar waits for Pablo Galino's PEP to drop

![Pablo](pablowait.gif)
