import produce from 'immer'
import { Action } from 'types'

import * as constants from './constants'

export interface IState {
  loading: boolean
}

const initialState: IState = {
  loading: false
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
    default: break
  }
})