interface SchemaField {
  name: string
  type: SchemaType
}

export interface SchemaType {
  name: string
  title?: string
  type?: SchemaType
  to?: SchemaField[]
  fields?: SchemaField[]
  options?: {
    fromYaml?: () => {}
  }
}

export interface SchemaTypeObject {
  [key: string]: SchemaType
}

export interface AnyObject {
  [key: string]: any
}

export interface DefinitionObject {
  [key: string]: (value: string) => DefinitionObject
}

// const a: DefinitionObject = {
//   a: (x) => 'string',
// }
