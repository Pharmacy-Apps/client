import React from 'react'
import { IonItemDivider } from "@ionic/react"

type DividerProps = {
  text?: string
}

const Divider: React.FC<DividerProps> = ({ text }) => (
  <IonItemDivider className="mini-divider">{text}</IonItemDivider>
)

export default Divider