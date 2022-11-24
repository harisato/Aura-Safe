import { Text } from '@aura/safe-react-components'
import BigNumber from 'bignumber.js'
import { useEffect, useRef } from 'react'
import Col from 'src/components/layout/Col'
import NotificationPopup from 'src/components/NotificationPopup'
import { isNumberKeyPress } from 'src/utils'
import {
  BorderAura,
  BorderInput,
  BoxDelegate,
  InputAura,
  PaddingPopup,
  StyledButtonModal,
  StyledInputModal,
  TextGreen,
  TextNotiStyled,
  TextTitleStaking,
} from './styles'

export default function ModalDelegate(props) {
  const { handleAmout, amount, nativeCurrency, availableBalance, dataDelegateOfUser, handleMax, validateMsg } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])
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
              <PaddingPopup>
                <Col sm={7} xs={12}>
                  <Text size="lg" color="disableAura">
                    My Delegation
                  </Text>
                </Col>
                <Text size="xl" color="numberAura">
                  {new BigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount)
                    .div(new BigNumber(10).pow(nativeCurrency.decimals))
                    .toFixed() || 0}{' '}
                  <TextGreen>{nativeCurrency.symbol}</TextGreen>
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
                  {new BigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount)
                    .div(new BigNumber(10).pow(nativeCurrency.decimals))
                    .toFixed() || 0}{' '}
                  <TextGreen>{nativeCurrency.symbol}</TextGreen>
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
                    <StyledInputModal
                      onChange={handleAmout}
                      onKeyPress={isNumberKeyPress}
                      value={amount}
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      ref={inputRef}
                    />
                    <StyledButtonModal
                      onClick={() =>
                        handleMax(
                          new BigNumber(availableBalance?.amount).div(new BigNumber(10).pow(nativeCurrency.decimals)) ||
                            0,
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
      </div>
    </>
  )
}
