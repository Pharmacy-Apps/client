import React, { ChangeEvent } from 'react'

import { CCs } from 'utils/msisdn'

const placeholder = '770000000'
const cc = CCs.ug.value

type Props = {
  refFn?: (e: HTMLInputElement) => {},
  name?: string,
  value: string,
  onKeyUp?: (e: { keyCode: number }) => void,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  onFocus?: () => void,
  onBlur?: () => void
}

const Component: React.FC<Props> = (props) => (
  <div className="msisdn-section">
    <span>{cc}</span>
    {/* Couldn't use IonInput because it did not work controlled */}
    <input type="tel" maxLength={9} placeholder={placeholder} {...props} />
  </div>
)

export default Component