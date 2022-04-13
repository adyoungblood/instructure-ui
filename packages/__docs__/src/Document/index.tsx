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

/** @jsx jsx */
import { Component } from 'react'
import GithubCorner from 'react-github-corner'

import { Link } from '@instructure/ui-link'
import { List } from '@instructure/ui-list'
import { View } from '@instructure/ui-view'
import { ToggleDetails } from '@instructure/ui-toggle-details'
import { Tabs } from '@instructure/ui-tabs'
import type { TabsProps } from '@instructure/ui-tabs'
import { CodeEditor } from '@instructure/ui-code-editor'
import { instructure } from '@instructure/ui-themes'
import { withStyle, jsx, InstUISettingsProvider } from '@instructure/emotion'
import type { SpacingValues } from '@instructure/emotion'

import generateStyle from './styles'
import generateComponentTheme from './theme'

import { Description } from '../Description'
import { Properties } from '../Properties'
import { Params } from '../Params'
import { Returns } from '../Returns'
import { Methods } from '../Methods'
import { ComponentTheme } from '../ComponentTheme'
import { Heading } from '../Heading'

import { propTypes, allowedProps } from './props'
import type {
  DocumentProps,
  DocumentState,
  DocDataType,
  TOCHeadingData
} from './props'

@withStyle(generateStyle, generateComponentTheme)
class Document extends Component<DocumentProps, DocumentState> {
  static propTypes = propTypes
  static allowedProps = allowedProps

  static defaultProps = {
    description: undefined,
    themeVariables: {},
    repository: undefined,
    layout: 'small'
  }

  state: DocumentState = {
    selectedDetailsTabIndex: 0,
    TOCData: []
  }

  ref: HTMLDivElement | null = null

  componentDidMount() {
    this.props.makeStyles?.()
    this.setHeadingData()
  }

  componentDidUpdate() {
    this.props.makeStyles?.()
  }

  handleDetailsTabChange: TabsProps['onRequestTabChange'] = (
    _event,
    { index }
  ) => {
    this.setState({
      selectedDetailsTabIndex: index
    })
  }

  renderProps(doc: DocDataType) {
    const { id, props, description } = doc
    const hasTsProps =
      typeof description === 'string' && description.includes('@tsProps')
    return props ? (
      <View margin="x-large 0" display="block">
        <Heading level="h2" as="h3" id={`${id}Properties`} margin="0 0 small 0">
          Properties
        </Heading>
        <Properties
          props={props}
          hasTsProps={hasTsProps}
          layout={this.props.layout}
        />
      </View>
    ) : null
  }

  renderTheme(doc: DocDataType) {
    const { themeVariables } = this.props
    const generateComponentTheme =
      doc?.componentInstance?.generateComponentTheme

    const componentTheme =
      themeVariables &&
      typeof generateComponentTheme === 'function' &&
      generateComponentTheme(themeVariables)

    const themeVariableKeys = Object.keys(componentTheme)

    return componentTheme && themeVariableKeys.length > 0 ? (
      <View margin="x-large 0" display="block">
        <Heading level="h2" as="h3" id={`${doc.id}Theme`} margin="0 0 small 0">
          Default Theme Variables
        </Heading>
        <ComponentTheme
          componentTheme={componentTheme}
          themeVariables={themeVariables}
        />

        <View margin="x-large 0 0" display="block">
          <Heading
            level="h4"
            id={`${doc.id}ThemeOverrideExample`}
            margin="0 0 small 0"
          >
            How to override the default theme
          </Heading>

          <View margin="small 0" display="block">
            In case you need to change the appearance of the{' '}
            <code>{doc.id}</code> component, you can override it&apos;s default
            theme variables.
          </View>
          <View margin="small 0" display="block">
            The easiest way to do this is to utilize the{' '}
            <code>themeOverride</code> property. See the{' '}
            <Link href="#using-theme-overrides">Using theme overrides</Link>{' '}
            guide for more info and alternative methods.
          </View>

          <CodeEditor
            label="Component theme override example"
            language="js"
            readOnly
            value={`// theme override example

<${doc.id}
  {...props}
  themeOverride={{
    ${
      // get random theme variable
      themeVariableKeys[Math.floor(Math.random() * themeVariableKeys.length)]
    }: 'custom value'
  }}
/>`}
          />
        </View>
      </View>
    ) : null
  }

