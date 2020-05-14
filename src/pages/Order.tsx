import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent,
  IonPage,
  IonList, IonItem, IonLabel, IonButton, IonText, IonItemDivider, IonIcon,
  IonAlert
} from '@ionic/react'

import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

import { Header } from 'components'
import { MedSearch as SearchPopover } from 'containers'
import { MedSearchResult as MedSearchResultInterface } from 'types'

export type Props = {
  history: History,
  location: {
    state: { selectedMeds: Array<MedSearchResultInterface> }
  },
  showLoading: Function,
  hideLoading: Function,
}

type State = {
  searchPopoverShown: boolean,
  orderConfirmationShown: boolean,
  selectedMeds: Array<MedSearchResultInterface>
}

const ionButtonStyle = {
  'width': '20px',
  'height': '20px',
  '--padding-start': '1px',
  '--padding-end': '1px',
  '--padding-top': '1px',
  '--padding-bottom': '1px'
}

class Component extends React.Component<Props> {
  state: State = {
    searchPopoverShown: false,
    orderConfirmationShown: false,
    selectedMeds: this.props.location.state.selectedMeds
  }

  handleRemoveMed = (id: string) => {
    const { selectedMeds } = this.state
    const index = selectedMeds.findIndex(med => med._id === id)
    selectedMeds.splice(index, 1)
    this.setState({ selectedMeds })
  }

  handleAddMed = () => {
    this.setState({ searchPopoverShown: true })
  }

  onSelectedMedsReturned = (selectedMeds: MedSearchResultInterface) => {
    this.setState({ searchPopoverShown: false, selectedMeds })
  }

  onSearchPopoverDismiss = () => {
    this.setState({ searchPopoverShown: false })
  }

  onPrimaryAction = () => {
    const { orderConfirmationShown } = this.state
    if (orderConfirmationShown === false) {
      this.setState({ orderConfirmationShown: true })
    }
  }

  onOrderConfirmation = () => {
    this.fakeRequest(
      (hideLoading: Function) => {
        hideLoading()
        const errored = true
        
        if (errored) {
          const { selectedMeds } = this.state
          this.props.history.replace(Routes.credit.path, { selectedMeds })
        } else
          this.props.history.replace(Routes.home.path)
      }
    )
  }

  fakeRequest(cb: Function) {
    const { showLoading, hideLoading } = this.props
    showLoading()
    setTimeout(() => cb(hideLoading), 1500)
  }

  onOrderConfirmationDismiss = () =>
    this.setState({ orderConfirmationShown: false })

  render() {
    const { searchPopoverShown, selectedMeds, orderConfirmationShown } = this.state
    return (
      <IonPage className="order">
        <Header title="Order" />
        <IonContent>
          <IonList lines="full">
            <IonItem>
              <IonLabel>
                <p>Medicines</p>
                <IonList className="ion-no-margin ion-no-padding">{
                  this.state.selectedMeds.map(({ _id, med }) => (
                    <IonItem key={_id} lines="none" className="ion-no-padding mini-list-item">
                      <IonText slot="start"><h4>{med.name}</h4></IonText>
                      {/* ion-grid, ion-toolbar don't work, try table */}
                      <IonButton onClick={() => this.handleRemoveMed(_id)} slot="end" fill="clear" style={ionButtonStyle}>
                        <IonIcon slot="icon-only" icon={removeCircleOutline} />
                      </IonButton>
                    </IonItem>
                  ))
                }<IonItem lines="none" className="ion-no-padding mini-list-item">
                    <IonButton onClick={this.handleAddMed} slot="end" fill="clear" style={ionButtonStyle}>
                      <IonIcon slot="icon-only" icon={addCircleOutline} />
                    </IonButton>
                  </IonItem>
                </IonList>
                <Divider />
                <IonList className="ion-no-margin ion-no-padding">
                  <IonItem lines="none" className="ion-no-margin ion-no-padding"
                    style={{ '--min-height': '25px' }}>
                    <IonText slot="start"><h4>Cost</h4></IonText>
                    <IonText slot="end"><h4>300 credits</h4></IonText>
                  </IonItem>
                  <IonItem lines="none" className="ion-no-padding"
                    style={{ '--min-height': '25px' }}>
                    <IonText slot="start"><h4>Travel Distance</h4></IonText>
                    <IonText slot="end"><h4>300m</h4></IonText>
                  </IonItem>
                </IonList>
              </IonLabel>
            </IonItem>

            <IonItem button>
              <IonLabel className="ion-text-wrap">
                <p>Lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum</p>
                <IonText color="secondary"><h4>Secondary</h4></IonText>
              </IonLabel>
            </IonItem>

            <IonItem lines="none">
              <IonButton onClick={this.onPrimaryAction}>Primary</IonButton>
            </IonItem>
          </IonList>
          <SearchPopover
            open={searchPopoverShown}
            onDismiss={this.onSearchPopoverDismiss}
            onSubmit={this.onSelectedMedsReturned}
            selectedItems={selectedMeds}
          />
          <OrderConfirmation
            open={orderConfirmationShown}
            bill="50 credits"
            onConfirm={this.onOrderConfirmation}
            afterDismiss={this.onOrderConfirmationDismiss} />
        </IonContent>
      </IonPage>
    )
  }
}

export type OrderConfirmationProps = {
  open: boolean,
  bill: string,
  onConfirm: () => void
  afterDismiss: () => void
}
const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  open,
  bill,
  onConfirm,
  afterDismiss
}) => (
  <IonAlert
    isOpen={open}
    onDidDismiss={afterDismiss}
    header="Bill"
    message={`Alert message ${bill}`}
    buttons={[
      {
        text: 'Okay',
        handler: onConfirm
      },
      'Cancel'
    ]}
  />
)

type DividerProps = {
  text?: string
}
const Divider: React.FC<DividerProps> = ({ text }) => (
  <IonItemDivider className="mini-divider">{text}</IonItemDivider>
)

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  showLoading: () => ({
    type: constants.SHOW_LOADING
  }),
  hideLoading: () => ({
    type: constants.HIDE_LOADING
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
