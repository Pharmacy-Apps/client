import React from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import {
  IonContent, IonPage, IonButton, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/react'
import {
  person,
  bicycle as requestsIcon
} from 'ionicons/icons'

import { Header } from 'components'

import { userIsClientUser, userIsNotClientUser } from 'utils/role'

import { getActiveRequestsPresence } from 'session'
import { getDeliveryLocationForNextOrder } from 'location'

import ItemCategories from 'utils/item-category-map'

export type Props = {
  history: History,
  location: { pathname: string }
}

const itemCategories = Object.keys(ItemCategories)
  .filter((k, i) => i)
  .map((key: string) =>
    ({ ...ItemCategories[key], value: key })
  )

class Component extends React.Component<Props> {

  state = { renderContent: false }

  componentDidMount() {
    const defaultRoute = getDefaultRoute()
    if (this.props.location.pathname !== defaultRoute) {
      window.location.replace(defaultRoute)
      return
    }

    const activeRequestsPresent = (
      userIsClientUser() && getActiveRequestsPresence()
    )

    if (activeRequestsPresent)
      this.props.history.push(Routes.requests.path)
    else if (userIsNotClientUser())
      window.location.replace(Routes.requests.path)
    else
      this.setState({ renderContent: true })
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
      this.state.renderContent ? <IonPage>
        <Header omitsBack actions={this.toolbarActions()} />
        <IonContent>
          <IonList className="ion-no-padding">
            <IonItem lines="none" onClick={this.onChangeDeliveryLocation}>
              <IonLabel>
                <p>Delivery to</p>
                <h3>{lat}, {lon}</h3>
              </IonLabel>
              <IonButton onClick={this.onChangeDeliveryLocation} fill="clear">
                <IonIcon src="assets/icons/edit.svg" />
              </IonButton>
            </IonItem>{
              itemCategories.map(({ icon, label, description, value }, i, a) => (
                <CategoryComponent
                  key={i}
                  lines={i < a.length - 1 ? 'inset' : 'none'}
                  label={label}
                  description={description}
                  icon={icon}
                  onSelect={() => this.onSelectCategory(value)}
                />
              ))
            }</IonList>
        </IonContent>
      </IonPage> : null
    )
  }

}

const CategoryComponent: React.FC<{
  lines: 'inset' | 'none',
  label: string,
  description: string,
  icon: string,
  onSelect: () => void
}> = ({ lines, label, description, icon, onSelect }) => (
  <IonItem button onClick={onSelect} lines={lines}>
    <IonIcon color="primary" slot="start" icon={icon} />
    <IonLabel>
      <h3>{label}</h3>
      <p>{description}</p>
    </IonLabel>
  </IonItem>
)

export default Component
