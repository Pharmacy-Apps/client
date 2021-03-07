import React from 'react'
import { IonContent, IonItem, IonLabel, IonList, IonPage } from '@ionic/react'

import { ItemSearchResult } from 'types'

import { Header, Divider, ImageSlider } from 'components'

import { itemState } from 'utils'
import { formatMoney } from 'utils/currency'

type Props = {
  location: {
    state: ItemSearchResult
  }
}

class Component extends React.Component<Props> {

  title = this.props.location.state.item
    ? this.props.location.state.item.name
    : 'Unknown item'

  render() {

    const { item, price, available } = this.props.location.state || {}

    return <IonPage>
      <Header title={this.title} />
      {item ? <IonContent className="ion-padding">
        <IonList lines="none">
          <IonItem className="ion-margin-bottom">
            <ImageSlider urls={item['icon-urls']} imageStyle={{ height: '50vh' }} />
          </IonItem>
          <IonItem className="ion-no-padding ion-margin-top">
            <IonLabel>
              <h4><b>{formatMoney(price)}</b></h4>
              <h4>{itemState(available)}</h4>
            </IonLabel>
          </IonItem>
          {item.description.length ? <>
            <IonItem className="ion-no-padding">
              <IonLabel><h4>{
                item.description.reduce((a, c) => a ? `${a}. ${c}` : c, '')
              }</h4></IonLabel>
            </IonItem>
            <Divider />
          </> : null}
          {item.specifications && item.specifications.length ? <>
            <IonItem className="ion-no-padding">
              <IonLabel>{
                item.specifications.map(o => <h4>{o}</h4>)
              }</IonLabel>
            </IonItem>
            <Divider />
          </> : null}
          {item.more && item.more.length ? <>
            <IonItem className="ion-no-padding">
              <IonLabel>{
                item.more.map(o => <h4>{o}</h4>)
              }</IonLabel>
            </IonItem>
            <Divider />
          </> : null}
          <IonItem className="ion-no-padding">
            <IonLabel><h4><b>Country of Origin - <span className="ion-text-uppercase">{
              item['country-origin'] || 'Uganda'
            }</span></b></h4></IonLabel>
          </IonItem>
        </IonList>

      </IonContent> : null}
    </IonPage>
  }

}

export default Component
