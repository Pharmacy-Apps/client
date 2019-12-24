import { combineReducers } from 'redux'
import { Action } from 'types'

import App, { IState as IAppState } from './app'

export interface IState {
  App: IAppState
}

export default (state: IState | undefined, action: Action) => combineReducers({
  App
})(state, action)