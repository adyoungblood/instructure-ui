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
import { runCommandsConcurrently, getCommand } from '@instructure/command-utils'

export default {
  command: 'lint',
  desc: 'lint files',
  builder: (yargs) => {
    yargs.option('fix', { boolean: true, desc: 'Fix lint issues' })
    yargs.strictOptions(true)
  },
  handler: async (argv) => {
    const paths = argv._.slice(1)
    let jspaths = ['.']
    let csspaths = ['**/*.css']

    if (paths.length) {
      jspaths = paths.filter((path) =>
        ['js', 'jsx', 'ts', 'tsx'].some(
          (ext) => path.split('.').slice(-1)[0] === ext
        )
      )
      csspaths = paths.filter((path) =>
        ['.css'].some((ext) => path.split('.').slice(-1)[0] === ext)
      )
    }

    const commands = {}

    if (jspaths.length) {
      commands['eslint'] = getCommand('eslint', [
        ...jspaths,
        '--ext .js,.jsx,.ts,.tsx',
        '--no-error-on-unmatched-pattern'
      ])
    }

    if (csspaths.length) {
      commands['stylelint'] = getCommand('stylelint', [
        ...csspaths,
        '--allow-empty-input'
      ])
    }

    process.exit(runCommandsConcurrently(commands).status)
  }
}
