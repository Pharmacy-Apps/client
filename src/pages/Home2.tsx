import React from 'react'
import { History } from 'history'

import { IonContent, IonPage, IonInput, IonList } from '@ionic/react'
import { Header, MedSearchResult } from 'components'

import Requests, { endPoints } from 'requests'
import { getSessionLocation as getUserLocation } from 'session'

export type Props = {
  history: History
}

const searchPlaceholder = 'Search' // Try ... panadol

class Component extends React.Component<Props> {

  state = { searchStr: null, meds: [] }

  title = () => {
    const { searchStr } = this.state
    const input = <IonInput onIonChange={this.onSearch} value={searchStr} type="text" name="search" autocomplete="off" placeholder={searchPlaceholder} />
    return input
  }

  fetchMeds(search: string | null = this.state.searchStr) {
    if (search === '') return
    if (search === null) return

    const { lat, lon } = getUserLocation()
    Requests.get(
      endPoints['med-search'],
      { params: { search, lat, lon } }
    ).then((response: any) => {
      this.setState({ meds: response })
    }).catch(console.error)
  }

  onSearch = (e: any) => {
    this.setState({ searchStr: e.target.value }, this.fetchMeds)
  }

  componentWillMount() {
    this.fetchMeds('*')
  }

  render() {
    const { meds } = this.state
    return (
      <IonPage>
        <Header title={this.title()} />
        <IonContent className="ion-no-padding">
          <IonList lines="full" className="ion-no-margin ion-no-padding">{
            meds.map((med, i, a) => (
              <MedSearchResult key={i} result={med} lines={i !== a.length - 1} />
            ))
          }</IonList>
        </IonContent>
      </IonPage>
    )
  }

}

export default Component
