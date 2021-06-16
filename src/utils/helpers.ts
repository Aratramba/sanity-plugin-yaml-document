import {nanoid} from 'nanoid'
import {textToPortableText} from './textToPortableText'
import sanityClient from 'part:@sanity/base/client'
const client = sanityClient.withConfig({apiVersion: '2021-06-10'})

import {slugify} from './slugify'

export const _stringHelper = (value: string) => {
  if (!value) return ''
  return value
}

export const _booleanHelper = (value: string) => {
  if (!value) return false
  return Boolean(value)
}

export const _slugHelper = (value: string) => {
  if (!value) return {current: ''}
  return {current: slugify(value)}
}

export const _textHelper = (value: string) => {
  if (!value.trim().length) return ''
  return value
}

export const _blockHelper = (value: string) => {
  if (!value.trim().length) return textToPortableText('')
  return textToPortableText(value)
}

export const _arrayHelper = (value: []) => {
  if (!value?.filter(Boolean).length) return []

  return value.map((item: string | object) => {
    if (typeof item === 'string') {
      return {
        title: item,
        _key: nanoid(),
      }
    }

    if (typeof item === 'object') {
      return {
        ...item,
        _key: nanoid(),
      }
    }

    return {}
  })
}

type typeWithIdAndTitle = {title: string; _id: string}

export const _chooseFromReferenceHelper = async (value: [], _type: string) => {
  if (!value?.filter(Boolean).length) return []

  const all: typeWithIdAndTitle[] = await client.fetch(`*[_type == "${_type}"] { _id, title }`, {})
  return value.filter(Boolean).map((item: string) => {
    return all
      .filter((refItem: typeWithIdAndTitle) => {
        return item.toLowerCase() === refItem.title.toLowerCase()
      })
      .map((item: typeWithIdAndTitle) => ({
        _key: nanoid(),
        _ref: item._id,
        _type: 'reference',
      }))
  })[0]
}

// export default {
//   title: __stringHelper,
//   intro: __stringHelper,
//   slug: __slugHelper,
//   tabs: {
//     overview: {
//       title: __stringHelper,
//       body: __textHelper,
//       bodyMore: __textHelper,
//     },
//     mentions: {
//       title: __stringHelper,
//       body: __textHelper,
//     },
//     learn: {
//       title: __stringHelper,
//       body: __textHelper,
//     },
//     metadata: {
//       title: __stringHelper,
//       body: __textHelper,
//     },
//   },
//   properties: {
//     link: __stringHelper,
//     intro: __stringHelper,
//     resourceTypes: async (value) => {
//       const result = await __referenceHelper(value, "resource.type");
//       return result;
//     },
//     researchActivities: async (value) => {
//       const result = await __referenceHelper(value, "resource.researchActivity");
//       return result;
//     },
//     researchDomainSpecificActivities: async (value) => {
//       const result = await __referenceHelper(
//         value,
//         "resource.researchDomainSpecificActivity"
//       );
//       return result;
//     },
//     researchDomains: async (value) => {
//       const result = await __referenceHelper(value, "resource.researchDomain");
//       return result;
//     },
//     informationTypes: async (value) => {
//       const result = await __referenceHelper(value, "resource.informationType");
//       return result;
//     },
//     mediaTypes: async (value) => {
//       const result = await __referenceHelper(value, "resource.mediaType");
//       return result;
//     },
//     access: __arrayHelper,
//     version: __arrayHelper,
//     status: async (value) => {
//       const result = await __referenceHelper(value, "resource.status");
//       return result;
//     },
//     languages: __arrayHelper,
//     programmingLanguages: __arrayHelper,
//     standards: async (value) => {
//       const result = await __referenceHelper(value, "resource.standard");
//       return result;
//     },
//     provenance: __arrayHelper,
//     sourceCodeLocation: __arrayHelper,
//     learn: __arrayHelper,
//     community: __arrayHelper,
//     resourceHost: __arrayHelper,
//     resourceOwner: __arrayHelper,
//     development: __arrayHelper,
//     funding: __arrayHelper,
//     generalContact: __arrayHelper,
//     researchContact: __arrayHelper,
//     problemContact: __arrayHelper,
//   },
// };
