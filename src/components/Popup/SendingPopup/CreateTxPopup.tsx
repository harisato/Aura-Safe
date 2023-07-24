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
import { getChainDefaultGasPrice, getCoinDecimal, getCoinMinimalDenom, getNativeCurrency } from 'src/config'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import calculateGasFee from 'src/logic/providers/utils/fee'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { extractSafeAddress } from 'src/routes/routes'
import { convertAmount, formatNativeCurrency, formatWithComma } from 'src/utils'
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
  const nativeCurrency = getNativeCurrency()
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
    const msgs: any[] =
      selectedToken?.type == 'CW20'
        ? [
            {
              typeUrl: MsgTypeUrl.ExecuteContract,
              value: {
                contract: selectedToken.address,
                sender: safeAddress,
                funds: [],
                msg: {
                  transfer: {
                    amount: convertAmount(+amount, true, +selectedToken.decimals),
                    recipient: recipient?.address,
                  },
                },
              },
            },
          ]
        : [
            {
              typeUrl: MsgTypeUrl.Send,
              value: {
                amount: coins(
                  convertAmount(+amount, true, +(selectedToken?.decimals || 6)),
                  (selectedToken?.type == 'ibc' ? selectedToken?.cosmosDenom : selectedToken?.denom) || denom,
                ),
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
        recipient?.address,
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
          Balance:{' '}
          <strong>{`${formatWithComma(selectedToken?.balance?.tokenBalance)} ${selectedToken?.symbol}`}</strong>
        </div>
        <Divider withArrow />
        <p className="label">Recipient</p>
        <AddressInfo address={recipient?.address || ''} />
        <Gap height={16} />
        <Amount amount={`${formatWithComma(amount)} ${selectedToken?.symbol}`} token={selectedToken} />
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
          amount={
            selectedToken?.type == 'native'
              ? formatNativeCurrency(new BigNumber(+amount).plus(+gasPriceFormatted).toString())
              : `${formatWithComma(amount)} ${selectedToken?.symbol} + ${formatNativeCurrency(
                  new BigNumber(+gasPriceFormatted).toString(),
                )}`
          }
          hideLogo={true}
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
