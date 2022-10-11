import NotificationPopup from 'src/components/NotificationPopup'
import {
  TextNotiStyled,
  TextGreen,
  BoxDelegate,
  FotterModal,
  TextTitleStaking,
  PaddingPopup,
  InputAura,
  StyledInputModal,
  StyledButtonModal,
  BorderInput,
  BorderAura,
} from './styles'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'

export default function ModalDelegate(props) {
  const { handleAmout, amount, nativeCurrency, availableBalance } = props

  return (
    <>
      <NotificationPopup>
        <div>
          <TextTitleStaking>Staking will lock your funds for 1+ day(s)</TextTitleStaking>
          <TextNotiStyled>
            You will need to undetegate in order for your staked assets to be liquid again. This process will take 14
            day(s) to complete.
          </TextNotiStyled>
        </div>
      </NotificationPopup>

      <div style={{ display: 'flex', marginTop: 10 }}>
        <>
          <Col sm={12} xs={12} layout="column">
            <BoxDelegate>
              <PaddingPopup>
                <Col sm={7} xs={12}>
                  <Text size="lg" color="disableAura">
                    My Delegation
                  </Text>
                </Col>
                <Text size="xl" color="numberAura">
                  {availableBalance?.amount / 10 ** 6} <TextGreen>{nativeCurrency}</TextGreen>
                </Text>
              </PaddingPopup>
            </BoxDelegate>

            <BoxDelegate>
              <PaddingPopup>
                <Col sm={7} xs={12}>
                  <Text size="lg" color="disableAura">
                    Delegatable Balance
                  </Text>
                </Col>
                <Text size="xl" color="numberAura">
                  0 <TextGreen>{nativeCurrency}</TextGreen>
                </Text>
              </PaddingPopup>
            </BoxDelegate>

            <BoxDelegate>
              <PaddingPopup>
                <Col sm={7} xs={12}>
                  <Text size="lg" color="white">
                    Available to delegate
                  </Text>
                </Col>
                <InputAura>
                  <BorderInput>
                    <StyledInputModal onChange={handleAmout} value={amount} />
                    <StyledButtonModal>Max</StyledButtonModal>
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
      </div>
    </>
  )
}
