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
 * @param {Object} object input
 * @param {Object} flatSchema Protocol schema
 * @returns {Buffer} output
 * @public
 */
function generate (object, flatSchema) {
  const output = []
  object = flatten(object)

  for (let key in flatSchema) {
    let input = object[key] // The current value we're processing
    const properties = flatSchema[key] // Current key properties
    let bitLength = properties['bitLength']
    let byteLength = properties['byteLength']
    const dict = properties['dict']
    const type = properties['type']
    let result

    /* Handle dict */
    if (typeof dict === 'object') {
      result = (dict[input] !== undefined) ? dict[input] : input
    }

    /* Handle boolean type */
    result = (type === Boolean && result) ? 1 : 0

    /* Bit handling */
    if (bitLength !== undefined) {
      result = (input !== undefined) ? input.toString(2) : '0' // 0 if undefined
      result = '0'.repeat(bitLength - result.length) + result // Fix length

      /* Byte handling */
    } else if (byteLength !== undefined) {
      const encoding = properties['encoding']

      if (input !== undefined) {
        result = Buffer.from(input.toString(), encoding)
      } else {
        result = Buffer.alloc(byteLength) // Buffer with zeros (safeAlloc)
      }
    }
    output.push(result)
  }

  return _toBuffer(output)
}

/**
 * Create a single Buffer from the array of bitstrings and Buffers passed to it
 * @param {Array} array array containing bitstrings and Buffers
 * @returns {Buffer} buffer which holds the array data
 * @private
 */
function _toBuffer (array) {
  let lastIndex = 0
  const resArray = []

  /*
   * To process different types of data: bitstrings and Buffers, this chunk of
   * code joins the input before the key whenever the key is a Buffer or the
   * last key in the array.
   *
   * - If the input lacks Buffers, it joins the string and creates a Buffer
   * - If the input has Buffers, it joins the input, translates it into a Buffer
   *   and adds itself to the array.
   * - If the input consists of only Buffers, it just adds Buffers to the array
   *
   * This is to ensure the final array can be concatenated into a single
   * Buffer at the end of the operation.
   */

  array.push('') // HACK, to fix final run through forEach
  array.forEach(function (element, index) {
    if (element instanceof Buffer || index === array.length - 1) {
      let bits = array.slice(lastIndex, index).join('')
      const bytes = []

      /*
       * Slice each bitstring into chunks of 8, add to byte array
       * Also append zeros when the bitstring is not a full octet
       * This prevents overlap with bytes
       */

      for (let i = 0; i < (bits.length / 8); i++) {
        bits = bits + '0'.repeat(_calcRemainder(bits.length, 8))
        bytes.push(parseInt(bits.substr(i * 8, i * 8 + 8), 2))
      }

      const buffer = Buffer.from(bytes)
      resArray.push(buffer)
      lastIndex = index + 1

      if (element instanceof Buffer) {
        resArray.push(element)
      }
    }
  })

  return Buffer.concat(resArray)
}

/**
 * Calculate the remainder
 * @param {Number} input input
 * @param {Number} divisor divisor
 * @returns {Number} modulo
 * @private
 */
function _calcRemainder (input, divisor) {
  if (input < divisor) return divisor - input
  return input % divisor
}

module.exports = generate
