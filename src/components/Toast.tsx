import React from 'react'
import { IonToast } from '@ionic/react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'
import { IState } from 'reducers'

export type Props = {
  open: boolean,
  message: string | null,
  hideToast: Function
}

const Component: React.FC<Props> = ({ open, message, hideToast }) => (
  <IonToast
    isOpen={open}
    onDidDismiss={() => hideToast()}
    message={message || ''}
    position="top"
    buttons={[
      {
        text: 'Close',
        role: 'cancel',
        handler: () => hideToast()
      }
    ]}
  />
)

const mapStateToProps = (state: IState) => ({
  open: Boolean(state.App.toast),
  message: state.App.toast
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  hideToast: () => ({
    type: constants.HIDE_TOAST
  })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Component)