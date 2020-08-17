import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { State as ReducerState } from 'reducers'

import {
  IonPage, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonFabButton, IonFab, IonIcon
} from '@ionic/react'
import { send } from 'ionicons/icons'

import { Header, ItemSearchResult } from 'components'

import Requests, { endPoints } from 'requests'
import { getDeliveryLocationForNextOrder } from 'location'

import { ItemSearchResult as ItemSearchResultInterface, ToolbarAction } from 'types'

import ItemCategoryMap from 'utils/item-category-map'

export type Props = {
  history: History,
  location: {
    state: { selectedItems: Array<ItemSearchResultInterface>, category: string }
  },
  selectedItems?: Array<ItemSearchResultInterface>,
  items: Array<ItemSearchResultInterface> | undefined,
  setItems: (e: Array<ItemSearchResultInterface> | null) => {},
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {}
}

type State = {
  selectedItems: Array<ItemSearchResultInterface>,
  selectedCategory: string
}

const searchPlaceholder = 'search'
const noItemsPlaceholder = 'No items found, please try a different search'

const itemCategories = Object.keys(ItemCategoryMap).map((key: string) => ({
  label: ItemCategoryMap[key].label,
  value: key
}))

class Component extends React.Component<Props> {
  selectedItems = this.props.location.state
    ? this.props.location.state.selectedItems || []
    : []
  selectedCategory = this.props.location.state
    ? this.props.location.state.category
    : null

  state: State = {
    selectedItems: this.selectedItems,
    selectedCategory: this.selectedCategory || itemCategories[0].value
  }

  componentDidMount() {
    const { items: itemsReturned } = this.props
    if (itemsReturned) return
    this.fetchItems('*')
  }

  fetchItems = (search: string) => {
    if (search === '') return
    if (search === null) return

    const { lat, lon } = getDeliveryLocationForNextOrder()
    const { setItems, showLoading, hideLoading, showToast } = this.props

    showLoading()
    Requests.get(
      endPoints['item-search'],
      { params: { search, lat, lon } }
    ).then((response: any) => {
      setItems(response)
    }).catch((err) => {
      showToast(err.error || err.toString())
      console.error(err)
    }).finally(hideLoading)
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
    this.props.history.replace(Routes.order.path, { selectedItems })
  }

  onCategorySelected = (category: string) => {
    this.setState({ selectedCategory: category })
  }

  toolbarActions = () => {
    const { selectedCategory } = this.state
    const toolbarActions: Array<ToolbarAction> = [{
      component: () => (
        <>
          <IonSelect
            interfaceOptions={{ showBackdrop: false }}
            interface="popover"
            onIonChange={({ detail: { value } }: any) => this.onCategorySelected(value)}
            value={selectedCategory}
          >
            {
              itemCategories.map(({ label, value }, i, a) => (
                <IonSelectOption key={i} className={
                  i < a.length - 1 ? '' : 'last'
                } value={value}>{label}</IonSelectOption>
              ))
            }
          </IonSelect>
        </>
      ),
      handler: () => { }
    }]
    return toolbarActions
  }

  title = () => (
    <IonSearchbar /* color="primary" */ placeholder={searchPlaceholder} className="searchbar ion-no-padding" clearIcon="close-circle" onIonChange={() => { }} />
  )

  computeItemsShown = () => {
    const { items = [] } = this.props
    const { selectedCategory } = this.state
    return selectedCategory !== itemCategories[0].value
      ? items.filter(({ item: { category } }) => (
        category === selectedCategory
      ))
      : items
  }

  render() {
    const items = this.computeItemsShown()
    const itemsReturned = Boolean(items)
    return (
      <IonPage className="search">
        <Header title={this.title()} actions={this.toolbarActions()} />
        <IonContent class="popover-search-results">
          <IonList className="ion-no-margin ion-no-padding">{
            items.length ? items.map((result, i, a) => (
              <ItemSearchResult
                key={i}
                result={result}
                lines={i !== a.length - 1}
                selected={this.isSelected(result)}
                onSelect={this.onSelect} />
            )) : (
                itemsReturned && items.length === 0
                  ? <IonItem lines="none">
                    <IonLabel><p>{noItemsPlaceholder}</p></IonLabel>
                  </IonItem>
                  : null
              )
          }</IonList>
          {this.state.selectedItems.length ? (
            <IonFab className="ion-margin" vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={this.onSubmit} color="light">
                <IonIcon color="primary" icon={send} />
              </IonFabButton>
            </IonFab>
          ) : null}
        </IonContent>
      </IonPage>
    )
  }
}

const mapStateToProps = (state: ReducerState) => ({
  items: state.App.items || undefined
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  setItems: payload => ({
    type: constants.SET_ITEMS,
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
  })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Component)
