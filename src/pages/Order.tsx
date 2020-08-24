import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent,
  IonPage,
  IonList, IonItem, IonLabel, IonButton, IonText, IonItemDivider, IonIcon
} from '@ionic/react'

import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

import { Header } from 'components'
import { updateCurrentPosition, getDeliveryLocationForNextOrder } from 'location'

import { ItemSearchResult as ItemSearchResultInterface } from 'types'
import { getAddress } from 'utils'

type Props = {
  history: History,
  location: {
    state: { selectedItems: Array<ItemSearchResultInterface> }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
  hideToast: () => {},
}

type State = {
  orderConfirmationShown: boolean,
  selectedItems: Array<ItemSearchResultInterface>,
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

function computeOrderCostAndDistance(items: Array<ItemSearchResultInterface>) {
  return items.reduce((acc, { price, distanceRaw = 0 }) => {
    acc.cost = acc.cost + parseInt(price)
    acc.distance = acc.distance + distanceRaw / 2
    return acc
  }, { cost: 0, distance: 0 })
}

class Component extends React.Component<Props> {
  selectedItems = this.props.location.state
    ? this.props.location.state.selectedItems || []
    : []

  state: State = {
    orderConfirmationShown: false,
    selectedItems: this.selectedItems,
    ...computeOrderCostAndDistance(this.selectedItems)
  }

  handleRemoveItem = (id: string) => {
    const { selectedItems } = this.state
    const index = selectedItems.findIndex(item => item._id === id)
    selectedItems.splice(index, 1)
    this.setState({
      selectedItems,
      ...computeOrderCostAndDistance(selectedItems)
    })
  }

  handleAddItem = () => {
    const { selectedItems } = this.state
    this.props.history.replace(Routes.search.path, { selectedItems })
  }

  locationNotAvailable = () => {
    let { lat, lon } = getDeliveryLocationForNextOrder()
    return lat === undefined || lon === undefined
  }

  onSelectDestination = async () => {
    let { lat, lon } = getDeliveryLocationForNextOrder()
    this.props.history.push(
      Routes.location.path,
      lat && lon ? { lat, lon } : undefined
    )
  }

  updateLocation = async () => {
    const { showToast, hideToast } = this.props
    hideToast()
    try {
      const result = await updateCurrentPosition()
      this.forceUpdate()
      return result
    } catch (error) {
      console.error(error)
      showToast(this.locationInfo().locationInfo3)
    }
  }

  locationInfo = () => {
    const { lat, lon } = getDeliveryLocationForNextOrder()

    const locationInfo1 = getAddress(lat, lon, 'Not known')
    const locationInfo2 = 'Select Destination'
    const locationInfo3 =
      `We could not find your location\nPlease ensure the following then click the "Tap to update location" button\n- You are connected to internet\n- When asked, you allow access your location`

    return {
      locationInfo1,
      locationInfo2,
      locationInfo3
    }
  }

  onPrimaryAction = () => {
    const { selectedItems } = this.state
    this.props.history.push(Routes.pay.path, { selectedItems })
  }

  render() {
    const {
      cost,
      distance
    } = this.state

    const locationNotAvailable = this.locationNotAvailable()

    return (
      <IonPage className="order">
        <Header title="Order" />
        <IonContent>
          <IonList lines="full">
            <IonItem>
              <IonLabel>
                <p>Items</p>
                <IonList className="ion-no-margin ion-no-padding">{
                  this.state.selectedItems.map(({ _id, item }) => (
                    <IonItem key={_id} lines="none" className="ion-no-padding mini-list-item">
                      <IonText slot="start"><h4>{item.name}</h4></IonText>
                      {/* ion-grid, ion-toolbar don't work, try table */}
                      <IonButton onClick={() => this.handleRemoveItem(_id)} slot="end" fill="clear" style={ionButtonStyle}>
                        <IonIcon slot="icon-only" icon={removeCircleOutline} />
                      </IonButton>
                    </IonItem>
                  ))
                }<IonItem lines="none" className="ion-no-padding mini-list-item">
                    <IonButton onClick={this.handleAddItem} slot="end" fill="clear" style={ionButtonStyle}>
                      <IonIcon slot="icon-only" icon={addCircleOutline} />
                    </IonButton>
                  </IonItem>
                </IonList>
                <Divider />
                <IonList className="ion-no-margin ion-no-padding">
                  <IonItem lines="none" className="ion-no-margin ion-no-padding"
                    style={{ '--min-height': '25px' }}>
                    <IonLabel className="ion-no-margin" slot="start"><p>Cost</p></IonLabel>
                    <IonText slot="end"><h4>UGX {cost}</h4></IonText>
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
            <IonItem button onClick={this.onSelectDestination}>{
              locationNotAvailable ? <IonLabel className="ion-text-wrap">
                <h4>{this.locationInfo().locationInfo2}</h4>
              </IonLabel> : <IonLabel className="ion-text-wrap">
                  <p>Delivery to</p>
                  <IonText color="secondary"><h4>{
                    this.locationInfo().locationInfo1
                  }</h4></IonText>
                </IonLabel>
            }</IonItem>
            <IonItem lines="none">
              <IonButton onClick={this.onPrimaryAction} disabled={locationNotAvailable} className="ion-margin-top" size="default">{primaryAction}</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

// export type OrderConfirmationProps = {
//   open: boolean,
//   bill: string,
//   onConfirm: () => void
//   afterDismiss: () => void
// }
// const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
//   open,
//   bill,
//   onConfirm,
//   afterDismiss
// }) => (
//     <IonAlert
//       isOpen={open}
//       onDidDismiss={afterDismiss}
//       header="Bill"
//       message={`Alert message UGX ${bill}`}
//       buttons={[
//         {
//           text: 'Okay',
//           handler: onConfirm
//         },
//         'Cancel'
//       ]}
//     />
//   )

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
  hideToast: () => ({
    type: constants.HIDE_TOAST
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
