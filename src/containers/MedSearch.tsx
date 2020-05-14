import React from 'react'
import { IonPopover, IonSearchbar, IonList, IonItem, IonButton, IonIcon } from '@ionic/react'
import { send } from 'ionicons/icons';

import { MedSearchResult } from 'components'

import Requests, { endPoints } from 'requests'
import { getSessionLocation as getUserLocation } from 'session'

import { AxiosResponse } from 'axios'
import { MedSearchResult as MedSearchResultInterface } from 'types'

export type Props = {
  open: boolean,
  onDismiss: Function,
  onSubmit: Function,
  selectedItems?: MedSearchResultInterface[]
}

type State = {
  meds: MedSearchResultInterface[],
  selectedItems: MedSearchResultInterface[]
}

function fetchMeds(
  search: string,
  onResultsReturned: (value: AxiosResponse<any>) => void
) {
  if (search === '') return
  if (search === null) return

  const { lat, lon } = getUserLocation()
  Requests.get(
    endPoints['med-search'],
    { params: { search, lat, lon } }
  ).then(onResultsReturned).catch(console.error)
}

class Component extends React.Component<Props> {
  state: State = {
    meds: [],
    selectedItems: this.props.selectedItems || []
  }

  componentDidUpdate(prevProps: Props) {
    const fetchMeds = (
      prevProps.open !== this.props.open &&
      prevProps.open === false
    )
    if (fetchMeds) this.fetchMeds('*')
  }

  fetchMeds = (search: string) => {
    fetchMeds(search, response => {
      this.setState({ meds: response })
    })
  }

  onSearch = (e: any) => {
    this.fetchMeds(e.target.value)
    // this.props.onSearch(e.target.value)
  }

  onSelect = (result: MedSearchResultInterface) => {
    const { selectedItems } = this.state
    const index = selectedItems.findIndex(item => item._id === result._id)
    if (index < 0) {
      selectedItems.push(result)
    } else {
      selectedItems.splice(index, 1)
    }
    this.setState({ selectedItems })
  }

  isSelected = (result: MedSearchResultInterface) => (
    this.state.selectedItems.findIndex(item => item._id === result._id) > -1
  )

  onSubmit = () => {
    const { selectedItems } = this.state
    this.props.onSubmit(selectedItems)
  }

  onDismiss = () => {
    this.props.onDismiss()
  }

  render() {
    const { open } = this.props
    return (
      <IonPopover
        isOpen={open}
        onDidDismiss={this.onDismiss}
        cssClass="popover-search-results"
      >
        <IonList className="ion-no-margin ion-no-padding">
          <IonItem lines="full" className="ion-no-margin ion-no-padding">
            <IonSearchbar onIonChange={e => e.detail.value}></IonSearchbar>
            <IonButton onClick={this.onSubmit} slot="end" fill="clear">
              <IonIcon slot="icon-only" icon={send} />
            </IonButton>
          </IonItem>{
          this.state.meds.map((result, i, a) => (
            <MedSearchResult
              key={i}
              result={result}
              lines={i !== a.length - 1}
              selected={this.isSelected(result)}
              onSelect={this.onSelect} />
          ))
        }</IonList>
      </IonPopover>
    )
  }
}

export default Component