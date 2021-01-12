import React, { ChangeEvent, FocusEvent } from 'react'

import { CCs } from 'utils/msisdn'

const placeholder = '770000000'
const cc = CCs.ug.value

type Props = {
  name?: string,
  value: string,
  onKeyUp?: (e: { keyCode: number }) => void,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void,
  onBlur?: () => void
}

const Component: React.FC<Props> = props => (
  <div className="msisdn-section">
    <span>{cc}</span>
    {/* Couldn't use IonInput because it did not work controlled */}
    <input className="phone-input" type="tel" maxLength={9} placeholder={placeholder} autoComplete="off" {...props} />
  </div>
)

export default Component