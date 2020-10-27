import React from 'react'

import { IonSelect, IonSelectOption } from '@ionic/react'

import { MenuAction } from 'types'

type Props = {
  actions: Array<MenuAction>,
  setRef: (node: any) => void,
  id?: string
}

const Component: React.FC<Props> = ({
  id,
  actions,
  setRef: setRefAtParent
}) => {

  let menuRef: any
  
  const onChange = ({ detail: { value } }: any) => {
    if (value === null) return
    if (menuRef) menuRef.value = null
    const { handler } = actions.find(({ text }) => value === text) || {}
    handler && handler(id)
  }

  const setRef = (node: any) => {
    menuRef = node
    setRefAtParent(node)
  }

  return (
    <IonSelect
      ref={setRef}
      interfaceOptions={{ showBackdrop: false }}
      interface="popover"
      onIonChange={onChange}
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
  )

}

export default Component