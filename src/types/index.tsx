export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  text?: string,
  icon?: any,
  handler: () => any
}

export interface Med {
  _id: string,
  name: string,
}

export interface MedSearchResult {
  _id: string,
  med: Med,
  pharmacy: {
    _id: string, name: string
  },
  price: string,
  distance: string | undefined,
  distanceRaw: number | undefined,
  unit: object
}

export interface MedRequest {
  _id: string,
  pharmacyMeds: Array<{
    med: { _id: string, 'common-name': string, 'scientific-name': string },
    pharmacy: { _id: string, 'name': string },
  }>,
  notes: string,
  state: string,
  createdAt: number
}