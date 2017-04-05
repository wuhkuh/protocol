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

const protocols = require('./protocols')
const test = require('tape')

test('Parsing, linear template', function (t) {
  const testPacket1 = Buffer.from('1F', 'hex')
  const result = {
    header: 'correct',
    flag1: 1,
    flag2: 1,
    flag3: 3
  }

  t.deepEqual(protocols.linearProtocol.parse(testPacket1), result)
  t.end()
})

test('Parsing, embedded template', function (t) {
  const testPacket2 = Buffer.from('A0', 'hex')
  const result = {
    firstBits: {
      firstBit: 1,
      secondBit: 0
    },
    firstNibble: 8
  }

  t.deepEqual(protocols.embeddedProtocol.parse(testPacket2), result)
  t.end()
})

test('Generating, embedded template', function (t) {
  const testPacket3 = {
    firstBits: {
      firstBit: 1,
      secondBit: 0
    },
    firstNibble: 6
  }
  const result = Buffer.from('98', 'hex')
  t.deepEqual(protocols.embeddedProtocol.generate(testPacket3), result)
  t.end()
})
