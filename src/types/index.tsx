export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  component: string | React.Component,
  handler: Function
}

export interface Med {
  _id: string,
  name: string,
}

export interface MedSearchResult {
  _id: string,
  med: Med,
  pharmacy: {
    _id: string, name: string, distance: string | undefined
  },
  price: string,
  unit: object
}