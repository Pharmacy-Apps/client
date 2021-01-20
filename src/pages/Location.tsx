import React from 'react'
import { History } from 'history'

import { IonContent, IonPage, IonButton, IonSearchbar, IonList, IonItem } from '@ionic/react'

import { Header } from 'components'
import { MapContainer } from 'containers'

import { setDeliveryLocation } from 'session'
import { queryPlace, queryAddress } from 'location'

import { closeSharp, search } from 'ionicons/icons'

import { Location as LocationInterface } from 'types'

const title = 'Deliver to'
const primaryAction = 'Select location'

const actionButtonStyle = {
  position: 'absolute',
  bottom: 0
}

const searchResultsDivStyle: Object = {
  minWidth: 200,
  maxHeight: 'calc(100% - 20px)', // 100% - 2 * top
  overflowY: 'auto',
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

  onPrimaryAction = async () => {
    const { location } = this.state
    if (location) {
      const { lat, lon } = location
      const address = await queryAddress(lat, lon)
      setDeliveryLocation({ lat, lon, address })
    }
    this.props.history.goBack()
  }

  setLocation = (location: LocationInterface) => this.setState({ location })
  setSearchShown = (v: Boolean) => this.setState({ searchShown: v })

  map: google.maps.Map | undefined

  onMapApiLoaded = ({ map }: any) => {
    console.info(map)
    this.map = map
  }

  onSearch = async ({ detail: { value } }: any) => {
    const results = await queryPlace(this.map, value)
    this.setState({ searchText: value, results })
  }

  onPlacesResultClick = (result: any) => {
    this.map && this.map.setCenter(result.geometry.location)
    this.setState({ results: [] })
  }

  onIonCancel = () => this.setState({ searchShown: false, searchText: '', results: [] })

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
      className="searchbar searchbar-location ion-no-padding"
      clearIcon="no-icon"
      showCancelButton="always"
      cancelButtonIcon={closeSharp}
      onIonChange={this.onSearch}
      onIonCancel={this.onIonCancel} />
  )

  render() {

    const { results, searchShown } = this.state

    return (
      <IonPage>
        <Header title={title} actions={this.toolbarActions(searchShown)} />
        <IonContent>
          <MapContainer setLocation={this.setLocation} onMapApiLoaded={this.onMapApiLoaded} />
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
              results.map((result, i) => <IonItem key={i} onClick={
                () => this.onPlacesResultClick(result)
              } button>
                {result.name}
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
