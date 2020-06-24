import React from 'react'
import { IonPopover, IonList, IonItem } from '@ionic/react'

type Item = {
  value: String,
  label: String
}

type Props = {
  open: boolean,
  onDismiss: () => void,
  onSelect: Function
}

const couriers: Array<String> = ['Joe', 'Kim', 'Lea']
const items: Array<Item> = couriers.map(o => ({ value: o, label: o }))

const Component: React.FC<Props> = ({
  open,
  onDismiss,
  onSelect
}) => {
  return (
    <IonPopover
      isOpen={open}
      onDidDismiss={onDismiss}
    >
      <IonList className="ion-no-padding">{
        items.map(({ value, label }, i, a) => (
          <IonItem
            key={`${value}`}
            button
            onClick={() => onSelect(value, label)}
            lines={i === a.length - 1 ? 'none' : 'full'}
          >{label}</IonItem>
        ))
      }</IonList>
    </IonPopover>
  )
}

export default Component