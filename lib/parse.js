/*
 * MIT License
 *
 * Copyright (c) 2017 Wouter Klijn <contact@wuhkuh.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict'

const unflatten = require('./unflatten')

/**
 * Transform a buffer into a readable Object, using the Protocol schema
 * @param {Buffer} input input
 * @param {Object} schema Protocol schema
 * @returns {Object} output
 * @public
 */
function parse (input, schema) {
  const output = {}
  let offset = 0

  for (let key in schema) {
    let dict = schema[key]['dict']
    let length = schema[key]['length']
    let mask = schema[key]['mask']
    let type = schema[key]['type']
    let result

    if (length) {
      result = _getValue(input.toString('hex'), offset, length, mask)
      offset += length
    } else {
      // TODO: Support variable length (remainder)
    }

    if (dict) {
      result = dict[result] || result
    }

    if (type) {
      if (type === Boolean) result = !!result
    }

    output[key] = result
  }

  return unflatten(output)
}

/**
 * Returns a value from a hexadecimal string
 * @param {String} input hexadecimal string
 * @param {Number} offset offset of key
 * @param {Number} length length of key
 * @returns {Number} value
 * @private
 */
function _getValue (input, offset, length, mask) {
  const chunkStart = Math.floor(offset / 4)
  const chunkEnd = Math.ceil((offset + length) / 4)
  const chunk = '0x' + input.slice(chunkStart, chunkEnd)

  offset = offset - chunkStart * 4 // Internal offset (start of chunk -> actual data)

  const rightShift = 4 * (chunkEnd - chunkStart) - offset - length
  const data = (chunk & mask) >> rightShift

  return data
}

module.exports = parse
