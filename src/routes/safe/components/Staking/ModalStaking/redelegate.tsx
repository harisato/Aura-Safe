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
  return (
    <>
      <Col sm={12} xs={12} layout="column">
        <BoxDelegate>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Redelegate to:
              </Text>
            </Col>
            <SelectValidator />
          </PaddingPopup>
        </BoxDelegate>

        <BoxDelegate>
          <PaddingPopup>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Available for redelegation <TextDisable>5.000000</TextDisable> <TextGreen>AURA</TextGreen>
              </Text>
            </Col>
            <InputAura>
              <BorderInput>
                <StyledInputModal />
                <StyledButtonModal>Max</StyledButtonModal>
              </BorderInput>
              <BorderAura>
                <Text size="xl" color="linkAura">
                  AURA
                </Text>
              </BorderAura>
            </InputAura>
          </PaddingPopup>
        </BoxDelegate>
      </Col>
    </>
  )
}
