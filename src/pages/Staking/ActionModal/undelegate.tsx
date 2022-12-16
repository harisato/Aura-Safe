import SelectValidator from '../SelectValidator'
import {
  TextGray,
  BoxDelegate,
  PaddingPopup,
  InputAura,
  StyledInputModal,
  StyledButtonModal,
  BorderInput,
  BorderAura,
  TextDisable,
} from './styles'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import { useEffect, useRef } from 'react'
import { formatBigNumber } from 'src/utils'
import AmountInput from 'src/components/Input/AmountInput'
import Gap from 'src/components/Gap'

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
                <strong>{formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0)}</strong>{' '}
                <TextGray>{nativeCurrency.symbol}</TextGray>
              </p>
            </Col>
            <Gap height={8} />
            <AmountInput
              handleMax={() =>
                handleMax(formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0))
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
