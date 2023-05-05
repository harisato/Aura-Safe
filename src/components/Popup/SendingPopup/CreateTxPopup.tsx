import { coins } from '@cosmjs/stargate'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import FeeAndSequence from 'src/components/FeeAndSequence'
import Gap from 'src/components/Gap'
import Loader from 'src/components/Loader'
import Amount from 'src/components/TxComponents/Amount'
import { getChainDefaultGasPrice, getCoinDecimal, getCoinMinimalDenom } from 'src/config'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import calculateGasFee from 'src/logic/providers/utils/fee'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { extractSafeAddress } from 'src/routes/routes'
import { formatBigNumber, formatNativeCurrency } from 'src/utils'
import { signAndCreateTransaction } from 'src/utils/signer'
import { Popup } from '..'
import Header from '../Header'
import { Footer, Wrapper } from './styles'

export default function CreateTxPopup({
  open,
  handleClose,
  recipient,
  selectedToken,
  amount,
  gasUsed,
}: {
  open: boolean
  handleClose: any
  recipient?: AddressBookEntry
  selectedToken?: Token
  amount: string
  gasUsed: string
}) {
  const safeAddress = extractSafeAddress()
  const { nativeBalance: balance } = useSelector(currentSafeWithNames)
  const dispatch = useDispatch()
  const denom = getCoinMinimalDenom()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const gasFee = chainDefaultGasPrice ? calculateGasFee(400000, +chainDefaultGasPrice, decimal) : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string>('400000')
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)

  const [sequence, setSequence] = useState('1')

  useEffect(() => {
    if (gasUsed != '0') {
      setManualGasLimit(gasUsed)
    }
  }, [gasUsed])

  const signTransaction = async () => {
    const msgs: any[] = [
      {
        typeUrl: MsgTypeUrl.Send,
        value: {
          amount: coins(formatBigNumber(+amount, true), denom),
          fromAddress: safeAddress,
          toAddress: recipient?.address,
        },
      },
    ]
    dispatch(
      signAndCreateTransaction(
        msgs,
        manualGasLimit,
        sequence,
        () => {
          setDisabled(true)
        },
        () => {
          setDisabled(false)
          handleClose()
        },
        () => {
          setDisabled(false)
        },
      ),
    )
  }

  return (
    <Popup open={open} handleClose={() => handleClose()} title="">
      <Header subTitle="Step 2 of 2" title="Send funds" onClose={() => handleClose()} />
      <Wrapper>
        <AddressInfo address={safeAddress} />
        <div className="balance">
          Balance: <strong>{formatNativeCurrency(balance)}</strong>
        </div>
        <Divider withArrow />
        <p className="label">Recipient</p>
        <AddressInfo address={recipient?.address || ''} />
        <Gap height={16} />
        <Amount amount={formatNativeCurrency(amount)} />
        <Divider />

        <FeeAndSequence
          open={openGasInput}
          setOpen={setOpenGasInput}
          manualGasLimit={manualGasLimit}
          setManualGasLimit={setManualGasLimit}
          gasPriceFormatted={gasPriceFormatted}
          setGasPriceFormatted={setGasPriceFormatted}
          sequence={sequence}
          setSequence={setSequence}
        />
        <Divider />

        <Amount
          label="Total Allocation Amount"
          amount={formatNativeCurrency(new BigNumber(+amount).plus(+gasPriceFormatted).toString())}
        />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrapper>
      <Footer>
        <OutlinedNeutralButton onClick={() => handleClose(true)} disabled={isDisabled}>
          Back
        </OutlinedNeutralButton>
        <FilledButton onClick={signTransaction} disabled={openGasInput} className={isDisabled ? 'loading' : ''}>
          {isDisabled ? <Loader content="Submit" /> : 'Submit'}
        </FilledButton>
      </Footer>
    </Popup>
  )
}
