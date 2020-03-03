import React, { useContext, FunctionComponent, Fragment } from 'react'
import LineItemChildrenContext from '../context/LineItemChildrenContext'
import Parent from './utils/Parent'
import { BaseComponent } from '../@types'
import PropTypes from 'prop-types'
import _ from 'lodash'

export interface LineItemOptionsProps extends BaseComponent {
  children?: FunctionComponent
}

const LineItemOptions: FunctionComponent<LineItemOptionsProps> = props => {
  const { lineItem } = useContext(LineItemChildrenContext)
  const lineItemOptions = lineItem.lineItemOptions().toArray()
  const parentProps = {
    lineItemOptions,
    ...props
  }
  const options = lineItemOptions.map((o, k) => {
    const opts = _.map(o.options, (v, k) => {
      return (
        <p key={k} {...props}>
          <span>{`${k}: `}</span>
          <span>{`${v}`}</span>
        </p>
      )
    })
    return <Fragment key={k}>{opts}</Fragment>
  })
  return props.children ? (
    <Parent {...parentProps}>{props.children}</Parent>
  ) : (
    <Fragment>{options}</Fragment>
  )
}

LineItemOptions.propTypes = {
  children: PropTypes.func
}

export default LineItemOptions