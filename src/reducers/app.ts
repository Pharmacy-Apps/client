import produce from 'immer'
import { Action, ItemRequest, ItemSearchResult } from 'types'

import * as constants from './constants'

export interface State {
  loading: boolean,
  toast: string | null,
  requests: Array<ItemRequest> | null,
  items: Array<ItemSearchResult> | null
}

const initialState: State = {
  loading: false,
  toast: null,
  requests: null,
  items: null
}

export default (state = initialState, action: Action) => produce(state, (draft: State) => {
  switch (action.type) {
    case constants.SHOW_LOADING: {
      draft.loading = true
      break
    }
    case constants.HIDE_LOADING: {
      draft.loading = false
      break
    }
    case constants.SHOW_TOAST: {
      draft.toast = action.payload
      break
    }
    case constants.HIDE_TOAST: {
      draft.toast = null
      break
    }
    case constants.SET_ITEM_REQUESTS: {
      draft.requests = action.payload
      break
    }
    case constants.SET_ITEMS: {
      draft.items = action.payload
      break
    }
    default: break
  }
})