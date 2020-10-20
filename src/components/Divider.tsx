import React from 'react'
import { IonItemDivider } from "@ionic/react"

type DividerProps = {
  cssClass?: string,
  text?: string
}

const Divider: React.FC<DividerProps> = ({ text, cssClass }) => (
  <IonItemDivider className={cssClass}>{text}</IonItemDivider>
)

Divider.defaultProps = {
  cssClass: 'mini-divider'
}

export default Divider