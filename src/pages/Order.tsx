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

import Requests, { endPoints } from 'requests'

type Props = {
  history: History,
  location: {
    state: { selectedMeds: Array<MedSearchResultInterface> }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

type State = {
  searchPopoverShown: boolean,
  orderConfirmationShown: boolean,
  selectedMeds: Array<MedSearchResultInterface>,
  cost: number,
  distance: number
}

const ionButtonStyle = {
  'width': '20px',
  'height': '20px',
  '--padding-start': '1px',
  '--padding-end': '1px',
  '--padding-top': '1px',
  '--padding-bottom': '1px'
}

const primaryAction = 'Action'

function computeOrderCostAndDistance(meds: Array<MedSearchResultInterface>) {
  return meds.reduce((acc, { price, distanceRaw = 0 }) => {
    acc.cost = acc.cost + parseInt(price)
    acc.distance = acc.distance + distanceRaw / 2
    return acc
  }, { cost: 0, distance: 0 })
}

class Component extends React.Component<Props> {
  selectedMeds = this.props.location.state
    ? this.props.location.state.selectedMeds
    : []

  state: State = {
    searchPopoverShown: false,
    orderConfirmationShown: false,
    selectedMeds: this.selectedMeds,
    ...computeOrderCostAndDistance(this.selectedMeds)
  }

  handleRemoveMed = (id: string) => {
    const { selectedMeds } = this.state
    const index = selectedMeds.findIndex(med => med._id === id)
    selectedMeds.splice(index, 1)
    this.setState({
      selectedMeds,
      ...computeOrderCostAndDistance(selectedMeds)
    })
  }

  handleAddMed = () => {
    this.setState({ searchPopoverShown: true })
  }

  onSelectedMedsReturned = (selectedMeds: Array<MedSearchResultInterface>) => {
    this.setState({
      searchPopoverShown: false,
      selectedMeds,
      ...computeOrderCostAndDistance(selectedMeds)
    })
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
    const { showLoading, hideLoading, showToast } = this.props
    const payload = {
      'pharmacy-meds': this.state.selectedMeds.map(o => o._id),
      'notes': ''
    }
    showLoading()
    setTimeout(() => {
      Requests.post(endPoints['med-requests'], payload).then((response: any) => {
        console.info(response)
        const errored = false
        if (errored) {
          const { selectedMeds } = this.state
          this.props.history.push(Routes.credit.path, { selectedMeds })
        } else
          this.props.history.replace(Routes.home.path)
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(hideLoading)
    }, 1000)
  }

  onOrderConfirmationDismiss = () =>
    this.setState({ orderConfirmationShown: false })

  render() {
    const {
      searchPopoverShown,
      orderConfirmationShown,
      selectedMeds,
      cost, distance
    } = this.state
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
                    <IonLabel className="ion-no-margin" slot="start"><p>Cost</p></IonLabel>
                    <IonText slot="end"><h4>{`${cost} credits`}</h4></IonText>
                  </IonItem>{
                    distance
                      ? <IonItem lines="none" className="ion-no-padding"
                        style={{ '--min-height': '15px' }}>
                        <IonLabel className="ion-no-margin" slot="start"><p>Travel Distance</p></IonLabel>
                        <IonText slot="end"><h4>{`${distance}m`}</h4></IonText>
                      </IonItem>
                      : null
                  }</IonList>
              </IonLabel>
            </IonItem>

            {/* Location change option */}
            {/* <IonItem button>
              <IonLabel className="ion-text-wrap">
                <p>Lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum delivery lorem ipsum</p>
                <IonText color="secondary"><h4>Secondary</h4></IonText>
              </IonLabel>
            </IonItem> */}

            <IonItem lines="none">
              <IonButton className="ion-margin-top" size="default" onClick={this.onPrimaryAction}>{primaryAction}</IonButton>
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
            bill={`${cost}`}
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
      message={`Alert message ${bill} credits`}
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
  showToast: (payload: string) => ({
    type: constants.SHOW_TOAST,
    payload
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
