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
  command: 'bundle',
  desc: '',
  builder: (yargs) => {
    yargs.option('port', { alias: 'p', desc: '' })
    yargs.option('watch', { boolean: true, desc: '' })
    yargs.strictOptions(true)
  },
  handler: async (argv) => {
    const { NODE_ENV, DEBUG, OMIT_INSTUI_DEPRECATION_WARNINGS } = process.env

    let port = argv.port || '8080'

    let command, webpackArgs

    let envVars = [
      OMIT_INSTUI_DEPRECATION_WARNINGS
        ? `OMIT_INSTUI_DEPRECATION_WARNINGS=1`
        : false
    ]

    if (argv.watch) {
      command = 'webpack'
      envVars = envVars
        .concat(['NODE_ENV=development', 'DEBUG=1'])
        .filter(Boolean)
      webpackArgs = ['serve', '--mode=development', `--port=${port}`]
    } else {
      command = 'webpack'
      envVars = envVars
        .concat([
          `NODE_ENV=${NODE_ENV || 'production'}`,
          'NODE_OPTIONS=--max_old_space_size=120000',
          DEBUG ? `DEBUG=1` : false
        ])
        .filter(Boolean)
      webpackArgs = ['--mode=production']
    }

    process.exit(
      runCommandsConcurrently({
        webpack: getCommand(command, webpackArgs, envVars)
      }).status
    )
  }
}
