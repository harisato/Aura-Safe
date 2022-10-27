import NotificationPopup from 'src/components/NotificationPopup'
import { TextNotiStyled, TextGreen, TextDelegateNoti, BoxDelegate } from './styles'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'

export default function ModalReward(props) {
  const { nativeCurrency, itemDelegate, availableBalance, dataDelegateOfUser } = props
  const pendingReward: any = dataDelegateOfUser?.delegation?.pendingReward?.amount / 10 ** nativeCurrency.decimals
  return (
    <>
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
              {dataDelegateOfUser?.delegation?.delegationBalance?.amount / 10 ** nativeCurrency.decimals || 0}{' '}
              <TextGreen>{nativeCurrency.symbol}</TextGreen>
            </Text>
          </BoxDelegate>
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Pending Reward
              </Text>
            </Col>
            <Text size="lg" color="numberAura">
              {parseFloat(pendingReward) || 0} <TextGreen>{nativeCurrency.symbol}</TextGreen>
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
              {dataDelegateOfUser?.delegation?.delegatableBalance?.amount / 10 ** nativeCurrency.decimals || 0}{' '}
              <TextGreen>{nativeCurrency.symbol}</TextGreen>
            </Text>
          </BoxDelegate>
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Total Reward
              </Text>
            </Col>

            <Text size="lg" color="numberAura">
              {dataDelegateOfUser?.delegation?.claimedReward?.amount / 10 ** nativeCurrency.decimals || 0}{' '}
              <TextGreen>{nativeCurrency.symbol}</TextGreen>
            </Text>
          </BoxDelegate>
        </Col>
      </div>
    </>
  )
}
