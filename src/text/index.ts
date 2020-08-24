import TextBase from './base'

type Language = 'en' | 'local'

const language: Language = 'en'

const textTranslated = Object.keys(TextBase).reduce((acc: any, cur) => {
  acc[cur] = Object.keys(TextBase[cur]).reduce((a: any, c) => {
    a[c] = TextBase[cur][c][language]
    return a
  }, {})
  return acc
}, {})

export const Text = textTranslated

export default (page: string) => textTranslated[page]