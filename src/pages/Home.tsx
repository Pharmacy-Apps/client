import React from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonButton, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/react'
import {
  person,
  bicycle as requestsIcon,
  fitness
} from 'ionicons/icons'

import { Header } from 'components'

import { State as ReducerState } from 'reducers'
import {
  ItemRequest as ItemRequestInterface
} from 'types'

import Requests, { endPoints } from 'requests'

// import { userIsAdmin, userIsClientUser } from 'utils/role'
import { getActiveRequests } from 'utils'
import ItemCategories from 'utils/item-category-map'

import { getDeliveryLocationForNextOrder } from 'location'

export type Props = {
  history: History,
  location: { pathname: string },
  requests: undefined | Array<ItemRequestInterface>,
  setItemRequests: (e: Array<ItemRequestInterface> | null) => {},
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
  hideToast: () => {},
}

const itemCategories = Object.keys(ItemCategories)
  .filter((k, i) => i)
  .map((key: string) =>
    ({ label: ItemCategories[key], value: key })
  )

class Component extends React.Component<Props> {

  state = {
    courierPopoverShown: false,
    requestDetailed: null,
    requestsSelected: [] as Array<String>,
    archivedRequestsShown: false,
    couriers: undefined
  }

  async fetchRequests() {
    const { history, showLoading, hideLoading, showToast } = this.props
    showLoading()
    try {
      const response: Array<ItemRequestInterface> =
        await Requests.get(endPoints['item-requests'])
      if (getActiveRequests(response).length)
        history.replace(Routes.requests.path, { requests: response })
    } catch (err) {
      console.error(err)
      showToast(err.error || err.toString())
    }
    hideLoading()
  }

  async componentDidMount() {
    const defaultRoute = getDefaultRoute()
    if (this.props.location.pathname !== defaultRoute)
      window.location.replace(defaultRoute)
    await this.fetchRequests()
  }

  toolbarActions = () => [{
    icon: requestsIcon,
    handler: () => this.props.history.push(Routes.requests.path)
  }, {
    icon: person,
    handler: () => this.props.history.push(Routes.account.path)
  }]

  onSelectCategory = (category: string) => {
    this.props.history.push(Routes.search.path, { category })
  }

  onChangeDeliveryLocation = () => {
    this.props.history.push(Routes.location.path)
  }

  render() {
    const { lat, lon } = getDeliveryLocationForNextOrder()

    return (
      <IonPage>
        <Header omitsBack actions={this.toolbarActions()} />
        <IonContent>
          <IonList className="ion-no-padding">
            <IonItem lines="none" onClick={this.onChangeDeliveryLocation}>
              <IonLabel>
                <p>Delivery to</p>
                <h3>{`${lat}, ${lon}`}</h3>
              </IonLabel>
              <IonButton onClick={this.onChangeDeliveryLocation} fill="clear">
                <IonIcon src="assets/icon/edit.svg" />
              </IonButton>
            </IonItem>{
              itemCategories.map(({ label, value }, i, a) => (
                <CategoryComponent
                  key={i}
                  lines={i < a.length - 1 ? 'inset' : 'none'}
                  label={label}
                  icon={fitness}
                  onSelect={() => this.onSelectCategory(value)}
                />
              ))
            }</IonList>
        </IonContent>
      </IonPage>
    )
  }

}

const CategoryComponent: React.FC<{
  lines: 'inset' | 'none',
  label: string,
  icon: string,
  onSelect: () => void
}> = ({ lines, label, icon, onSelect }) => (
  <IonItem button onClick={onSelect} lines={lines}>
    <IonIcon slot="start" icon={icon} />
    <IonLabel><h3>{label}</h3></IonLabel>
  </IonItem>
)

const mapStateToProps = (state: ReducerState) => ({
  requests: state.App.requests || undefined
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  setItemRequests: payload => ({
    type: constants.SET_ITEM_REQUESTS,
    payload
  }),
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
  })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Component)