  renderDescription(doc: DocDataType, description: string) {
    const { id, title } = doc
    const filteredDescription = description
      .replace('@tsProps', '')
      .replace(/@module [a-zA-Z]+/g, '')
    return this.props.description ? (
      <Description
        id={`${id}Description`}
        content={filteredDescription}
        title={title}
      />
    ) : null
  }

  renderSrcLink() {
    const { srcUrl, srcPath, legacyGitBranch } = this.props.doc
    let legacySrcUrl

    if (!srcUrl) return

    if (legacyGitBranch) {
      legacySrcUrl = srcUrl.replace('/master/', `/${legacyGitBranch}/`)
    }

    return (
      <View as="div" margin="0 0 x-large 0">
        <Link href={legacySrcUrl || srcUrl}>{srcPath}</Link>
      </View>
    )
  }

  renderUsage() {
    const { esPath, id, displayName, packageName, title } = this.props.doc
    const importName = displayName || id

    const example = []

    if (packageName) {
      example.push(`\
/*** ES Modules (with tree shaking) ***/
import { ${importName} } from '${packageName}'
`)
    }

    if (esPath) {
      example.push(`\
/*** ES Modules (without tree shaking) ***/
import { ${importName} } from '${esPath}'
`)
    }

    if (example.length === 0) return

    return (
      <View margin="xx-large 0" display="block">
        <Heading level="h2" as="h3" id={`${id}Usage`} margin="0 0 small 0">
          Usage
        </Heading>
        <View margin="0 0 small 0" display="block">
          <CodeEditor
            label={`How to install ${title}`}
            value={`yarn add ${packageName}`}
            language="shell"
            readOnly
          />
        </View>
        <CodeEditor
          label={`How to use ${title}`}
          value={example.join('\n')}
          language="javascript"
          readOnly
        />
      </View>
    )
  }

  renderParams(doc: DocDataType) {
    const { id, params } = doc

    return params ? (
      <View margin="small 0" display="block">
        <Heading level="h2" as="h3" id={`${id}Parameters`} margin="0 0 small 0">
          Parameters
        </Heading>
        <Params params={params} layout={this.props.layout} />
      </View>
    ) : null
  }

  renderReturns(doc: DocDataType) {
    const { id, returns } = doc

    return returns ? (
      <View margin="small 0" display="block">
        <Heading level="h2" as="h3" id={`${id}Returns`} margin="0 0 small 0">
          Returns
        </Heading>
        <Returns types={returns} />
      </View>
    ) : null
  }

  renderMethods(doc: DocDataType) {
    const { id, methods } = doc

    return methods && methods.length > 0 ? (
      <View margin="small 0" display="block">
        <Heading level="h2" as="h3" id={`${id}Methods`} margin="0 0 small 0">
          Methods
        </Heading>
        <Methods methods={methods} />
      </View>
    ) : null
  }

  renderDetails(doc: DocDataType) {
    return this.hasDetails(doc) ? (
      <div>
        {this.renderParams(doc)}
        {this.renderReturns(doc)}
        {this.renderMethods(doc)}
        {this.renderProps(doc)}
        {this.renderTheme(doc)}
      </div>
    ) : null
  }

  hasDetails(doc: DocDataType) {
    return doc.params || doc.returns || doc.methods || doc.props
  }

