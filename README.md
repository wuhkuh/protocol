# Protocols for Node.JS [![Build Status](https://travis-ci.org/wuhkuh/protocol.svg)](https://travis-ci.org/wuhkuh/protocol) [![Greenkeeper badge](https://badges.greenkeeper.io/wuhkuh/protocol.svg)](https://greenkeeper.io/)
## Create and edit network protocols the easy way. <a href="https://github.com/feross/standard"><img align="right" src="https://cdn.rawgit.com/feross/standard/master/badge.svg"></a>

No more bitwise logic - give it a template and let it do the work for you.

  * <a href="#installation">Installation</a>
  * <a href="#example">Example</a>
  * <a href="#api">API</a>
  * <a href="#support">Support</a>
  * <a href="#license">License</a>

<a name="installation"></a>

## Installation

```js
npm install protocol --save
```

<a name="example"></a>

## Example

```js
const Protocol = require('protocol')

module.exports = new Protocol({
  header: [{
    firstBit: { bitLength: 1 },
    secondBit: { bitLength: 1 }
  }],
  payloadLength: { bitLength: 4 },
  payload: { byteLength: 'payloadLength' }
})
```

* `bitLength` in amount of bits, or a string that references to another key when variable. 
* `byteLength` in amount of bytes, or a string that references to another key when variable.

For a more extensive version, view the <a href="https://github.com/wuhkuh/protocol/tree/master/example">example folder</a> in this project's repository.

> Good practice:  
> Create a protocol in a separate file and share it between clients. This enables rapid communications setup.

<a name="api"></a>

## API
TODO

<a name="support"></a>

## Support

| Version  | Supported until |
| --------- | :---------------: |
| Node v7 |    2017-06-01   |
| Node v8 |    2019-12-31   |

<a name="license"></a>

## License
MIT
