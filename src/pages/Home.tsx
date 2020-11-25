import React, { useState } from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import {
  IonContent, IonPage, IonList,
  IonItem, IonLabel, IonIcon,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonRippleEffect
} from '@ionic/react'
import {
  person,
  bicycle as requestsIcon,
  locationSharp as locationIcon,
  ellipsisVertical as more
} from 'ionicons/icons'

import { Header, Menu } from 'components'

import { userIsClientUser, userIsNotClientUser } from 'utils/role'

import { getActiveRequestsPresence } from 'session'
import { getDeliveryLocationForNextOrder } from 'location'

import { getAddress } from 'utils'

import ItemCategories from 'utils/item-category-map'
import getPageText from 'text'

export type Props = {
  history: History,
  location: { pathname: string }
}

const Text = getPageText('home')

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
  }, {
    icon: more,
    handler: (event: any) => this.menuRef.open({ target: event.target })
  }]

  onSelectCategory = (category: string) => {
    this.props.history.push(Routes.search.path, { category })
  }

  onChangeDeliveryLocation = () => {
    this.props.history.push(Routes.location.path)
  }

  menuRef: any

  menuActions = () => [
    {
      text: 'About Us',
      handler: () => this.props.history.push(Routes.about.path)
    },
    /* How it works, FAQs, Contacts */
    { text: 'Key Partners', handler: () => null },
    /* List partners with some description */
    { text: 'Terms & Conditions', handler: () => this.props.history.push(Routes.tcs.path) }
    /* Terms of operation, Privacy policy */
  ]

  render() {
    const { lat, lon } = getDeliveryLocationForNextOrder()
    return (
      this.state.renderContent ? <IonPage>
        <Header omitsBack actions={this.toolbarActions()} />
        <Menu
          setRef={(node: any) => this.menuRef = node}
          actions={this.menuActions()}
        />
        <IonContent>
          <IonList className="ion-no-padding">
            <IonItem className="ion-margin-bottom" lines="none" onClick={this.onChangeDeliveryLocation} button>
              <IonIcon slot="start" icon={locationIcon} className="ion-icon-primary" size="large" />
              <IonLabel>
                <p>{Text['delivery-to']}</p>
                <h3 className="ion-label-primary">{getAddress(lat, lon)}</h3>
              </IonLabel>
            </IonItem>
            <IonListHeader lines="full">
              <IonLabel><h3>{Text['category-header']}</h3></IonLabel>
            </IonListHeader>
            <IonGrid>
              <IonRow>
                {
                  itemCategories.map(({ icon, label, description, value }) => (
                    <IonCol
                      key={value}
                      className="ion-no-padding"
                      sizeXs="12"
                      sizeSm="6"
                      sizeMd="6"
                      sizeLg="4"
                    >
                      <div className="fill-height ion-padding">
                        <CategoryComponent
                          key={value}
                          label={label}
                          description={description}
                          icon={icon}
                          onSelect={() => this.onSelectCategory(value)}
                        />
                      </div>
                    </IonCol>
                  ))
                }
              </IonRow>
            </IonGrid>
          </IonList>
        </IonContent>
      </IonPage> : null
    )
  }

}

const categoryImageStyle: Object = {
  width: '100%',
  height: '250px',
  objectFit: 'cover'
}

const placeholderImageUrl = '/assets/icons/no-icon.svg'

const CategoryComponent: React.FC<{
  label: string,
  description: string,
  icon: string,
  onSelect: () => void
}> = ({ label, description, icon, onSelect }) => {

  const [imageUrl, setUrl] = useState(icon)
  const onError = () => setUrl(placeholderImageUrl)

  const [loaded, setLoaded] = useState(false)
  const onLoad = () => setLoaded(true)

  return <div onClick={onSelect} className="item-category fill-height ion-activatable">
    <img style={{
      ...categoryImageStyle,
      opacity: loaded ? 1 : 0,
      transition: 'opacity 1s'
    }} src={imageUrl} onLoad={onLoad} onError={onError} alt="" />
    <div className="ion-padding">
      <IonLabel>
        <h3 className="ion-label-primary">{label}</h3>
        {/* <p>{description}</p> */}
      </IonLabel>
    </div>
    <IonRippleEffect />
  </div>

}

export default Component
