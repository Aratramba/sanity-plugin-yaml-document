import React, {useRef} from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'

export const Code = ({onChange}) => {
  const codemirrorRef = useRef(null)

  React.useEffect(() => {
    codemirrorRef.current.editor.display.wrapper.style.height = '30vh'
  }, [codemirrorRef])

  return (
    <CodeMirror
      ref={codemirrorRef}
      value=""
      options={{
        mode: 'yaml',
        theme: 'material',
        lineNumbers: true,
        indentWithTabs: false,
        indentUnit: 2,
      }}
      onChange={(editor, data, value) => onChange(value)}
    />
  )
}
