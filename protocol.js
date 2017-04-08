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

const lib = require('./lib')                  // Library
const flattenTree = lib.flattenTree      // Flatten schema to linear form
const generate = lib.generate           // Generate packets using schema
const parse = lib.parse                     // Parse packets using schema
const setup = lib.setup                     // Remove functions from hot path

/**
 * Create and read Buffers with the Protocol class
 * @public
 */
class Protocol {
  constructor (schema) {
    const nodeMajorVersion = process.version.split('v')[1].split('.')[0]

    /*
     * Prevent usage on old node versions, due to the Buffer vulnerability (node issue #4660),
     * as well as discourage usage on node versions 6 or lower, due to poor ES6 performance.
     *
     * There will be no workaround for this vulnerability due to requiring API changes. This might
     * result in poor performance. In this application, performance is critical.
     */

    if (nodeMajorVersion <= 4) {
      throw new Error('Protocol ERROR: This version of Node has a security problem with Buffers. ' +
      'Please update your installation. (node issue #4660)')
    } else if (nodeMajorVersion <= 6) {
      console.warn('Protocol WARNING: This version of Node has poor ES6 support, which might ' +
      'impede performance and stability. Please update your installation.')
    }

    this._schema = setup(flattenTree(schema))
  }

  /**
   * Generate a Buffer from an Object according to the Protocol schema
   * @param {Object} input input
   * @returns {Buffer} output
   * @public
   */
  generate (input) { return generate(input, this._schema) }

  /**
   * Parse a Buffer, returning an Object according to the Protocol schema
   * @param {Buffer} input input
   * @returns {Object} output
   * @public
   */
  parse (input) { return parse(input, this._schema) }
}

module.exports = Protocol
