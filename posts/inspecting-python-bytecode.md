---
title: 'Python: Development, Tracebacks'
date: '2021-10-11'
tags: ['python']
description: 'Here I discuss topics like development in Python, productivity, and why Python tracebacks suck (and the knight in shining armour that will save us from this terrible fate)'
---

> "Syntactically, Python code looks like executable pseudocode" - Guido van Rossum

Python development is fast. A succinct syntax lets you crunch through business logic with minimal line counts. An extensive standard library and frameworks like Django can reduce your time-to-market significantly. A shallow learning curve means there are more competent Python programmers relative to other languages like C, which makes hiring easier.

It would be a mistake to think that the time saved writing Python increases development speed proportionally. In adherence to [Parkinson's law](https://en.wikipedia.org/wiki/Parkinson%27s_law), time saved can easily be siphoned off into unproductive "tasks".

Unfortunately for deadlines, Python has one of these "tasks" built-in, and it can be highly engaging, especially for certain OCD-ish or competitive personality types: trying to make your Python code look as elegant and idiomatic as possible while maintaining good readability. High-level features like list comprehensions and negative indexing are some examples. Some _Pythonistas_ are excellent at this despite the subjective nature of 'readability'; they know all the tricks and can craft impressive one-liners that only take a few seconds of thought to understand.

And unless your goal is Python mastery, your productivity gets held hostage every time you're whisked away into an hour of unintentional flow state to indulge in your irrational compulsions of optimizing arbitrary shit that doesn't matter big-picture. Angst will eventually crack you, and when it does, the cortisol spike never feels worth it.

The solution here is to [develop new alarms](http://www.paulgraham.com/selfindulgence.html) and be aware that you're doing fake work. Here is yours.

## Pitfalls

I fell into one recently whilst balancing the line between readable and pythonic, by trying to squeeze multiple array lookups on the same line. The problem is that if one of those lookups is out of range, then you won’t know which one threw the exception:

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

But... you're asking me to make a 300% line count increase in Python? That feels way too hacky and dissatisfying.

I think this is a design oversight. Why would a language that puts so much emphasis on brevity not handle cases where people try to be brief?

Lets check the bytecode for some insight.

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
BTW, `line number` (leftmost column) starts at `2` because source files are 1-indexed, and there are no operations on line 1.

Looking at the `BINARY_SUBSCR` operation (instruction number `26`), we can see that the lookup on `foo` is evaluated before the lookup on `bar`, but that still doesn't tell us which one threw the `IndexError`. This means the bytecode itself has lost access to the column number.

When Python is [compiled](https://nedbatchelder.com/blog/201803/is_python_interpreted_or_compiled_yes.html), we drop a bunch of meta-resolution about the source code to remove noise and increase performance, leaving the PythonVM with only what it needs, thus **all runtime errors** lack detail. 

To highlight this, let's look at an error that is thrown _before runtime_, i.e. during parsing:

```py
>>> foo = [1, 2 3]
  File "<stdin>", line 1
    foo = [1, 2 3]
                ^
SyntaxError: invalid syntax
```

As shown, we get the column offset with the `^`. So, is it possible to get this resolution at runtime too?


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

> we propose an opt-out mechanism which will cause generated code objects to not have the extra information

That opt-out flag is `-Xno_debug_ranges`, which you can pass to `python`.

Pablo waits for Pablo:

![Pablo](pablowait.gif)
