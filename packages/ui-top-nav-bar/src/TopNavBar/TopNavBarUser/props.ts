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

import React from 'react'
import PropTypes from 'prop-types'

import { Children as ChildrenPropTypes } from '@instructure/ui-prop-types'

import type { WithStyleProps, ComponentStyle } from '@instructure/emotion'
import type {
  TopNavBarUserTheme,
  OtherHTMLAttributes,
  PropValidators
} from '@instructure/shared-types'

import { TopNavBarItem } from '../TopNavBarItem'
import type { ItemChild } from '../TopNavBarItem/props'

import { TopNavBarUser } from './index'

type UserChild = React.ComponentElement<TopNavBarUserProps, TopNavBarUser>

type TopNavBarUserOwnProps = {
  /**
   * FIXME: description of the children prop goes here
   */
  children?: ItemChild | ItemChild[]

  /**
   * A function that returns a reference to root HTML element
   */
  elementRef?: (el: Element | null) => void
}

type PropKeys = keyof TopNavBarUserOwnProps

type AllowedPropKeys = Readonly<Array<PropKeys>>

type TopNavBarUserProps = TopNavBarUserOwnProps &
  WithStyleProps<TopNavBarUserTheme, TopNavBarUserStyle> &
  OtherHTMLAttributes<TopNavBarUserOwnProps>

type TopNavBarUserStyle = ComponentStyle<'topNavBarUser'>

type TopNavBarUserState = {
  // state comes here
}

type TopNavBarUserStyleProps = {
  // props passed to makeStyles come here
}

const propTypes: PropValidators<PropKeys> = {
  children: ChildrenPropTypes.oneOf([TopNavBarItem]),
  elementRef: PropTypes.func
}

const allowedProps: AllowedPropKeys = ['children', 'elementRef']

export type {
  UserChild,
  TopNavBarUserProps,
  TopNavBarUserStyle,
  TopNavBarUserState,
  TopNavBarUserStyleProps
}
export { propTypes, allowedProps }
