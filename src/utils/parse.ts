import yaml from 'js-yaml'
import {_stringHelper, _slugHelper, _textHelper, _booleanHelper, _blockHelper} from './helpers'
import {SchemaType, AnyObject, DefinitionObject} from '../../types'

/**
 * Load a string of YAML and return JSON
 */

export const loadYaml = (
  value: string,
  onError: (err: string) => void
): object | string | number | null | undefined => {
  try {
    return yaml.load(value)
  } catch (err: any) {
    onError(err.message)
    return {}
  }
}

/**
 * Create new JSON document ready for import into Sanity
 */

export const generateDocument = async (schema: SchemaType[], dataObj: object): Promise<object> => {
  const definition = getSchemaDefinition(schema, {})
  return parse(definition, dataObj)
}

/*
title: foo
slug: faa
myObject:
  title: foo
  text: faa
  myObject:
    title: foo
    text: faa
*/

const helpersDict = {
  string: _stringHelper,
  slug: _slugHelper,
  text: _textHelper,
  boolean: _booleanHelper,
  block: _blockHelper,
}

export const getSchemaDefinition = (
  schemaType: SchemaType[],
  newObj: DefinitionObject
): DefinitionObject => {
  for (let k in schemaType) {
    const type = schemaType[k]

    if (type.type?.name === 'object' && type.type.fields) {
      newObj[type.name] = getSchemaDefinition(type.type.fields, {})
      return newObj
    }

    if (type?.type) {
      if (type.type?.options?.fromYaml) {
        newObj[type.name] = type.type.options.fromYaml
      } else if (type.type.name in helpersDict) {
        newObj[type.name] = helpersDict[type.type.name]
      }
    }
  }

  return newObj
}

export const parse = async (
  definitionObj: DefinitionObject,
  dataObj: AnyObject,
  newObj: object = {}
) => {
  for (let k in definitionObj) {
    newObj[k] = {}
    if (typeof definitionObj[k] === 'function' && dataObj && dataObj[k]) {
      newObj[k] = await definitionObj[k](dataObj[k])
      if (newObj[k] === null) delete newObj[k]
    } else if (typeof definitionObj[k] === 'object') {
      await parse(definitionObj[k], dataObj[k], newObj[k])
    }
  }
  return clearEmpties(newObj)
}

export const clearEmpties = (obj: any): object => {
  for (var k in obj) {
    if (!obj[k] || typeof obj[k] !== 'object' || Array.isArray(obj[k])) {
      continue
    }
    clearEmpties(obj[k])
    if (Object.keys(obj[k]).length === 0) {
      delete obj[k]
    }
  }
  return obj
}
