import app from './app'
import home from './home'

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
  home
}

export default text