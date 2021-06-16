import React from 'react'
import {View} from './View'
import {studioTheme, ThemeProvider} from '@sanity/ui'
import sanityClient from 'part:@sanity/base/client'
const client = sanityClient.withConfig({apiVersion: '2021-06-10'})

import {
  _stringHelper,
  _slugHelper,
  _textHelper,
  _arrayHelper,
  _chooseFromReferenceHelper,
} from './utils/helpers'

const Plugin = ({
  schemaType,
  documentId,
  document,
}: {
  schemaType: {fields: []}
  documentId: string
  document: object
}) => {
  function saveDocument(doc: object, cb: (msg: string) => {}, onError: (err: string) => {}) {
    client
      .patch(document?.displayed?._id)
      .set(doc)
      .commit()
      .then(() => {
        if (cb) cb('Document updated')
      })
      .catch((err: Error) => {
        if (err) onError(err.message)
      })
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <View documentId={documentId} fields={schemaType.fields} doImport={saveDocument} />
    </ThemeProvider>
  )
}

export default Plugin

export const stringHelper = _stringHelper
export const slugHelper = _slugHelper
export const textHelper = _textHelper
export const arrayHelper = _arrayHelper
export const chooseFromReferenceHelper = _chooseFromReferenceHelper
