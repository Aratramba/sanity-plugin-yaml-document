import {nanoid} from 'nanoid'

export const textToPortableText = (text: string) => {
  return [
    {
      _type: 'block',
      _key: nanoid(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: nanoid(),
          text: text,
          marks: [],
        },
      ],
    },
  ]
}
