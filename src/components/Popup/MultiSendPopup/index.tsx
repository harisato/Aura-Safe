import { ReactElement, useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import { getNativeCurrency } from 'src/config'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'

import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

import { LinkButton, OutlinedButton, TextButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import AddressInput from 'src/components/Input/Address'
import TextField from 'src/components/Input/TextField'
import { Popup } from '..'
import Header from '../Header'
import CreateTxPopup from './CreateTxPopup'
import { BodyWrapper, Footer, PopupWrapper } from './styles'
import Gap from 'src/components/Gap'
import AddressInfo from 'src/components/AddressInfo'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { isValidAddress } from 'src/utils/isValidAddress'
import { currentChainId } from 'src/logic/config/store/selectors'
import TokenSelect from 'src/components/Input/Token'
import TextArea from 'src/components/Input/TextArea'
import { formatNumber } from 'src/utils'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'

export type RecipientProps = {
  amount: string
  address: string
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
  const [recipient, setRecipient] = useState<RecipientProps[]>([])
  const [addressValidateMsg, setAddressValidateMsg] = useState('')
  const [amountValidateMsg, setAmountValidateMsg] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [rawRecipient, setRawRecipient] = useState('')
  const handleClose = () => {
    setRecipient([])
    setAmount('')
    setSelectedToken('')
    setAddressValidateMsg('')
    setAmountValidateMsg('')
    setCreateTxPopupOpen(false)
  }

  useEffect(() => {
    if (!rawRecipient) {
      return
    }
    const newRecipient: RecipientProps[] = []
    const rawRecipientLine = rawRecipient.split('\n')
    for (const recipientLine of rawRecipientLine) {
      const [addr, am] = recipientLine.split(',')
      if (!addr || !am) break
      const address = addr?.trim()
      const amount = am?.trim()
      if (isValidAddress(address) && !isNaN(+amount) && amount != '') {
        newRecipient.push({ address: address, amount: formatNumber(amount) })
      }
    }
    setRecipient(newRecipient)
    console.log(newRecipient)
  }, [rawRecipient])

  const createTx = () => {
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
            title="Multi-send"
          />
          <BodyWrapper>
            <div className="token-selection">
              <TokenSelect selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
            </div>
            <Gap height={16} />
            <div className="label">Add recipients & amounts</div>
            <TextArea value={rawRecipient} onChange={setRawRecipient} />
            <Gap height={16} />
            {recipient.length ? (
              <>
                <div className="label">Recipients list</div>
                <DenseTable headers={['No.', 'Address', 'Amount']}>
                  {recipient.map((row, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row.address}</StyledTableCell>
                        <StyledTableCell align="left">{row.amount}</StyledTableCell>
                      </StyledTableRow>
                    )
                  })}
                </DenseTable>
              </>
            ) : null}
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
      {/* <CreateTxPopup
        recipient={recipient}
        selectedToken={tokens.find((t) => t.address == selectedToken)}
        amount={amount}
        open={createTxPopupOpen}
        handleClose={handleClose}
      /> */}
    </>
  )
}

export default SendingPopup
