import app from './app'
import home from './home'
import about from './about'

export type Type = {
  [key: string]: {
    en: string,
    local?: string
  }
}

const text: {
  [category: string]: Type
} = {
  app,
  home,
  about
}

export default text