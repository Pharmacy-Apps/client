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
import { ItemSearch as SearchPopover } from 'containers'
import { ItemSearchResult as ItemSearchResultInterface } from 'types'

import Requests, { endPoints } from 'requests'

import { updateCurrentPosition } from 'location'
import { getSessionLocation } from 'session'

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
  searchPopoverShown: boolean,
  orderConfirmationShown: boolean,
  selectedItems: Array<ItemSearchResultInterface>,
  cost: number,
  distance: number,
  showLocationInfo: boolean
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
    ? this.props.location.state.selectedItems
    : []

  state: State = {
    searchPopoverShown: false,
    orderConfirmationShown: false,
    selectedItems: this.selectedItems,
    ...computeOrderCostAndDistance(this.selectedItems),
    showLocationInfo: false
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
    this.setState({ searchPopoverShown: true })
  }

  onSelectedItemsReturned = (selectedItems: Array<ItemSearchResultInterface>) => {
    this.setState({
      searchPopoverShown: false,
      selectedItems,
      ...computeOrderCostAndDistance(selectedItems)
    })
  }

  onSearchPopoverDismiss = () => {
    this.setState({ searchPopoverShown: false })
  }

  onPrimaryAction = async () => {
    const { showToast } = this.props
    if (this.locationNotAvailable()) {
      showToast(this.locationInfo().locationInfo3)
    } else {
      const { orderConfirmationShown } = this.state
      if (orderConfirmationShown === false) {
        this.setState({ orderConfirmationShown: true })
      }
    }
  }

  locationNotAvailable = () => {
    let { lat, lon } = getSessionLocation()
    return lat === undefined || lon === undefined
  }

  updateLocation = () => {
    const { showToast, hideToast } = this.props
    hideToast()
    if (this.locationNotAvailable()) {
      this.setState({ showLocationInfo: true }, () => {
        setTimeout(async () => {
          try {
            const result = await updateCurrentPosition()
            this.forceUpdate()
            return result
          } catch (error) {
            console.error(error)
            showToast(this.locationInfo().locationInfo4)
          }
        }, 500)
      })
    }
  }

  locationInfo = () => {
    const { lat, lon } = getSessionLocation()

    const locationInfo1 = 'Your location is needed so we can make a delivery'
    const locationInfo2 = lat && lon
      ? `Your location, ${lat}, ${lon}`
      : 'Tap to update location'
    const locationInfo3 = 'Please update your location'
    const locationInfo4 =
      `We could not find your location\nPlease ensure the following then click the "Tap to update location" button\n- You are connected to internet\n- When asked, you allow access your location`

    return {
      locationInfo1,
      locationInfo2,
      locationInfo3,
      locationInfo4
    }
  }

  componentWillMount() {
    this.updateLocation() // Ensure location is available
  }

  onOrderConfirmation = () => {
    const { showLoading, hideLoading, showToast } = this.props
    const { lat, lon } = getSessionLocation()
    const payload = {
      'pharmacy-items': this.state.selectedItems.map(o => o._id),
      'notes': '',
      lat, lon
    }
    showLoading()
    setTimeout(() => {
      Requests.post(endPoints['item-requests'], payload).then((response: any) => {
        if (response.error) {
          const { selectedItems } = this.state
          this.props.history.push(Routes.credit.path, { selectedItems })
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
      selectedItems,
      cost, distance, showLocationInfo
    } = this.state

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
            {showLocationInfo ? <IonItem button onClick={this.updateLocation}>
              <IonLabel className="ion-text-wrap">
                <p>{this.locationInfo().locationInfo1}</p>
                <IonText color="secondary"><h4>{
                  this.locationInfo().locationInfo2
                }</h4></IonText>
              </IonLabel>
            </IonItem> : null}

            <IonItem lines="none">
              <IonButton className="ion-margin-top" size="default" onClick={this.onPrimaryAction}>{primaryAction}</IonButton>
            </IonItem>
          </IonList>
          <SearchPopover
            open={searchPopoverShown}
            onDismiss={this.onSearchPopoverDismiss}
            onSubmit={this.onSelectedItemsReturned}
            selectedItems={selectedItems}
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
  hideToast: () => ({
    type: constants.HIDE_TOAST
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
