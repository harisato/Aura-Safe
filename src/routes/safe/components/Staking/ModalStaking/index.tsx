import ModalNew from 'src/components/ModalNew'
import StakeFish from '../assets/StakeFish.svg'
import Inotel from '../assets/Inotel.png'
import NotificationPopup from 'src/components/NotificationPopup'
import CloseButton from 'src/components/CloseButton'
import ButtonSelect from 'src/components/ButtonSelect'
import {
  ImgStyled,
  HeaderPopup,
  HeaderContainer,
  BoxImgStyled,
  BoxVotingPower,
  TextPower,
  TextDelegators,
  Commission,
  StyleDivider,
  TextNotiStyled,
  TextGreen,
  TextDelegateNoti,
  BoxDelegate,
  FotterModal,
} from './styles'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'

export default function ModalStaking(props) {
  const { modalIsOpen } = props

  const handleButtonDelegate = (value) => {
    console.log('value', value)
  }

  return (
    <ModalNew modalIsOpen={modalIsOpen}>
      <HeaderContainer>
        <HeaderPopup>
          <ImgStyled src={StakeFish} alt="StakeFish" />
          <BoxImgStyled>
            <img src={Inotel} alt="StakeFish" />
            <Commission>Commission - 6%</Commission>
          </BoxImgStyled>
        </HeaderPopup>
        <BoxVotingPower>
          <TextPower>
            Voting power - 5.58% (64.000000 <TextGreen>AURA</TextGreen> )
          </TextPower>
          <TextDelegators>Delegators - 27,733</TextDelegators>
        </BoxVotingPower>
      </HeaderContainer>

      <StyleDivider />
      <NotificationPopup>
        <div>
          <TextNotiStyled>
            You can <TextDelegateNoti>“Delegate”</TextDelegateNoti> more to this validator{' '}
          </TextNotiStyled>
          <TextNotiStyled>
            Or use <TextDelegateNoti>“Redelegate”</TextDelegateNoti> to switch your assets to another validator
          </TextNotiStyled>
          <TextNotiStyled>
            Or use <TextDelegateNoti>“Undelegate”</TextDelegateNoti> to start the unbonding
          </TextNotiStyled>
        </div>
      </NotificationPopup>

      <NotificationPopup>
        <div>
          <TextNotiStyled>
            You can <TextDelegateNoti>“Delegate”</TextDelegateNoti> more to this validator{' '}
          </TextNotiStyled>
          <TextNotiStyled>
            Or use <TextDelegateNoti>“Redelegate”</TextDelegateNoti> to switch your assets to another validator
          </TextNotiStyled>
          <TextNotiStyled>
            Or use <TextDelegateNoti>“Undelegate”</TextDelegateNoti> to start the unbonding
          </TextNotiStyled>
        </div>
      </NotificationPopup>

      <div style={{ display: 'flex', marginTop: 10 }}>
        <Col sm={6} xs={12} layout="column">
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                My delegation
              </Text>
            </Col>
            <Text size="lg" color="numberAura">
              5.000000 <TextGreen>AURA</TextGreen>
            </Text>
          </BoxDelegate>
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Pending Reward
              </Text>
            </Col>
            <Text size="lg" color="numberAura">
              0.632315 <TextGreen>AURA</TextGreen>
            </Text>
          </BoxDelegate>
        </Col>
        <Col sm={6} xs={12} layout="column">
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Delegatable Balance
              </Text>
            </Col>

            <Text size="lg" color="numberAura">
              17.641376 <TextGreen>AURA</TextGreen>
            </Text>
          </BoxDelegate>
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Total Reward
              </Text>
            </Col>

            <Text size="lg" color="numberAura">
              2.239288 <TextGreen>AURA</TextGreen>
            </Text>
          </BoxDelegate>
        </Col>
      </div>
      <FotterModal>
        <CloseButton title="Close" />
        <ButtonSelect handleButtonDelegate={handleButtonDelegate} />
      </FotterModal>
    </ModalNew>
  )
}
