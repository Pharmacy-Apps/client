import React from 'react'

import { IonPopover, IonContent, IonLabel, IonItem, IonIcon, IonItemDivider, IonList } from '@ionic/react'
import { send } from 'ionicons/icons'

import { CCs, getMSISDNFromCCAndSN, parseMTNUGSN } from 'utils/msisdn'

import { PhoneInput } from 'components'

type Props = {
  open: boolean,
  onDismiss: () => void,
  onSubmit: (a: string) => void
}

class Component extends React.Component<Props> {

  state: {
    sn: string, cc: string, focussed: boolean, errored: boolean
  } = { sn: '', cc: CCs.ug.value, focussed: false, errored: false }

  onSelectChange = (e: any) => {
    this.setState({ cc: e.detail.value })
  }

  onSubmit = () => {
    const { cc, sn } = this.state
    try {
      parseMTNUGSN(sn)
      this.props.onSubmit(getMSISDNFromCCAndSN(cc, sn))
      this.setState({ sn: '' })
    } catch (e) {
      this.setState({ errored: true })
    }
  }

  onInputKeyUp = (e: { keyCode: number }) => {
    if (e.keyCode === 13)
      this.onSubmit()
  }

  focusOnInput() {
    const input: any = document.getElementsByClassName('phone-input')[0]
    input && input.focus()
  }

  onInputChange = (e: any) => {
    const value = e.target.value
    if (
      /^[0-9]{1,9}$/.test(value)
    )
      this.setState({ sn: value, errored: false })
  }

  onInputFocus = () => {
    this.setState({ focussed: true })
  }

  onInputBlur = () => {
    this.setState({ focussed: false })
  }

  getItemDividerColor = () => {
    const { focussed, errored } = this.state
    return errored ? 'danger' : (
      focussed ? 'primary' : 'light'
    )
  }

  render() {
    const { open, onDismiss } = this.props
    const { sn } = this.state
    return (
      <IonPopover
        isOpen={open}
        onDidPresent={this.focusOnInput}
        onDidDismiss={onDismiss}
        cssClass="popover-wide"
      >
        <IonContent className="ion-padding">
          <IonLabel>
            <h2>Type new phone number</h2>
            <p style={{ margin: 0 }}>We will use the new phone number for following charges</p>
          </IonLabel>
        </IonContent>
        <IonContent>
          <IonList className="ion-no-padding" lines="none">
            <IonItem style={{ '--min-height': 0 }}>
              <PhoneInput
                value={sn}
                onKeyUp={this.onInputKeyUp}
                onChange={this.onInputChange}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur} />
            </IonItem>
            <IonItemDivider color={this.getItemDividerColor()} style={{ minHeight: 0 }} />
            <IonItem button onClick={this.onSubmit} className="ion-text-center">
              <IonIcon color="primary" icon={send}></IonIcon>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    )
  }

  componentDidUpdate() {
    this.focusOnInput()
  }

}

export default Component
