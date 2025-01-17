import React, { ReactNode } from 'react'
import customMessages from '#utils/customMessages'
import { LineItemCollection } from '@commercelayer/js-sdk'
import { BaseError, ResourceErrorType } from '#typings/errors'

export type AllErrorsParams = {
  allErrors: BaseError[]
  messages: BaseError[]
  field?: string
  props: JSX.IntrinsicElements['span']
  lineItem?: LineItemCollection | Record<string, any>
  resource?: ResourceErrorType
  returnHtml?: boolean
}

export interface GetAllErrors {
  <P extends AllErrorsParams>(params: P): ReactNode
}

const getAllErrors: GetAllErrors = (params) => {
  const {
    allErrors,
    messages,
    field,
    props,
    lineItem,
    resource,
    returnHtml = true,
  } = params
  return allErrors.map((v, k): ReactNode | void => {
    const objMsg = customMessages(messages, v)
    const text = objMsg?.message || v.message
    if (field) {
      if (v.resource === 'lineItem') {
        if (lineItem && v.id === lineItem['id']) {
          return returnHtml ? (
            <span key={k} {...props}>
              {text}
            </span>
          ) : (
            text
          )
        }
      }
      if (field === v.field && resource === v.resource) {
        return returnHtml ? (
          <span key={k} {...props}>
            {text}
          </span>
        ) : (
          text
        )
      }
    }
    if (resource === v.resource && !field) {
      return returnHtml ? (
        <span key={k} {...props}>
          {text}
        </span>
      ) : (
        text
      )
    }
  })
}

export default getAllErrors
