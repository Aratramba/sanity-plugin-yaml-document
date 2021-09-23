import React, {useState, useEffect} from 'react'
import {Code} from './Code'
import {generateDocument, loadYaml} from './utils/parse'
import {useDebounce} from './utils/useDebounce'
import {CheckmarkIcon} from '@sanity/icons'
import {Stack, Flex, useToast, Inline, Button, Spinner} from '@sanity/ui'

export const View = ({
  documentId,
  fields,
  doImport,
}: {
  documentId: string
  fields: []
  doImport: (doc: object, cb: (msg: string) => void, onError: (err: string) => void) => {}
}) => {
  const toast = useToast()
  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce(value, 250)
  const [loading, setLoading] = useState<Boolean>(false)
  const [newDocument, setNewDocument] = useState<object>({})
  const [newDocumentJSON, setNewDocumentJSON] = useState<string>('')

  function onChange(value: string) {
    setValue(value)
  }

  useEffect(() => {
    async function parseDefinition(doc: object) {
      setLoading(true)
      const newDoc = await generateDocument(fields, doc)
      setNewDocument(newDoc)
      setLoading(false)
    }

    const doc = loadYaml(value, (err: string) => {
      toast.push({
        status: 'error',
        title: err,
      })
    })

    parseDefinition(doc)
  }, [debouncedValue])

  useEffect(() => {
    setNewDocumentJSON(JSON.stringify(newDocument, null, 2))
  }, [newDocument])

  function onImportClick() {
    doImport(
      newDocument,
      (msg: string) => {
        toast.push({
          status: 'success',
          title: msg,
        })
      },
      (err: string) => {
        toast.push({
          status: 'error',
          title: err,
        })
      }
    )
  }

  return (
    <Stack padding={3} space={3}>
      <Flex>
        <Inline space={3} justify="flex-end">
          {loading && <Spinner />}
          <Button
            text={`Import data`}
            fontSize={2}
            icon={CheckmarkIcon}
            padding={3}
            tone="positive"
            onClick={onImportClick}
            style={{opacity: newDocument ? 1 : 0.5}}
          />
        </Inline>
      </Flex>
      <Code onChange={onChange} />

      <pre>{newDocumentJSON}</pre>
    </Stack>
  )
}
