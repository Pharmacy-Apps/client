export interface Action {
  type: string,
  payload?: any
}

export interface ToolbarAction {
  component: string | React.Component,
  handler: Function
}