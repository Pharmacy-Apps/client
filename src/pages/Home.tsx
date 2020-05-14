import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { IonContent, IonPage, IonButton } from '@ionic/react'
import { Header } from 'components'
import { MedSearch as SearchPopover } from 'containers'

import { MedSearchResult as MedSearchResultInterface } from 'types'

export type Props = {
  history: History
}

const primaryAction = 'Action' // 'Request for Meds'
const placeholderText = 'Lorem ipsum requests lorem ipsum'

const requests = []

class Component extends React.Component<Props> {

  state = {
    searchPopoverShown: false
  }

  toolbarActions = () => {
    const { history } = this.props
    return [{
      component: 'Account',
      handler: () => history.push(Routes.account.path)
    }]
  }

  onPrimaryAction = () => {
    this.setState({ searchPopoverShown: true })
  }

  onSelectedMedsReturned = (selectedMeds: MedSearchResultInterface) => {
    this.setState({ searchPopoverShown: false }, () => {
      this.props.history.push(Routes.order.path, { selectedMeds })
    })
  }

  onSearchPopoverDismiss = () => {
    this.setState({ searchPopoverShown: false })
  }

  componentDidMount() { this.onPrimaryAction() }

  componentWillMount() { /* Fetch old requests */ }

  render() {
    const { searchPopoverShown } = this.state
    return (
      <IonPage>
        <Header omitsBack title="Requests" actions={this.toolbarActions()} />
        {<IonContent>
          {requests.length ? <div className="ion-padding">
            Requests
          </div> : <div className="ion-padding">{
              placeholderText
            }</div>}
          <div className="ion-padding">
            <IonButton onClick={this.onPrimaryAction} className="ion-no-margin">{primaryAction}</IonButton>
          </div>
          <SearchPopover
            open={searchPopoverShown}
            onDismiss={this.onSearchPopoverDismiss}
            onSubmit={this.onSelectedMedsReturned}
          />
        </IonContent>}
      </IonPage>
    )
  }

}

export default Component
