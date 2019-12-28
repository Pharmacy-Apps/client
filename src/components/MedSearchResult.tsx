import React from 'react'

export type Props = {
  index: any
}

const Component: React.FC<Props> = ({ index }) => {
  return (
    <div>Item {index}</div>
  )
}

export default Component