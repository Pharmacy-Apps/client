import React from 'react'
import Moment from 'moment'
import { IonLabel, IonIcon, IonText } from '@ionic/react'

import { squareOutline as numb, checkbox as active } from 'ionicons/icons'

import { ItemRequest } from 'types'
import { userIsAdmin, userIsPharmacyOperator } from 'utils/role'

Moment.updateLocale('en', {
  relativeTime: {
    past: '%s',
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy'
  }
})

type Props = {
  item: ItemRequest,
  detailed: boolean,
  selected: boolean,
  selectMode: boolean,
  onTap: Function
}

const Component: React.FC<Props> = ({
  item: { _id, pharmacyItems, state, createdAt, courier, lat, lon, user },
  detailed,
  selected,
  selectMode,
  onTap
}) => {
  const onClick = (position: Number, item: String, event: any) => {
    event.stopPropagation()
    onTap(position, item)
  }

  const userCanViewRequestClient = userIsPharmacyOperator() || userIsAdmin()

  return (
    <>
      <IonIcon
        color="primary"
        icon={
          selectMode ? (
            selected ? active : numb
          ) : 'no-icon'
        }
        slot="start"
        onClick={e => onClick(0, _id, e)}
        className="ion-no-margin" />
      <IonText className="ion-padding-vertical ellipses" onClick={e => onClick(1, _id, e)}>
        <IonLabel className="ion-no-margin spaced">
          <h2 className={
            detailed ? 'ion-text-wrap' : 'ellipses'
          }>
            {
              pharmacyItems.map((o, i) => (i > 0 ? ', ' : '') + (
                o.item['common-name'] || o.item['scientific-name']
              ))
            }
          </h2>
          <p>{state}</p>
          {detailed ? <>
            {(
              lat !== undefined &&
              lon !== undefined
            ) ? <p>Delivery at {`${lat}, ${lon}`}</p> : null}
            {userCanViewRequestClient
              ? <p>Client - {user.name || user.phone}</p>
              : null}
            {courier ? <p>Courier - {`${courier.name}`}</p> : null}
          </> : null}
        </IonLabel>
      </IonText>
      <IonText slot="end" onClick={e => onClick(2, _id, e)}>
        <IonLabel className="one-line">
          <p style={{ textAlign: "right" }}>{formatDate(createdAt)}</p>
        </IonLabel>
      </IonText>
    </>
  )
}

export default Component

function formatDate(date: number) {
  return Moment(date).fromNow()
}