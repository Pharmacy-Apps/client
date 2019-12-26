import produce from 'immer'
import { Action } from 'types'

import * as constants from './constants'

export interface IState {
  loading: boolean,
  toast: string | null
}

const initialState: IState = {
  loading: false,
  toast: null
}

export default (state = initialState, action: Action) => produce(state, (draft: IState) => {
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
    default: break
  }
})