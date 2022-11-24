import NotificationPopup from 'src/components/NotificationPopup'
import { TextNotiStyled, TextGreen, TextDelegateNoti, BoxDelegate } from './styles'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import { formatBigNumber } from 'src/utils'

export default function ManageModal(props) {
  const { nativeCurrency, itemDelegate, availableBalance, dataDelegateOfUser } = props
  const pendingReward: any = formatBigNumber(dataDelegateOfUser?.delegation?.pendingReward?.amount || 0)
  return (
    <>
      <NotificationPopup>
        <div>
          <TextNotiStyled>
            You can <TextDelegateNoti>“Delegate”</TextDelegateNoti> more to this validator{' '}
          </TextNotiStyled>
          <TextNotiStyled style={{ margin: '6px 0px' }}>
            Or use <TextDelegateNoti>“Redelegate”</TextDelegateNoti> to switch your assets to another validator
          </TextNotiStyled>
          <TextNotiStyled>
            Or use <TextDelegateNoti>“Undelegate”</TextDelegateNoti> to start the unbonding
          </TextNotiStyled>
        </div>
      </NotificationPopup>

      <div style={{ display: 'flex', marginTop: 24 }}>
        <Col sm={5} xs={12} layout="column">
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                My delegation
              </Text>
            </Col>
            <Text size="lg" color="numberAura">
              {formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount) || 0}{' '}
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
              {pendingReward ? pendingReward : 0} <TextGreen>{nativeCurrency.symbol}</TextGreen>
            </Text>
          </BoxDelegate>
        </Col>
        <Col sm={2} />
        <Col sm={5} xs={12} layout="column">
          <BoxDelegate>
            <Col sm={7} xs={12}>
              <Text size="lg" color="white">
                Delegatable Balance
              </Text>
            </Col>

            <Text size="lg" color="numberAura">
              {formatBigNumber(dataDelegateOfUser?.delegation?.delegatableBalance?.amount || 0)}{' '}
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
              {formatBigNumber(dataDelegateOfUser?.delegation?.claimedReward?.amount || 0)}{' '}
              <TextGreen>{nativeCurrency.symbol}</TextGreen>
            </Text>
          </BoxDelegate>
        </Col>
      </div>
    </>
  )
}
