import React from 'react'
import { History } from 'history'

import { IonContent, IonPage, IonInput, IonList, IonItem } from '@ionic/react'
import { Header, MedSearchResult } from 'components'

export type Props = {
  history: History
}

const searchPlaceholder = 'Type a Med' // Try ... panadol

const meds: Object[] = [{}, {}]

class Component extends React.Component<Props> {

  state = { searchStr: null }

  title = () => {
    const { searchStr } = this.state
    const input = <IonInput onIonChange={this.onSearch} value={searchStr} type="text" name="search" autocomplete="off" placeholder={searchPlaceholder} />
    return input
  }

  onSearch = (e: any) => { this.setState({ searchStr: e.target.value }) }

  render() {
    return (
      <IonPage>
        <Header title={this.title()} />
        <IonContent className="ion-padding">
          <IonList lines="full" className="ion-no-margin ion-no-padding">{
            meds.map((med, i, a) => <IonItem key={i} { ...i + 1 === a.length ?  { lines: "none" } : {} }>
              <MedSearchResult index={i} />
            </IonItem>)
          }</IonList>
        </IonContent>
      </IonPage>
    )
  }

}

export default Component
