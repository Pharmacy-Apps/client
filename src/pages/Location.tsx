import React from 'react'
import { History } from 'history'

import { IonContent, IonPage, IonButton, IonSearchbar, IonList, IonItem } from '@ionic/react'

import { Header } from 'components'
import { MapContainer } from 'containers'

import { setDeliveryLocation } from 'session'
import { findPlace } from 'location'

import { search, closeCircleSharp } from 'ionicons/icons'

import { Location as LocationInterface } from 'types'

const title = 'Deliver to'
const primaryAction = 'Select location'

const actionButtonStyle = {
  position: 'absolute',
  bottom: 0
}

const searchResultsDivStyle: Object = {
  minWidth: 200,
  position: 'absolute',
  top: 10,
  right: 10,
  boxShadow: '0 0 5px 0 rgba(0, 0, 0, .8)'
}

class Component extends React.Component<{ history: History }> {

  state: {
    searchText: string,
    location: LocationInterface | null,
    searchShown: Boolean,
    results: Array<any>
  } = {
      searchText: '',
      location: null,
      searchShown: false,
      results: []
    }

  onPrimaryAction = () => {
    const { location } = this.state
    if (location) setDeliveryLocation(location)
    this.props.history.goBack()
  }

  setLocation = (location: LocationInterface) => this.setState({ location })
  setSearchShown = (v: Boolean) => this.setState({ searchShown: v })

  onSearch = async ({ detail: { value } }: any) => {
    const results = await findPlace(value)
    this.setState({ searchText: value, results })
  }

  onIonCancel = () => this.setState({ searchShown: false, searchText: '', results: [] })

  onIonBlur = () => this.setState({ results: [] })

  toolbarActions = (searchShown: Boolean) => searchShown ? [{
    component: this.searchComponent,
    handler: () => { }
  }] : [{
    icon: search,
    handler: () => this.setSearchShown(true)
  }]

  searchRef: any = null

  searchComponent = () => (
    <IonSearchbar
      ref={node => this.searchRef = node}
      style={{
        '--cancel-button-color': 'var(--ion-color-primary)',
        '--icon-color': 'var(--ion-color-primary)',
        '--color': 'var(--ion-color-primary)'
      }}
      value={this.state.searchText}
      placeholder=""
      className="searchbar ion-no-padding"
      showCancelButton="always"
      cancelButtonIcon={closeCircleSharp}
      onIonChange={this.onSearch}
      onIonCancel={this.onIonCancel}
      onIonBlur={this.onIonBlur} />
  )

  render() {

    const { results, searchShown } = this.state

    return (
      <IonPage>
        <Header title={title} actions={this.toolbarActions(searchShown)} />
        <IonContent>
          <MapContainer setLocation={this.setLocation} />
          <IonButton
            onClick={this.onPrimaryAction}
            className="ion-margin ion-action-primary"
            style={actionButtonStyle}
          >{primaryAction}</IonButton>
          <div style={{
            ...searchResultsDivStyle,
            visibility: results.length ? 'visible' : 'hidden'
          }}>
            <IonList lines="none" className="ion-no-padding">{
              results.map((result, i) => <IonItem key={i} button>
                {result}
              </IonItem>)
            }</IonList>
          </div>
        </IonContent>
      </IonPage>
    )

  }

  componentDidUpdate() {
    if (this.searchRef)
      this.searchRef.setFocus()
  }

}

export default Component
