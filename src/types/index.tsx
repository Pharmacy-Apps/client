export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  text?: string,
  icon?: any,
  handler: () => any
}

export interface Item {
  _id: string,
  name: string,
  category: string,
  description: Array<string>,
}

export interface ItemSearchResult {
  _id: string,
  item: Item,
  pharmacy: {
    _id: string, name: string
  },
  price: string,
  distance: string | undefined,
  distanceRaw: number | undefined,
  unit: object
}

export interface ItemRequest {
  _id: string,
  pharmacyItems: Array<{
    item: { _id: string, 'common-name': string, 'scientific-name': string },
    pharmacy: { _id: string, 'name': string },
  }>,
  notes: string,
  state: string,
  createdAt: number
}