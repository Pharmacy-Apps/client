export const languages = [
  { label: 'English', value: 'en' },
  { label: 'Luganda', value: 'lu', disabled: true, description: 'Coming soon' }
]

const storageKey = 'lang'

export const setLanguage = (language: string) => {
  localStorage.setItem(storageKey, language)
}

export const getLanguage = () => localStorage.getItem(storageKey)
