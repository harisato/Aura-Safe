import BigNumber from 'bignumber.js'
import Gap from 'src/components/Gap'
import AmountInput from 'src/components/Input/AmountInput'
import Col from 'src/components/layout/Col'
import NotificationPopup from 'src/components/NotificationPopup'
import { convertAmount, formatNativeCurrency } from 'src/utils'
import { BoxDelegate, PaddingPopup, TextGray, TextNotiStyled, TextTitleStaking } from './styles'
export default function ModalDelegate(props) {
  const { handleAmout, amount, nativeCurrency, availableBalance, dataDelegateOfUser, handleMax, validateMsg } = props

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

      <div style={{ display: 'flex', marginTop: 12 }}>
        <>
          <Col sm={12} xs={12} layout="column">
            <BoxDelegate>
              <Col sm={7} xs={12}>
                <TextGray>My Delegation</TextGray>
              </Col>
              <p>
                {formatNativeCurrency(convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount, false))}
              </p>
            </BoxDelegate>

            <BoxDelegate>
              <Col sm={7} xs={12}>
                <TextGray>Delegatable Balance</TextGray>
              </Col>
              <p>
                {formatNativeCurrency(availableBalance?.amount ? convertAmount(availableBalance?.amount, false) : 0)}
              </p>
            </BoxDelegate>
            <Gap height={12} />
            <BoxDelegate>
              <PaddingPopup>
                <Col sm={7} xs={12}>
                  <p>Available to delegate</p>
                </Col>
                <Gap height={8} />

                <AmountInput
                  handleMax={() =>
                    handleMax(
                      new BigNumber(availableBalance?.amount).div(new BigNumber(10).pow(nativeCurrency.decimals)) || 0,
                    )
                  }
                  onChange={handleAmout}
                  value={amount}
                  autoFocus={true}
                  placeholder="Amount to delegate"
                />
                {validateMsg && <p className="validate-msg">{validateMsg}</p>}
              </PaddingPopup>
            </BoxDelegate>
          </Col>
        </>
      </div>
    </>
  )
}
