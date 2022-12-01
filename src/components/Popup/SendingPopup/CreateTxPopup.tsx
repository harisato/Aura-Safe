import { toBase64 } from '@cosmjs/encoding'
import { coins, MsgSendEncodeObject } from '@cosmjs/stargate'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'
import AddressInfo from 'src/components/AddressInfo'
import { LinkButton, OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import TextField from 'src/components/Input/TextField'
import Amount from 'src/components/TxComponents/Amount'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getCoinMinimalDenom,
  getInternalChainId,
  getNativeCurrency,
} from 'src/config'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import {
  extractSafeAddress,
  extractShortChainName,
  getPrefixedSafeAddressSlug,
  history,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
} from 'src/routes/routes'
import { createSafeTransaction } from 'src/services'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee, formatBigNumber, formatNativeCurrency } from 'src/utils'
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
  const userWalletAddress = useSelector(userAccountSelector)
  const { ethBalance: balance } = useSelector(currentSafeWithNames)
  const dispatch = useDispatch()
  const nativeCurrency = getNativeCurrency()
  const denom = getCoinMinimalDenom()
  const chainDefaultGas = getChainDefaultGas()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const [defaultGas, setDefaultGas] = useState(
    chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Send)?.gasAmount || DEFAULT_GAS_LIMIT.toString(),
  )
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)
  const chainInfo = getChainInfo()
  useEffect(() => {
    if (gasUsed != '0') {
      setDefaultGas(gasUsed)
      setManualGasLimit(gasUsed)
      const gasFee = chainDefaultGasPrice
        ? calculateGasFee(+gasUsed, +chainDefaultGasPrice, decimal)
        : chainDefaultGasPrice
      setGasPriceFormatted(gasFee)
    }
  }, [gasUsed])
  const recalculateFee = () => {
    const gasFee =
      manualGasLimit && chainDefaultGasPrice
        ? calculateGasFee(+manualGasLimit, +chainDefaultGasPrice, decimal)
        : chainDefaultGasPrice
    setGasPriceFormatted(gasFee)
    setOpenGasInput(!openGasInput)
  }
  const signTransaction = async () => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const Msg: MsgSendEncodeObject['value'] = {
      amount: coins(formatBigNumber(+amount, true), denom),
      fromAddress: safeAddress,
      toAddress: recipient?.address,
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Send, Msg, _sendFee)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const data: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: userWalletAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
      }
      createTxFromApi(data)
    } catch (error) {
      setDisabled(false)
      console.error(error)
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      handleClose()
    }
  }

  const createTxFromApi = async (data: any) => {
    try {
      const result = await createSafeTransaction(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        const chainId = chainInfo.chainId
        dispatch(fetchTransactions(chainId, safeAddress))
        const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
        const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
        })
        history.push(txRoute)
        setDisabled(false)
      } else {
        switch (ErrorCode) {
          case MESSAGES_CODE.E029.ErrorCode:
            dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CREATE_SAFE_PENDING_EXECUTE_MSG)))
            break
          default:
            dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
            break
        }
      }
      handleClose()
    } catch (error) {
      console.error(error)
      handleClose()
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message,
            options: { variant: ERROR, persist: false, preventDuplicate: true, autoHideDuration: 5000 },
          }),
        ),
      )
    }
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
        <Gap height={24} />
        <Amount amount={formatNativeCurrency(amount)} />
        <Divider />
        <div className="tx-fee">
          <p className="title">Transaction fee</p>
          <div className="fee">
            <div className="fee-amount">
              <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
              <p>{`${formatNativeCurrency(+gasPriceFormatted)}`}</p>
            </div>
            <LinkButton onClick={() => setOpenGasInput(!openGasInput)}>Edit gas</LinkButton>
          </div>
          {openGasInput && (
            <div className="edit-fee-section">
              <TextField type="number" label="Gas Amount" value={manualGasLimit} onChange={setManualGasLimit} />
              <OutlinedButton disabled={!manualGasLimit || +manualGasLimit < 1} size="md" onClick={recalculateFee}>
                Apply
              </OutlinedButton>
            </div>
          )}
        </div>
        <Amount label="Total Allocation Amount" amount={formatNativeCurrency(+amount + +gasPriceFormatted)} />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrapper>
      <Footer>
        <OutlinedNeutralButton size="md" onClick={() => handleClose(true)} disabled={isDisabled}>
          Back
        </OutlinedNeutralButton>
        <OutlinedButton size="md" onClick={signTransaction} disabled={isDisabled}>
          Submit
        </OutlinedButton>
      </Footer>
    </Popup>
  )
}
