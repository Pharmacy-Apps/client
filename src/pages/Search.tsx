import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { State as ReducerState } from 'reducers'

import { IonPage, IonContent, IonSearchbar, IonList, IonItem, IonButton, IonIcon, IonLabel, IonSelect, IonSelectOption } from '@ionic/react'
import { send, ellipsisHorizontal } from 'ionicons/icons'

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
  label: ItemCategoryMap[key],
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
    let selectRef: any = null
    let buttonRef: any = null
    const defaultToolbarActions: Array<ToolbarAction> = [{
      component: () => (
        <>
          <IonButton
            ref={node => buttonRef = node}
            className="button-select-filter"
          ><IonIcon icon={ellipsisHorizontal} /></IonButton>
          <IonSelect
            ref={node => selectRef = node}
            interfaceOptions={{ showBackdrop: false }}
            interface="popover"
            onIonChange={({ detail: { value } }: any) => this.onCategorySelected(value)}
            value={selectedCategory}
            className="select-filter"
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
      handler: () => {
        selectRef && selectRef.open({ target: buttonRef })
      }
    }]
    return this.state.selectedItems.length ? [{
      icon: send,
      handler: this.onSubmit
    }, ...defaultToolbarActions] : defaultToolbarActions
  }

  title = () => (
    <IonSearchbar /* color="primary" */ placeholder={searchPlaceholder} className="searchbar ion-no-padding" clearIcon="close-circle" onIonChange={() => { }}></IonSearchbar>
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
