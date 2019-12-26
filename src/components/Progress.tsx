import React from 'react'
import { IonLoading } from '@ionic/react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'
import { IState } from 'reducers'

export type Props = {
  open: boolean,
  message?: string,
  hideLoading: Function
}

const Component: React.FC<Props> = ({ open, message, hideLoading }) => (
  <IonLoading
    isOpen={open}
    message={message}
    onDidDismiss={() => hideLoading()}
  />
)

Component.defaultProps = { message: 'Please wait' }

const mapStateToProps = (state: IState) => ({
  open: state.App.loading
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  hideLoading: () => ({
    type: constants.HIDE_LOADING
  })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Component)