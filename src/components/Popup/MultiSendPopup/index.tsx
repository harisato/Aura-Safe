import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

import { OutlinedButton, TextButton } from 'src/components/Button'
import Gap from 'src/components/Gap'
import TextArea from 'src/components/Input/TextArea'
import TokenSelect from 'src/components/Input/Token'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import { formatNativeCurrency, formatNumber } from 'src/utils'
import { isValidAddress } from 'src/utils/isValidAddress'
import { Popup } from '..'
import Header from '../Header'
import CreateTxPopup from './CreateTxPopup'
import { BodyWrapper, Footer, PopupWrapper } from './styles'

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
  const [createTxPopupOpen, setCreateTxPopupOpen] = useState(false)

  const [recipient, setRecipient] = useState<RecipientProps[]>([])
  const [errorLine, setErrorLine] = useState<number[]>([])
  const [addressValidateErrorMsg, setAddressValidateErrorMsg] = useState('')
  const [addressValidateSuccessMsg, setAddressValidateSuccessMsg] = useState('')
  const [amountValidateMsg, setAmountValidateMsg] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [rawRecipient, setRawRecipient] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const bl = tokens.find((token) => token.address == selectedToken)?.balance?.tokenBalance || 0
    setBalance(+bl)
  }, [selectedToken])

  const clearData = () => {
    setRecipient([])
    setErrorLine([])
    setAddressValidateErrorMsg('')
    setAddressValidateSuccessMsg('')
    setRawRecipient('')
    setAmountValidateMsg('')
    setCreateTxPopupOpen(false)
    setTotalAmount(0)
    setBalance(0)
  }
  const handleClose = () => {
    onClose()
    setSelectedToken('')
    clearData()
  }

  const validateRecipient = () => {
    if (!rawRecipient) {
      clearData()
      return
    }
    const newRecipient: RecipientProps[] = []
    const newErrorLine: number[] = []
    let newTotalAmount = 0
    const rawRecipientLine = rawRecipient.split('\n')
    for (let i = 0; i < rawRecipientLine.length; i++) {
      const recipientLine = rawRecipientLine[i]
      const [addr, am] = recipientLine.split(',')
      const address = addr?.trim()
      const amount = am?.trim()
      // const alreadyAdd = newRecipient.find((r) => r.address == address)
      if (isValidAddress(address) && !isNaN(+amount) && amount != '' && +amount > 0) {
        newRecipient.push({ address: address, amount: formatNumber(amount) })
        newTotalAmount += +formatNumber(amount)
      } else {
        newRecipient.push({ address: address || '', amount: formatNumber(amount) || '' })
        newErrorLine.push(i)
      }
    }
    if (newErrorLine.length > 0) {
      setAddressValidateErrorMsg(
        `Errors found on line ${newErrorLine.map((e) => e + 1).join(', ')}. Please check and try again.`,
      )
      setAddressValidateSuccessMsg('')
    } else {
      setAddressValidateErrorMsg('')
      setAddressValidateSuccessMsg('All recipients Validated successfully')
    }
    setErrorLine(newErrorLine)
    setRecipient(newRecipient)
    setTotalAmount(newTotalAmount)
  }

  useEffect(() => {
    if (balance && totalAmount && +totalAmount > +balance) {
      setAmountValidateMsg('Total amount is greater than available balance. Please check and try agian.')
    } else {
      setAmountValidateMsg('')
    }
  }, [totalAmount])

  useEffect(() => {
    if (addressValidateSuccessMsg) {
      setAddressValidateSuccessMsg('')
    }
    if (addressValidateErrorMsg) {
      setAddressValidateErrorMsg('')
    }
  }, [rawRecipient])

  const createTx = () => {
    onClose()
    setCreateTxPopupOpen(true)
  }
  return (
    <>
      <Popup open={open} title="Send Popup">
        <PopupWrapper>
          <Header onClose={handleClose} subTitle="Step 1 of 2" title="Multi-send" />
          <BodyWrapper>
            <div className="token-selection">
              <TokenSelect selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
            </div>
            <Gap height={16} />
            <div className="label">Add recipients & amounts</div>
            <div className="recipient-input">
              <TextArea placeholder="Address, amount" value={rawRecipient} onChange={setRawRecipient} />
              <div>
                <OutlinedButton size="md" onClick={validateRecipient}>
                  Validate
                </OutlinedButton>
                {addressValidateErrorMsg && <p className="error-msg">{addressValidateErrorMsg}</p>}
                {addressValidateSuccessMsg && <p className="success-msg">{addressValidateSuccessMsg}</p>}
              </div>
            </div>
            <Gap height={16} />
            {recipient.length ? (
              <>
                <div className="label">Recipients list</div>
                <DenseTable stickyHeader maxHeight="30vh" headers={['No.', 'Address', 'Amount']}>
                  {recipient.map((row, index) => {
                    return (
                      <StyledTableRow key={index} className={errorLine.includes(index) ? 'error' : ''}>
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
            {totalAmount && balance ? (
              <>
                <div className="balance-amount">
                  <p>
                    Total: <span className="value">{formatNativeCurrency(totalAmount)}</span>
                  </p>
                  <p>
                    Balance: <span className="value">{formatNativeCurrency(balance)}</span>
                  </p>
                  {amountValidateMsg && <p className="error-msg">{amountValidateMsg}</p>}
                </div>
              </>
            ) : null}
          </BodyWrapper>
          <Footer>
            <TextButton size="md" onClick={handleClose}>
              Cancel
            </TextButton>
            <OutlinedButton
              disabled={
                !selectedToken ||
                !recipient ||
                !!addressValidateErrorMsg ||
                !!amountValidateMsg ||
                !addressValidateSuccessMsg
              }
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
        open={createTxPopupOpen}
        handleClose={handleClose}
      />
    </>
  )
}

export default SendingPopup
