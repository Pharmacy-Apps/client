import React from 'react'
import Moment from 'moment'
import { IonLabel, IonIcon, IonButton } from '@ionic/react'

import { squareOutline as numb, checkbox as active, ellipsisHorizontal as more } from 'ionicons/icons'

import { ItemRequest, MenuAction } from 'types'
import { userIsAdmin, userIsPharmacyOperator, userIsNotClientUser } from 'utils/role'
import { Menu as ActionMenu } from 'components'

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

  let menuRef: any = null

  const onClick = (position: Number, item: String, event: any) => {
    event.stopPropagation()
    if (position < 0) {
      menuRef.open({ target: event.target })
    } else
      onTap(position, item)
  }

  const userCanViewRequestClient = userIsPharmacyOperator() || userIsAdmin()

  return (
    <>
      {
        selectModeOn
          ? <IonIcon
            icon={selected ? active : numb}
            slot="start"
            onClick={e => onClick(userIsNotClientUser() ? 0 : 1, _id, e)}
            className="ion-no-margin ion-icon-primary" />
          : <div
            onClick={e => onClick(userIsNotClientUser() ? 0 : 1, _id, e)}
            className="fill-height"
            style={{ width: 'var(--ion-padding)' }} />
      }
      <IonLabel
        className="ion-padding-vertical ion-no-margin spaced"
        onClick={e => onClick(1, _id, e)}
      >
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
      <IonLabel
        className="one-line"
        style={{
          minWidth: 'fit-content',
          maxWidth: 'fit-content'
        }}
        slot="end"
        onClick={e => onClick(2, _id, e)}
      >
        <p className="ion-text-end">{formatDate(createdAt)}</p>
      </IonLabel>
      {selectModeOn ? null : <IonButton onClick={e => onClick(-1, _id, e)} slot="end" fill="clear">
        <IonIcon className="ion-icon-primary" icon={more} />
      </IonButton>}
      <ActionMenu
        id={_id}
        setRef={(node: any) => menuRef = node}
        actions={actions}
      />
    </>
  )
}

export default Component

function formatDate(date: number) {
  return Moment(date).fromNow()
}