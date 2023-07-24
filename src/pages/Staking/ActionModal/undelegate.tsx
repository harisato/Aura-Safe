import { useEffect, useRef } from 'react'
import Gap from 'src/components/Gap'
import AmountInput from 'src/components/Input/AmountInput'
import Col from 'src/components/layout/Col'
import { convertAmount, formatNativeCurrency } from 'src/utils'
import { BoxDelegate, PaddingPopup, TextGray } from './styles'

export default function ModalUndelegate(props) {
  const { handleDelegatedAmount, nativeCurrency, handleMax, amount, dataDelegateOfUser, validateMsg } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])
  return (
    <>
      <Col sm={12} xs={12} layout="column">
        <BoxDelegate>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <p>
                Available for undelegation{'  '}
                <strong>
                  {formatNativeCurrency(
                    convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0, false),
                  )}
                </strong>
              </p>
            </Col>
            <Gap height={8} />
            <AmountInput
              handleMax={() =>
                handleMax(convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0, false))
              }
              onChange={handleDelegatedAmount}
              value={amount}
              autoFocus={true}
              placeholder="Amount to undelegate"
            />

            {validateMsg && <p className="validate-msg">{validateMsg}</p>}
          </PaddingPopup>
        </BoxDelegate>
      </Col>
    </>
  )
}
