import React, { Dispatch, SetStateAction, useState } from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent,
  IonPage,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput
} from '@ionic/react'

import { addCircleOutline, removeCircleOutline, pencilOutline, close, send } from 'ionicons/icons';

import { Header, Popover, Alert as OrderConfirmationAlert } from 'components'
import { setActiveRequestsPresence } from 'session'
import { getDeliveryLocationForNextOrder, getDeliveryAddressForNextOrder } from 'location'

import { ItemSearchResult as ItemSearchResultInterface } from 'types'
import { deliveryCost, computeOrderCostAndDistance } from 'utils/charges'
import { formatMoney } from 'utils/currency'

import Requests, { endPoints } from 'requests'

import { AlertText } from 'pages/Pay'

type Props = {
  history: History | any,
  location: {
    state: { selectedItems: Array<ItemSearchResultInterface> }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
  hideToast: () => {},
}

type State = {
  quantityModifyItem: string | null,
  orderConfirmationShown: boolean,
  selectedItems: Array<ItemSearchResultInterface>,
  cost: number,
  distance: number
}

const ionButtonStyle = {
  'width': '20px',
  'height': '20px',
  'marginInlineStart': '2px',
  'marginInlineEnd': 0,
  '--padding-start': '2px',
  '--padding-end': 0,
  '--padding-top': '2px',
  '--padding-bottom': '2px'
}

const costTextStyle = {
  'marginInlineStart': 0,
  'marginInlineEnd': '10px'
}

const title = 'Your order' // 'Order'
const primaryAction = 'Order now' // 'Pay'

const alertText = AlertText.confirmation()

class Component extends React.Component<Props> {

  getInitialSelectedItems = () => {
    const selectedItems = this.props.location.state
      ? this.props.location.state.selectedItems || []
      : []
    return selectedItems.map(e => {
      if (e.quantity) return e
      return { ...e, quantity: 1 }
    })
  }

  selectedItems = this.getInitialSelectedItems()

  state: State = {
    quantityModifyItem: null,
    orderConfirmationShown: false,
    selectedItems: this.selectedItems,
    ...computeOrderCostAndDistance(this.selectedItems)
  }

  onRemoveItem = (id: string) => {
    const { selectedItems } = this.state
    const index = selectedItems.findIndex(item => item._id === id)
    selectedItems.splice(index, 1)
    this.setState({
      selectedItems,
      ...computeOrderCostAndDistance(selectedItems)
    })
  }

  onAddItem = () => {
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

  locationInfo = () => {
    const locationInfo1 = getDeliveryAddressForNextOrder() || 'Not known'
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
    // const { selectedItems } = this.state
    // this.props.history.push(Routes.pay.path, { selectedItems })
    this.setOrderConfirmationVisibility(true)
  }

  onConfirmOrder = () => {
    const { showLoading, hideLoading, showToast, location } = this.props
    const { lat, lon, address } = getDeliveryLocationForNextOrder()

    const payload = {
      'pharmacy-items': location.state.selectedItems.map(o => ({
        item: o._id, quantity: o.quantity
      })),
      'notes': '',
      lat,
      lon,
      address
    }
    showLoading()
    Requests.post(endPoints['item-requests'], payload).then((response: any) => {
      if (response.error) {
        console.error('Payment errored', response.error) // Show alert
        showToast(response.error)
      } else {
        setActiveRequestsPresence(true)
        window.location.replace(Routes.home.path)
      }
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
  }

  setOrderConfirmationVisibility =
    (v: boolean) => this.setState({ orderConfirmationShown: v })

  onQtyPopoverPresented = () => {
    const e: HTMLIonInputElement | null = document.querySelector('ion-popover ion-input')
    e && e.setFocus()
  }

  onQtyChangeSubmitted = (quantity: string) => {
    if (Number(quantity) > Number.MAX_SAFE_INTEGER) return
    const { quantityModifyItem, selectedItems } = this.state
    const newSelectedItems = selectedItems.map(e => {
      if (e._id === quantityModifyItem && parseInt(quantity))
        e.quantity = parseInt(quantity)
      return e
    })
    this.setState({
      selectedItems: newSelectedItems,
      ...computeOrderCostAndDistance(newSelectedItems),
      quantityModifyItem: null // dismiss quantity popover
    }, () => {
      this.props.history.location.state = { selectedItems: newSelectedItems }
    })
  }

  onQtyModify = (searchResultId: string) => {
    this.setState({ quantityModifyItem: searchResultId })
  }

  render() {
    const {
      cost,
      orderConfirmationShown,
      quantityModifyItem,
      selectedItems
    } = this.state

    const locationNotAvailable = this.locationNotAvailable()

    const { item: { name: item } } =
      selectedItems.find(({ _id }) => _id === quantityModifyItem) ||
      { item: { name: null } }

    return (
      <IonPage className="order">
        <Header title={title} />
        <IonContent>
          <IonList lines="full">
            <IonItem>
              <IonLabel>
                <p>Items</p>
                <IonList className="ion-no-margin ion-no-padding">{
                  this.state.selectedItems.map(({ _id, item, price, quantity }) => (
                    <IonItem key={_id} lines="none" className="ion-no-padding mini-list-item">
                      <h4>{item.name}</h4>
                      {/* ion-grid, ion-toolbar don't work, try table */}
                      <h4 slot="end" style={costTextStyle} className="flex ion-align-items-center">
                        {quantity}&nbsp;
                        <IonIcon style={{ fontSize: 12 }} icon={close} />&nbsp;
                        {formatMoney(price)}
                      </h4>
                      <IonButton onClick={() => this.onQtyModify(_id)} slot="end" fill="clear" style={ionButtonStyle}>
                        <IonIcon className="ion-icon-secondary" icon={pencilOutline} />
                      </IonButton>
                      <IonButton onClick={() => this.onRemoveItem(_id)} slot="end" fill="clear" style={ionButtonStyle}>
                        <IonIcon className="ion-icon-secondary" icon={removeCircleOutline} />
                      </IonButton>
                    </IonItem>
                  ))
                }<IonItem lines="none" className="ion-no-padding mini-list-item">
                    <IonButton onClick={this.onAddItem} slot="end" fill="clear" style={ionButtonStyle}>
                      <IonIcon className="ion-icon-secondary" icon={addCircleOutline} />
                    </IonButton>
                  </IonItem>
                </IonList>
                <IonList className="ion-no-margin ion-no-padding">
                  <IonItem lines="none" className="ion-no-padding mini-list-item"
                    style={{ '--min-height': '25px' }}>
                    <IonLabel className="ion-no-margin ion-text-uppercase ion-label-primary">
                      <h4>Total</h4>
                    </IonLabel>
                    <h4 className="ion-label-primary" slot="end">{formatMoney(cost)}</h4>
                  </IonItem>
                  <IonItem lines="none" className="ion-no-margin ion-no-padding mini-list-item"
                    style={{ '--min-height': '15px' }}>
                    <IonLabel className="ion-no-margin" slot="start">
                      <p>Delivery fee</p>
                    </IonLabel>
                    <h4 slot="end">{formatMoney(deliveryCost)}</h4>
                  </IonItem></IonList>
              </IonLabel>
            </IonItem>
            {/* Location change option */}
            <IonItem button onClick={this.onSelectDestination}>{
              locationNotAvailable ? <IonLabel className="ion-text-wrap">
                <h4>{this.locationInfo().locationInfo2}</h4>
              </IonLabel> : <IonLabel className="ion-text-wrap">
                  <p>Delivery to</p>
                  <h4 className="ion-label-primary">{
                    this.locationInfo().locationInfo1
                  }</h4>
                </IonLabel>
            }</IonItem>
            <IonItem lines="none">
              <IonButton onClick={this.onPrimaryAction} disabled={locationNotAvailable} className="ion-margin-top ion-action-primary" size="default">{primaryAction}</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
        <Popover
          open={Boolean(quantityModifyItem)}
          onPresent={this.onQtyPopoverPresented}
          cssClass="popover-wide"
        >
          <ItemQuantity
            item={item}
            onSubmit={this.onQtyChangeSubmitted}
          />
        </Popover>
        <OrderConfirmationAlert
          open={orderConfirmationShown}
          header={alertText.header}
          message={alertText.message}
          buttonText={alertText.buttonText}
          onConfirm={this.onConfirmOrder}
          onDismiss={() => this.setOrderConfirmationVisibility(false)}
        />
      </IonPage>
    )
  }
}

type ItemQuantityProps = {
  item: string | null,
  onSubmit: (e: string) => void
}

const ItemQuantity: React.FC<ItemQuantityProps> = ({
  item,
  onSubmit
}) => {

  const [value, setValue]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState('')

  return (
    <IonList className="ion-no-padding">
      <IonItem lines="none">
        <IonLabel>
          <h2 className="ion-text-wrap ion-label-primary">Type new quantity for {item}</h2>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonInput
          placeholder="for example 2"
          onIonChange={e => setValue(`${e.detail.value}`)}
          type="number" name="quantity" min="1"
        />
      </IonItem>
      <IonItem button onClick={() => onSubmit(value)}>
        <IonIcon className="ion-icon-primary" icon={send}></IonIcon>
      </IonItem>
    </IonList>
  )
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
