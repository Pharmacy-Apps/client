export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  text?: string,
  icon?: string,
  component?: () => JSX.Element,
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
  createdAt: number,
  courier?: Courier,
  lat: number,
  lon: number,
  user: {
    _id: string, name: string, phone: string
  }
}

export interface Courier {
  _id: string,
  alias: string,
  name: string,
  phones: Array<string>,
  means: Array<string>,
}