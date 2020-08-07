import React from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonButton, IonList, IonItem, IonItemDivider, IonLabel, IonIcon,
  IonRefresher, IonRefresherContent
} from '@ionic/react'
import { RefresherEventDetail } from '@ionic/core'
import { chevronDown as down, chevronUp as up, person } from 'ionicons/icons'

import { Header, ItemRequest } from 'components'
import { Select as SelectPopover } from 'containers'

import { State as ReducerState } from 'reducers'
import {
  ItemRequest as ItemRequestInterface,
  Courier as CourierInterface
} from 'types'

import Requests, { endPoints } from 'requests'

import eventsInstance, {
  requestCreate as requestCreateAction,
  requestUpdate as requestUpdateAction,
  syncData as syncDataAction
} from '../events'

import { userIsAdmin, userIsClientUser } from 'utils/role'

export type Props = {
  history: History,
  location: {
    state: { fetchRequests: boolean }, pathname: string
  },
  requests: undefined | Array<ItemRequestInterface>,
  setItemRequests: (e: Array<ItemRequestInterface> | null) => {},
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
  hideToast: () => {},
}

const primaryAction = 'Action' // 'Request for Items'
const placeholderText = 'Lorem ipsum requests lorem ipsum'

const archivedRequestStates: Array<String> = ['cancelled', 'received']

class Component extends React.Component<Props> {

  state = {
    courierPopoverShown: false,
    requestDetailed: null,
    requestsSelected: [] as Array<String>,
    archivedRequestsShown: false,
    couriers: undefined
  }

  defaultUpdateRequestBody = () => ({
    'item-requests': this.state.requestsSelected
  })

  toolbarActions = () => {
    const { history, showLoading, hideLoading, showToast } = this.props
    const { requestsSelected } = this.state

    const defaultToolbarActions = [{
      icon: person,
      handler: () => history.push(Routes.account.path)
    }]

    if (requestsSelected.length > 0) {

      const updateBackend = (body: Object) => {
        showLoading()
        Requests.put(endPoints['item-requests'], {
          ...this.defaultUpdateRequestBody(),
          update: body
        }).then(this.updateRequests).catch(err => {
          console.error(err)
          showToast(err.error || err.toString())
        }).finally(hideLoading)
      }

      switch (window.location.pathname) {
        case Routes.home.path: return [{
          text: 'Mark as Received',
          handler: () => {
            updateBackend({ state: 5 }) // received
          }
        }, {
          text: 'Cancel',
          handler: () => {
            updateBackend({ state: 3 }) // cancelled
          }
        }]
        case Routes.courier.path: return [{
          text: 'Mark as Delivered',
          handler: () => {
            updateBackend({ state: 4 }) // delivered
          }
        }]
        case Routes.admin.path: return [{
          text: 'Assign to Courier',
          handler: this.onAssignCourier
        }]
        default: return defaultToolbarActions
      }

    } else {
      return defaultToolbarActions
    }

  }

  /**
   * Reponse ("response"), a result of item request updates from either
   * Axios requests by current user
   * Or events from other user
   * 
   * */
  updateRequests = (response: any, prependRequests?: true) => {
    let {
      requests = [],
      showToast, hideToast, setItemRequests
    } = this.props
    if (prependRequests) {
      requests = response.concat(requests)
    } else {
      response.forEach((request: ItemRequestInterface) => {
        const index = requests.findIndex(o => o._id === request._id)
        requests[index] = {
          ...requests[index], ...request
        }
      })
    }
    hideToast()
    setItemRequests(requests)
    this.setState({ requestsSelected: [] }, () => {
      const requestsArchived = response.filter(
        ({ state }: ItemRequestInterface) => archivedRequestStates.includes(state)
      )
      if (requestsArchived.length) setTimeout(() => {
        showToast(`${requestsArchived.length} ${
          requestsArchived.length > 1 ? 'requests' : 'request'
          } archived`)
      }, 400)
    })
  }

  onPrimaryAction = () => {
    this.props.history.push(Routes.search.path)
  }

  onRequestTapped = (position: Number, request: String) => {
    const { requestDetailed, requestsSelected } = this.state
    if (position > 0) {
      this.setState({ requestDetailed: request === requestDetailed ? null : request })
    } else {
      const index = requestsSelected.indexOf(request)
      if (index < 0) {
        requestsSelected.push(request)
      } else
        requestsSelected.splice(index, 1)
      this.setState({ requestsSelected })
    }
  }

  onAssignCourier = () => {
    this.setState({ courierPopoverShown: true })
  }

