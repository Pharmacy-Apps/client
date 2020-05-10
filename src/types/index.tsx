export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  component: string | React.Component,
  handler: Function
}

export interface MedSearchResult {
  med: { _id: string, name: string },
  pharmacy: {
    _id: string, name: string, distance: string | undefined
  },
  price: string,
  unit: object
}