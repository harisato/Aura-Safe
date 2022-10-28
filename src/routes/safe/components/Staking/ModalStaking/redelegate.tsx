import { Text } from '@aura/safe-react-components'
import { useEffect, useRef } from 'react'
import Col from 'src/components/layout/Col'
import SelectValidator from '../SelectValidator'
import {
  BorderAura,
  BorderInput,
  BoxDelegate,
  InputAura,
  PaddingPopup,
  StyledButtonModal,
  StyledInputModal,
  TextDisable,
  TextGreen,
} from './styles'

export default function ModalRedelegate(props) {
  const {
    arrRedelegate,
    handleChangeRedelegate,
    valueDelegate,
    handleDelegatedAmount,
    nativeCurrency,
    handleMax,
    amount,
    dataDelegateOfUser,
    validateMsg,
  } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])
  return (
    <>
      <Col sm={12} xs={12} layout="column">
        <BoxDelegate style={{ marginBottom: 24 }}>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Redelegate to:
              </Text>
            </Col>
            <SelectValidator
              arrRedelegate={arrRedelegate}
              handleChangeRedelegate={handleChangeRedelegate}
              valueDelegate={valueDelegate}
            />
          </PaddingPopup>
        </BoxDelegate>

        <BoxDelegate>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Available for redelegation{'  '}
                <TextDisable>
                  {dataDelegateOfUser?.delegation?.delegationBalance?.amount / 10 ** nativeCurrency.decimals || 0}
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
                    handleMax(
                      dataDelegateOfUser?.delegation?.delegationBalance?.amount / 10 ** nativeCurrency.decimals || 0,
                    )
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