  setHeadingData() {
    const { doc } = this.props
    const headings = this.ref?.querySelectorAll<HTMLHeadingElement>(
      'h1, h2, h3, h4, h5, h6'
    )
    const TOCData: DocumentState['TOCData'] = []
    let hasLinkToTitle = false

    headings?.forEach((h) => {
      const { id, innerText, tagName } = h
      const level = tagName[1]

      if (['1', '2'].includes(level) || doc.id === id) {
        // already has a page title
        hasLinkToTitle = true
      }

      const data: TOCHeadingData = {
        id,
        innerText,
        level: tagName[1]
      }
      TOCData.push(data)
    })

    if (!hasLinkToTitle) {
      // if there is no link to the main title,
      // add at the beginning of the list
      TOCData.unshift({
        id: doc.id,
        innerText: doc.id,
        level: '1'
      })
    }

    if (TOCData.length === 1) {
      // if there is only 1 item, clear TOC, no need for list
      TOCData.pop()
    }

    this.setState({ TOCData })
  }

  renderTOC() {
    const { doc } = this.props
    const { TOCData } = this.state

    if (!TOCData || !TOCData.length) {
      return null
    }

    const levelPaddingMap: Record<string, SpacingValues> = {
      1: '0',
      2: '0',
      3: '0',
      4: 'small',
      5: 'medium',
      6: 'x-large'
    }

    const TOC = TOCData.map((data) => {
      return (
        <List.Item
          key={data.id}
          padding={`0 0 0 ${levelPaddingMap[data.level]}`}
        >
          <Link href={`#${doc.id}/#${data.id}`}>{data.innerText}</Link>
        </List.Item>
      )
    })

    return (
      <InstUISettingsProvider theme={instructure}>
        <View as="div" margin="medium 0">
          <ToggleDetails
            summary="Table of Contents"
            defaultExpanded={doc.category?.includes('components')}
            size="large"
          >
            <List margin="0 0 large" isUnstyled>
              {TOC}
            </List>
          </ToggleDetails>
        </View>
      </InstUISettingsProvider>
    )
  }

  render() {
    const { doc, repository, layout } = this.props
    const children = doc.children || []

    let details = null

    if (this.hasDetails(doc)) {
      details =
        children.length > 0 ? (
          <Tabs onRequestTabChange={this.handleDetailsTabChange}>
            <Tabs.Panel
              renderTitle={doc.title}
              key={`${doc.id}TabPanel`}
              isSelected={this.state.selectedDetailsTabIndex === 0}
            >
              {this.renderDetails(doc)}
            </Tabs.Panel>
            {children.map((child, index) => (
              <Tabs.Panel
                renderTitle={child.title}
                key={`${child.id}TabPanel`}
                isSelected={this.state.selectedDetailsTabIndex === index + 1}
              >
                {this.renderDescription(child, child.description)}
                {this.renderDetails(child)}
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          this.renderDetails(doc)
        )
    }

    let sections

    if (doc.sections) {
      sections = doc.sections.map((section) => (
        <View
          margin="small 0"
          display="block"
          key={`${doc.id}.${section.name}`}
        >
          <Heading
            level="h2"
            as="h3"
            color="secondary"
            id={`${doc.id}.${section.name}`}
            margin="large 0 small 0"
          >
            {section.kind && <code>{section.kind}</code>}
            {section.title}
          </Heading>
          {this.renderDescription(section, section.description)}
          {this.renderDetails(section)}
        </View>
      ))
    }

    return (
      <div
        ref={(e) => {
          this.ref = e
        }}
      >
        {doc.extension !== '.md' && this.renderSrcLink()}
        {this.renderTOC()}
        {this.renderDescription(doc, this.props.description)}
        {details}
        {sections}
        {['.js', '.ts', '.tsx'].includes(doc.extension) && this.renderUsage()}
        {repository && layout !== 'small' && (
          <GithubCorner
            href={repository}
            bannerColor={this.props.styles?.githubCornerColor as string}
          />
        )}
      </div>
    )
  }
}

export default Document
export { Document }
