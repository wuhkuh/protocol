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

/**
 * Setup a protocol schema
 * @param {Object} schema Protocol schema
 * @returns {Object} process-ready Protocol schema
 * @public
 */
function setup (schema) {
  let offset = 0

  for (let key in schema) {
    let length = schema[key]['length']

    if (length) {
      schema[key]['mask'] = _mask(length, offset)
      offset += length
    } else {
      // TODO: Support variable length (remainder)
    }
  }

  return schema
}

/**
 * Generate a variable mask
 * @param {Number} length length of key
 * @param {Number} offset offset in bits
 * @returns {String} bitmask
 * @private
 */
function _mask (length, offset) {
  offset = offset - Math.floor(offset / 4) * 4 // Internal offset (start of chunk -> actual mask)
  const remainder = Math.ceil((offset + length) / 4) * 4 - offset - length

  return parseInt('1'.repeat(length) + '0'.repeat(remainder), 2)
}

module.exports = setup
