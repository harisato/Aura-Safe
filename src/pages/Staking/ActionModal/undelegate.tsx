import SelectValidator from '../SelectValidator'
import {
  TextGreen,
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
              <Text size="lg" color="white">
                Available for undelegation{'  '}
                <TextDisable>
                  {formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0)}
                </TextDisable>{' '}
                <TextGreen>{nativeCurrency.symbol}</TextGreen>
              </Text>
            </Col>
            <InputAura>
              <BorderInput>
                <StyledInputModal
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  onChange={handleDelegatedAmount}
                  value={amount}
                  ref={inputRef}
                />
                <StyledButtonModal
                  onClick={() =>
                    handleMax(formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount || 0))
                  }
                >
                  Max
                </StyledButtonModal>
              </BorderInput>
              <BorderAura>
                <Text size="xl" color="linkAura">
                  {nativeCurrency.symbol}
                </Text>
              </BorderAura>
            </InputAura>
            {validateMsg && <p className="validate-msg">{validateMsg}</p>}
          </PaddingPopup>
        </BoxDelegate>
      </Col>
    </>
  )
}
