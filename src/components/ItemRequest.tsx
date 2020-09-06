import React from 'react'
import Moment from 'moment'
import { IonLabel, IonIcon, IonText, IonButton, IonSelect, IonSelectOption } from '@ionic/react'

import { squareOutline as numb, checkbox as active, ellipsisHorizontal as more } from 'ionicons/icons'

import { ItemRequest, MenuAction } from 'types'
import { userIsAdmin, userIsPharmacyOperator, userIsNotClientUser } from 'utils/role'

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
  selectModeOn: boolean,
  onTap: Function,
  actions: Array<MenuAction>
}

const Component: React.FC<Props> = ({
  item: { _id, pharmacyItems, state, createdAt, courier, lat, lon, user },
  detailed,
  selected,
  selectModeOn,
  onTap,
  actions
}) => {

  let selectRef: any = null

  const onClick = (position: Number, item: String, event: any) => {
    event.stopPropagation()
    if (position < 0) {
      selectRef.open({ target: event.target })
    } else
      onTap(position, item)
  }

  const onIonChange = ({ detail: { value } }: any) => {
    if (value === null) return
    if (selectRef) selectRef.value = null
    const { handler } = actions.find(({ text }) => value === text) || {}
    handler && handler(_id)
  }

  const userCanViewRequestClient = userIsPharmacyOperator() || userIsAdmin()

  return (
    <>
      <IonIcon
        icon={
          selectModeOn ? (
            selected ? active : numb
          ) : 'no-icon'
        }
        slot="start"
        onClick={e => onClick(userIsNotClientUser() ? 0 : 1, _id, e)}
        className="ion-no-margin ion-icon-primary" />
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
          {(
            lat !== undefined &&
            lon !== undefined
          ) ? <p>Delivery at {`${lat}, ${lon}`}</p> : null}
          {detailed ? <>
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
      {selectModeOn ? null : <IonButton onClick={e => onClick(-1, _id, e)} slot="end" fill="clear">
        <IonIcon className="ion-icon-primary" icon={more} />
      </IonButton>}
      <IonSelect
        ref={node => selectRef = node}
        interfaceOptions={{ showBackdrop: false }}
        interface="popover"
        onIonChange={onIonChange}
        className="select-menu"
      >
        {
          actions.map(({ text }, i, a) => (
            <IonSelectOption key={i} className={
              i < a.length - 1 ? '' : 'last'
            } value={text}>{text}</IonSelectOption>
          ))
        }
      </IonSelect>
    </>
  )
}

export default Component

function formatDate(date: number) {
  return Moment(date).fromNow()
}