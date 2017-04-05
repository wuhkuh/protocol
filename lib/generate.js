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

const flatten = require('./flatten')

/**
 * Generate a packet using the Protocol schema
 * @param {Object} input input
 * @param {Object} schema Protocol schema
 * @returns {Buffer} output
 * @public
 */
function generate (input, schema) {
  const result = []
  input = flatten(input)

  for (let i in schema) {
    let rules = schema[i]
    let value = input[i]

    result.push(_toBitstring(value, rules))
  }

  return Buffer.from(_toByteArray(result))
}

/**
 * Convert a value to a bitstring
 * @param {Number} input input
 * @param {Object} rules Protocol rules
 * @returns {String} bits
 * @private
 */
function _toBitstring (input, rules) {
  let dict = rules['dict']
  let length = rules['length']
  let type = rules['type']

  if (dict) {
    input = dict[input] || input // do we want this?
  }

  if (type) {
    input = (type === Boolean) ? 1 : 0
  }

  if (length) {
    let bitstring = input.toString(2)
    input = '0'.repeat(length - bitstring.length) + bitstring
  } else {
    // TODO: Support variable length (remainder)
  }

  return input
}

/**
 * Generate a byte array from an array of bits
 * @param {Array} input array of bits
 * @returns {Array} array of bytes
 * @private
 */
function _toByteArray (input) {
  const result = []
  input = input.join('')

  for (let i = 0; i < input.length; i += 8) {
    result.push(input.substr(i, i + 8))
  }

  const lastByte = result[result.length - 1]
  if (lastByte.length < 8) {
    result[result.length - 1] = lastByte + '0'.repeat(8 - lastByte.length) // Append 0s to fill the byte
  }

  result.forEach(function (element, index) {
    result[index] = parseInt(element, 2)
  })

  return result
}

module.exports = generate
