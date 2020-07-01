import React from 'react'
import { IonPopover, IonSearchbar, IonList, IonItem, IonButton, IonIcon, IonLabel } from '@ionic/react'
import { send, close } from 'ionicons/icons';

import { ItemSearchResult } from 'components'

import Requests, { endPoints } from 'requests'
import { getSessionLocation as getUserLocation } from 'session'

import { AxiosResponse } from 'axios'
import { ItemSearchResult as ItemSearchResultInterface } from 'types'

export type Props = {
  open: boolean,
  onDismiss: Function,
  onSubmit: Function,
  selectedItems?: Array<ItemSearchResultInterface>
}

type State = {
  items: Array<ItemSearchResultInterface>,
  selectedItems: Array<ItemSearchResultInterface>
}

const actionButtonStyle = {
  marginInlineStart: '16px'
}

function fetchItems(
  search: string,
  onResultsReturned: (value: AxiosResponse<any>) => void
) {
  if (search === '') return
  if (search === null) return

  const { lat, lon } = getUserLocation()
  Requests.get(
    endPoints['item-search'],
    { params: { search, lat, lon } }
  ).then(onResultsReturned).catch(console.error)
}

class Component extends React.Component<Props> {
  state: State = {
    items: [],
    selectedItems: this.props.selectedItems || []
  }

  componentDidUpdate(prevProps: Props) {
    const fetchItems = (
      prevProps.open !== this.props.open &&
      prevProps.open === false
    )
    if (fetchItems) this.fetchItems('*')
  }

  fetchItems = (search: string) => {
    fetchItems(search, response => {
      this.setState({ items: response })
    })
  }

  onSearch = (e: any) => {
    // this.fetchItems(e.target.value)
    // this.props.onSearch(e.target.value)
  }

  onSelect = (result: ItemSearchResultInterface) => {
    const { selectedItems } = this.state
    const index = selectedItems.findIndex(item => item._id === result._id)
    if (index < 0) {
      selectedItems.push(result)
    } else {
      selectedItems.splice(index, 1)
    }
    this.setState({ selectedItems })
  }

  isSelected = (result: ItemSearchResultInterface) => (
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
    const { items, selectedItems } = this.state
    return (
      <IonPopover
        isOpen={open}
        onDidDismiss={this.onDismiss}
        cssClass="popover-search-results"
      >
        <IonList className="ion-no-margin ion-no-padding">
          <IonItem lines="none" className="ion-no-margin ion-no-padding">
            <IonSearchbar className="searchbar ion-no-padding" clearIcon="close-circle" onIonChange={this.onSearch}></IonSearchbar>
            {selectedItems.length ? (
              <IonButton
                onClick={this.onSubmit}
                fill="clear"
                className="ion-no-margin"
                style={actionButtonStyle}
              >
                <IonIcon color="primary" slot="icon-only" icon={send} />
              </IonButton>
            ) : null}
            <IonButton
              onClick={this.onDismiss}
              fill="clear"
              className="ion-no-margin"
              style={selectedItems.length ? {} : actionButtonStyle}
            >
              <IonIcon color="primary" slot="icon-only" icon={close} />
            </IonButton>
          </IonItem>{
            items.length ? items.map((result, i, a) => (
              <ItemSearchResult
                key={i}
                result={result}
                lines={i !== a.length - 1}
                selected={this.isSelected(result)}
                onSelect={this.onSelect} />
            )) : <IonItem lines="none">
                <IonLabel><p>No items found, please try a different search</p></IonLabel>
              </IonItem>
          }</IonList>
      </IonPopover>
    )
  }
}

export default Component