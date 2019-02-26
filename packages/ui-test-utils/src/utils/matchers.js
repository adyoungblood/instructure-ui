/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
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
import { label, title } from './helpers'

function matches (textToMatch, matcherString, options = {
  exact: true,
  trim: true,
  collapseWhitespace: true
}) {
  const { exact, collapseWhitespace, trim } = options
  const matcher = exact ? exactMatches : fuzzyMatches
  return matcher(textToMatch, matcherString, { collapseWhitespace, trim })
}

function fuzzyMatches (textToMatch, matcher, {collapseWhitespace = true, trim = true} = {}) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = normalize(textToMatch, {trim, collapseWhitespace})
  return normalizedText.toLowerCase().includes(matcher.toLowerCase())
}

function exactMatches (textToMatch, matcher, { collapseWhitespace = true, trim = true } = {}) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = normalize(textToMatch, { trim, collapseWhitespace })
  return normalizedText === matcher
}

function normalize (text, {collapseWhitespace = true, trim = true} = {}) {
  let normalizedText = text
  normalizedText = trim ? normalizedText.trim() : normalizedText
  normalizedText = collapseWhitespace
    ? normalizedText.replace(/\s+/g, ' ')
    : normalizedText
  return normalizedText
}

function matchElementByTitle (element, titleText, options) {
  return matches(title(element), titleText, options)
}

function matchElementByLabel (element, labelText, options) {
  return matches(label(element), labelText, options)
}

function matchElementByText (element, text, options) {
  if (element.matches('input[type=submit], input[type=button]')) {
    return element.value
  }
  const nodeText = Array.from(element.childNodes)
    .map((child) => {
      let textContent

      // filter out nodes that have the same textContent as the parent
      if (child.nodeType === 3 ||
        (child.nodeType === 1 && (normalize(element.textContent) !== normalize(child.textContent)))
      ) {
        textContent = child.textContent
      }

      return textContent || ''
    })
    .join('')
  return matches(nodeText, text, options)
}

function matchElementByAttributeValue (element, name, value, options) {
  return matches(element.getAttribute(name), value, options)
}

export {
  matches,
  matchElementByTitle,
  matchElementByLabel,
  matchElementByAttributeValue,
  matchElementByText
}
