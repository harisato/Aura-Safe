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

export default function ModalRedelegate(props) {
  const {
    arrRedelegate,
    handleChangeRedelegate,
    valueDelegate,
    handleAmoutRedelegate,
    handlValueDelegate,
    nativeCurrency,
    itemDelegate,
    handleMax,
    amount,
    dataDelegateOfUser,
  } = props

  return (
    <>
      <Col sm={12} xs={12} layout="column">
        <BoxDelegate>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                {handlValueDelegate} to:
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
                Available for {handlValueDelegate}{' '}
                <TextDisable>{dataDelegateOfUser?.delegation?.delegationBalance?.amount / 10 ** 6 || 0}</TextDisable>{' '}
                <TextGreen>{nativeCurrency}</TextGreen>
              </Text>
            </Col>
            <InputAura>
              <BorderInput>
                <StyledInputModal
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  onChange={handleAmoutRedelegate}
                  value={amount}
                />
                <StyledButtonModal
                  onClick={() => handleMax(dataDelegateOfUser?.delegation?.delegationBalance?.amount / 10 ** 6 || 0)}
                >
                  Max
                </StyledButtonModal>
              </BorderInput>
              <BorderAura>
                <Text size="xl" color="linkAura">
                  {nativeCurrency}
                </Text>
              </BorderAura>
            </InputAura>
          </PaddingPopup>
        </BoxDelegate>
      </Col>
    </>
  )
}