  onCourierSelected = (courier: string) => {
    this.setState({ courierPopoverShown: false }, () => {
      const { showLoading, hideLoading, showToast } = this.props
      showLoading()
      Requests.put(endPoints['item-requests'], {
        ...this.defaultUpdateRequestBody(),
        update: { courier, state: 2 }
      }).then(this.updateRequests).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(hideLoading)
    })
  }

  onCourierPopoverDismiss = () => {
    if (this.state.courierPopoverShown)
      this.setState({ courierPopoverShown: false })
  }

  onArchives = () => {
    const { archivedRequestsShown } = this.state
    this.setState({ archivedRequestsShown: !archivedRequestsShown })
  }

  getActiveRequests = (requests: Array<ItemRequestInterface>) => (
    requests.filter(({ state }) => archivedRequestStates.indexOf(state) < 0)
  )

  getArchivedRequests = (requests: Array<ItemRequestInterface>) => (
    requests.filter(({ state }) => archivedRequestStates.indexOf(state) > -1)
  )

  syncRequestData = (event?: CustomEvent<RefresherEventDetail>) => {
    this.fetchRequests(false, () => {
      event && event.detail.complete()
    })
  }

  fetchRequests(animate: boolean = true, cb?: Function) {
    const { showLoading, hideLoading, showToast, setItemRequests } = this.props
    if (animate) showLoading()
    Requests.get(endPoints['item-requests']).then((response: any) => {
      setItemRequests(response)
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(() => {
      hideLoading()
      cb && cb()
    })
  }

  fetchCouriers() {
    const { showToast } = this.props
    Requests.get(endPoints['couriers']).then((response: any) => {
      this.setState({
        couriers: response.map((o: CourierInterface) => ({
          label: o.name,
          value: o._id
        }))
      })
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    })
  }

  componentDidMount() {
    const defaultRoute = getDefaultRoute()
    if (this.props.location.pathname !== defaultRoute) {
      window.location.replace(defaultRoute)
      return
    }
    // this.onPrimaryAction()
    this.fetchRequests()
    if (userIsAdmin()) this.fetchCouriers()
    this.setEventListeners()
  }

  setEventListeners = () => {
    eventsInstance.removeAllListeners()
    const fn = (result: Array<ItemRequestInterface>) => {
      this.updateRequests(result, true)
    }
    eventsInstance.on(requestCreateAction, fn)
    eventsInstance.on(requestUpdateAction, this.updateRequests)
    eventsInstance.on(syncDataAction, this.syncRequestData)
  }

  render() {
    const {
      courierPopoverShown,
      requestDetailed,
      requestsSelected,
      archivedRequestsShown,
      couriers = [],
    } = this.state

    const {
      requests = [],
      requests: requestsReturned
    } = this.props

    const activeRequests = this.getActiveRequests(requests)
    const archivedRequests = this.getArchivedRequests(requests)

    const selectModeOn = requestsSelected.length > 0

    const requestComponent = (item: any, i: number, a: Array<ItemRequestInterface>) => (
      <div key={item._id}>
        <IonItem
          button
          onClick={() => this.onRequestTapped(1, item._id)}
          className={`request ${selectModeOn ? 'select-mode' : ''} ion-no-padding`}
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <ItemRequest
            item={item}
            detailed={item._id === requestDetailed}
            selected={requestsSelected.includes(item._id)}
            selectMode={selectModeOn}
            onTap={this.onRequestTapped} />
        </IonItem>
        {i === a.length - 1 ? null : <IonItemDivider style={{ minHeight: 0 }} />}
      </div>
    )

    return (
      <IonPage>
        <Header omitsBack title="Requests" actions={this.toolbarActions()} />
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={this.syncRequestData}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {
            requests.length ? <IonList
              style={{ paddingTop: 0, paddingBottom: 0 }}
              lines="none"
            >
              {activeRequests.map(requestComponent)}
              {archivedRequests.length ? <IonItem
                button
                onClick={this.onArchives}
                className="ion-item-archive"
                lines="none"
              >
                <IonLabel className="ion-no-margin ion-text-center">
                  <p>Archived</p>
                </IonLabel>
                <IonIcon className="ion-no-margin" icon={
                  archivedRequestsShown ? up : down
                } slot="end"></IonIcon>
              </IonItem> : null}
              {archivedRequestsShown ? archivedRequests.map(requestComponent) : null}
            </IonList> : <div className="ion-padding">{
              placeholderText
            }</div>
          }
          {userIsClientUser() && requestsReturned ? <div className="ion-padding">
            <IonButton onClick={this.onPrimaryAction} className="ion-no-margin">{primaryAction}</IonButton>
          </div> : null}
          <SelectPopover
            open={courierPopoverShown}
            items={couriers}
            onDismiss={this.onCourierPopoverDismiss}
            onSelect={this.onCourierSelected}
          />
        </IonContent>
      </IonPage>
    )
  }

}

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
