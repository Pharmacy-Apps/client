import React from 'react'

import { IonPopover, IonContent, IonLabel, IonItem, IonIcon, IonItemDivider, IonList } from '@ionic/react'
import { send } from 'ionicons/icons'

import { CCs, getMSISDNFromCCAndSN, parseMTNUGSN } from 'utils/msisdn'

type Props = {
  open: boolean,
  onDismiss: () => void,
  onSubmit: (a: string) => void
}

const inputPlaceholder = '773828707'

class Component extends React.Component<Props> {

  state: {
    sn: string, cc: string, focussed: boolean, errored: boolean
  } = { sn: '', cc: CCs[2].value, focussed: false, errored: false }

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
      this.focusOnInput()
    }
  }

  onInputKeyUp = (e: { keyCode: number }) => {
    if (e.keyCode === 13)
      this.onSubmit()
  }

  input: HTMLInputElement | null = null

  focusOnInput = () => {
    if (this.input)
      this.input.focus()
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
    const { sn, cc } = this.state
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
              <div className="msisdn-modify-section">
                <span>{cc}</span>
                {/* Couldn't use IonInput because it did not work controlled */}
                <input
                  ref={e => this.input = e}
                  value={sn}
                  onKeyUp={this.onInputKeyUp}
                  onChange={this.onInputChange}
                  onFocus={this.onInputFocus}
                  onBlur={this.onInputBlur}
                  placeholder={inputPlaceholder}
                />
              </div>
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

}

export default Component