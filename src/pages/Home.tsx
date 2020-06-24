import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonButton, IonList, IonItem, IonItemDivider, IonLabel, IonIcon } from '@ionic/react'
import { arrowDropdown as down, arrowDropup as up } from 'ionicons/icons'

import { Header, MedRequest } from 'components'
import { MedSearch as SearchPopover, Select as SelectPopover } from 'containers'

import {
  MedSearchResult as MedSearchResultInterface,
  MedRequest as MedRequestInterface
} from 'types'

import Requests, { endPoints } from 'requests'

import eventsInstance, { name as localEventName } from '../events'

export type Props = {
  history: History,
  location: {
    state: { fetchRequests: boolean }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
  hideToast: () => {},
}

const primaryAction = 'Action' // 'Request for Meds'
const placeholderText = 'Lorem ipsum requests lorem ipsum'

class Component extends React.Component<Props> {

  state = {
    requests: undefined,
    searchPopoverShown: false,
    courierPopoverShown: false,
    requestDetailed: null,
    requestsSelected: [] as Array<String>,
    archivedRequestsShown: false
  }

  isAdmin = () => (
    window.location.pathname === Routes.admin.path
  )

  isCourier = () => (
    window.location.pathname === Routes.courier.path
  )

  toolbarActions = () => {
    const { history, showLoading, hideLoading, showToast } = this.props
    const { requestsSelected } = this.state

    const defaultToolbarActions = [{
      component: 'Account',
      handler: () => history.push(Routes.account.path)
    }, {
      component: 'U',
      handler: () => history.replace(Routes.home.path)
    }, {
      component: 'A',
      handler: () => history.replace(Routes.admin.path)
    }, {
      component: 'C',
      handler: () => history.replace(Routes.courier.path)
    }]

    if (requestsSelected.length > 0) {

      const defaultUpdateRequestBody = {
        'med-requests': requestsSelected
      }

      const updateBackend = (body: Object) => {
        showLoading()
        Requests.put(endPoints['med-requests'], {
          ...defaultUpdateRequestBody,
          update: body
        }).then(this.updateRequests).catch(err => {
          console.error(err)
          showToast(err.error || err.toString())
        }).finally(hideLoading)
      }

      switch (window.location.pathname) {
        case Routes.home.path: return [{
          component: 'Mark as Received',
          handler: () => {
            updateBackend({ state: 5 }) // received
          }
        }, {
          component: 'Mark as Cancelled',
          handler: () => {
            updateBackend({ state: 3 }) // cancelled
          }
        }]
        case Routes.courier.path: return [{
          component: 'Mark as Delivered',
          handler: () => {
            updateBackend({ state: 4 }) // delivered
          }
        }]
        case Routes.admin.path: return [{
          component: 'Assign to Courier',
          handler: this.onAssignCourier
        }]
        default: return defaultToolbarActions
      }

    } else {
      return defaultToolbarActions
    }

  }

  /**
   * Reponse ("response"), a result of med request updates from either
   * Axios requests by current user
   * Or events from other user
   * 
   * */
  updateRequests = (response: any) => {
    const { requests = [] as Array<MedRequestInterface> } = this.state
    response.forEach((request: MedRequestInterface) => {
      const index = requests.findIndex(o => o._id === request._id)
      requests[index] = {
        ...requests[index], ...request
      }
    })
    this.setState({ requests, requestsSelected: [] })
  }

  onPrimaryAction = () => {
    this.setState({ searchPopoverShown: true })
  }

  onSelectedMedsReturned = (selectedMeds: MedSearchResultInterface) => {
    this.setState({ searchPopoverShown: false }, () => {
      this.props.history.replace(Routes.order.path, { selectedMeds })
    })
  }

  onSearchPopoverDismiss = () => {
    this.setState({ searchPopoverShown: false })
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

  onCourierSelected = () => {
    this.setState({ courierPopoverShown: false })
  }

  onCourierPopoverDismiss = () => {
    this.setState({ courierPopoverShown: false })
  }

  onArchives = () => {
    const { archivedRequestsShown } = this.state
    this.setState({ archivedRequestsShown: !archivedRequestsShown })
  }

  getActiveRequests = (requests: Array<MedRequestInterface>) => (
    requests.slice(0, 2)
  )

  getArchivedRequests = (requests: Array<MedRequestInterface>) => (
    requests.slice(2)
  )

  fetchRequests() {
    const { showLoading, hideLoading, showToast } = this.props
    showLoading()
    setTimeout(() => {
      Requests.get(endPoints['med-requests']).then((response: any) => {
        this.setState({ requests: response })
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(hideLoading)
    }, 1000)
  }

  componentDidMount() {
    // this.onPrimaryAction()
    this.fetchRequests()

    if (eventsInstance.listenerCount(localEventName) === 0)
      eventsInstance.on(localEventName, this.updateRequests)
  }

  render() {
    const {
      searchPopoverShown,
      courierPopoverShown,
      requests = [],
      requests: requestsReturned,
      requestDetailed,
      requestsSelected,
      archivedRequestsShown
    } = this.state

    const activeRequests = this.getActiveRequests(requests)
    const archivedRequests = this.getArchivedRequests(requests)

    const requestComponent = (item: any, i: number, a: Array<MedRequestInterface>) => (
      <div key={item._id}>
        <IonItem
          button
          onClick={() => this.onRequestTapped(1, item._id)}
          className="request ion-no-padding"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <MedRequest
            item={item}
            detailed={item._id === requestDetailed}
            selected={requestsSelected.includes(item._id)}
            onTap={this.onRequestTapped} />
        </IonItem>
        {i === a.length - 1 ? null : <IonItemDivider style={{ minHeight: 0 }} />}
      </div>
    )

    return (
      <IonPage>
        <Header omitsBack title="Requests" actions={this.toolbarActions()} />
        <IonContent>{
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
          }</div>}
          {requestsReturned ? <div className="ion-padding">
            <IonButton onClick={this.onPrimaryAction} className="ion-no-margin">{primaryAction}</IonButton>
          </div> : null}
          <SearchPopover
            open={searchPopoverShown}
            onDismiss={this.onSearchPopoverDismiss}
            onSubmit={this.onSelectedMedsReturned}
          />
          <SelectPopover
            open={courierPopoverShown}
            onDismiss={this.onCourierPopoverDismiss}
            onSelect={this.onCourierSelected}
          />
        </IonContent>
      </IonPage>
    )
  }

}

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
  })
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
