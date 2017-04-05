# Common Style Guide for Node.JS (First draft, WIP)
To keep this repository clean, the Common Style Guide has been created.  
This should prevent ambiguity during commits, with the notorious bikeshedding.

## 1. General
- American English should be enforced.
- The English abbrevation rules should be followed.  
When unsure, they can be looked up on [Merriam-Webster](https://www.merriam-webster.com/).

## 2. Code
- Code should conform to the latest version of [Standard](https://github.com/feross/standard).
- Code should support current Node.JS releases.  
For more info, visit the [Node.JS LTS schedule](https://github.com/nodejs/LTS).

- When possible, code should be conform to the latest EcmaScript version.  
This is only possible if the current Node.JS releases support this.  

- Blocks of code that are not documented in the API should be private.

## 3. Documentation and notes
- [JSDoc](https://github.com/jsdoc3/jsdoc) should be used to document the code.

---
## TODO:
- Testing
- Notes, inline notes
- Error handling