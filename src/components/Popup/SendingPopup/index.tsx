import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getNativeCurrency } from 'src/config'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'

import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

import AddressInfo from 'src/components/AddressInfo'
import { LinkButton, OutlinedButton, TextButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import AddressInput from 'src/components/Input/Address'
import TextField from 'src/components/Input/TextField'
import TokenSelect from 'src/components/Input/Token'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentChainId } from 'src/logic/config/store/selectors'
import { isValidAddress } from 'src/utils/isValidAddress'
import { Popup } from '..'
import Header from '../Header'
import CreateTxPopup from './CreateTxPopup'
import CurrentSafe from './CurrentSafe'
import { BodyWrapper, Footer, PopupWrapper } from './styles'

export type SendFundsTx = {
  amount?: string
  recipientAddress?: string
  name?: string
  token?: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type SendFundsProps = {
  open: boolean
  onClose: () => void
}

const SendingPopup = ({ open, onClose }: SendFundsProps): ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)
  const addressBook = useSelector(currentNetworkAddressBook)
  const nativeCurrency = getNativeCurrency()
  const chainId = useSelector(currentChainId)
  const [createTxPopupOpen, setCreateTxPopupOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState<AddressBookEntry | undefined>(undefined)
  const [recipientFocus, setRecipientFocus] = useState(false)
  const [addressValidateMsg, setAddressValidateMsg] = useState('')
  const [amountValidateMsg, setAmountValidateMsg] = useState('')
  const [selectedToken, setSelectedToken] = useState('')

  const handleClose = () => {
    setRecipient(undefined)
    setAmount('')
    setSelectedToken('')
    setAddressValidateMsg('')
    setAmountValidateMsg('')
    setCreateTxPopupOpen(false)
  }

  useEffect(() => {
    setAmountValidateMsg('')
    if (selectedToken) {
      const tokenbalance = tokens.find((t) => t.address == selectedToken)?.balance?.tokenBalance
      if (tokenbalance && amount > tokenbalance) {
        setAmountValidateMsg('Given amount is greater than available balance.')
      }
    }
  }, [amount, selectedToken])

  const setMaxAmount = () => {
    if (selectedToken) {
      const token = tokens.find((t) => t.address == selectedToken)
      setAmount(token?.balance?.tokenBalance || '')
    }
  }

  const createTx = () => {
    if (+amount == 0 || amount == '') {
      setAmountValidateMsg('Invalid amount. Please try again.')
      return
    }
    onClose()
    setCreateTxPopupOpen(true)
  }
  return (
    <>
      <Popup open={open} title="Send Popup">
        <PopupWrapper>
          <Header
            onClose={() => {
              onClose()
              handleClose()
            }}
            subTitle="Step 1 of 2"
            title="Send funds"
          />
          <BodyWrapper>
            <CurrentSafe />
            <Divider withArrow />
            {recipient?.address && !recipientFocus ? (
              <div
                onClick={() => {
                  setRecipientFocus(true)
                }}
              >
                <p className="label">Recipient</p>
                <AddressInfo address={recipient.address} />
              </div>
            ) : (
              <>
                <AddressInput
                  autoFocus
                  value={recipient}
                  onFocus={() => setAddressValidateMsg('')}
                  onChange={(recipient) => {
                    setRecipientFocus(false)
                    setRecipient(recipient)
                  }}
                  onClose={(address, _, reason) => {
                    if (!address) {
                      return
                    }
                    if (reason == 'blur') {
                      if (!isValidAddress(address)) {
                        setAddressValidateMsg('Invalid address input! Please check and try again.')
                        setRecipient({ address: address, chainId, name: '' })
                      } else {
                        setRecipientFocus(false)
                        setRecipient({ address: address, chainId, name: '' })
                      }
                    }
                  }}
                />
                {addressValidateMsg && <p className="error-msg">{addressValidateMsg}</p>}
              </>
            )}
            <Gap height={16} />
            <TokenSelect selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
            <Gap height={16} />
            <div className="amount-section">
              <TextField type="number" label="Amount" value={amount} onChange={(value) => setAmount(value)} />
              <LinkButton onClick={setMaxAmount}>Send max</LinkButton>
            </div>
            {amountValidateMsg && <div className="error-msg">{amountValidateMsg}</div>}
          </BodyWrapper>
          <Footer>
            <TextButton
              size="md"
              onClick={() => {
                onClose()
                handleClose()
              }}
            >
              Cancel
            </TextButton>
            <OutlinedButton
              disabled={!selectedToken || !amount || !recipient || !!addressValidateMsg || !!amountValidateMsg}
              size="md"
              onClick={createTx}
            >
              Review
            </OutlinedButton>
          </Footer>
        </PopupWrapper>
      </Popup>
      <CreateTxPopup
        recipient={recipient}
        selectedToken={tokens.find((t) => t.address == selectedToken)}
        amount={amount}
        open={createTxPopupOpen}
        handleClose={handleClose}
      />
    </>
  )
}

export default SendingPopup
