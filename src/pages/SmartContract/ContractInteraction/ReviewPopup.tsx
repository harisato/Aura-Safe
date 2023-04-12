import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import FeeAndSequence from 'src/components/FeeAndSequence'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import Amount from 'src/components/TxComponents/Amount'
import { getChainDefaultGasPrice, getChainInfo, getCoinDecimal, getInternalChainId } from 'src/config'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { signCosWasmMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
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
import { MESSAGES_CODE } from 'src/services/constant/message'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee, formatNativeCurrency } from 'src/utils'
import { Wrap } from './styles'

export default function ReviewPopup({ open, setOpen, gasUsed, data, contractData }) {
  const safeAddress = extractSafeAddress()
  const dispatch = useDispatch()
  const { ethBalance: balance } = useSelector(currentSafeWithNames)
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const defaultGas = '250000'
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice

  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [sequence, setSequence] = useState('0')
  const [isDisabled, setDisabled] = useState(false)
  const userWalletAddress = useSelector(userAccountSelector)
  const chainInfo = getChainInfo()

  useEffect(() => {
    if (gasUsed) {
      setManualGasLimit(gasUsed)
      const gasFee = calculateGasFee(+gasUsed, +chainDefaultGasPrice, decimal)
      setGasPriceFormatted(gasFee)
    }
  }, [gasUsed])

  const signTransaction = async () => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const Msg: any = {
      contract: contractData.contractAddress,
      sender: safeAddress,
      funds: [],
      msg: toUtf8(
        JSON.stringify({
          [contractData.selectedFunction]: data,
        }),
      ),
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signCosWasmMessage(
        chainId,
        safeAddress,
        MsgTypeUrl.ExecuteContract,
        Msg,
        _sendFee,
        sequence,
      )
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
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Transaction request failed',
            options: { variant: ERROR, persist: false, autoHideDuration: 5000, preventDuplicate: true },
          }),
        ),
      )
      setOpen(false)
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
      } else {
        switch (ErrorCode) {
          case MESSAGES_CODE.E029.ErrorCode:
            dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CREATE_SAFE_PENDING_EXECUTE_MSG)))
            break
          default:
            dispatch(
              enqueueSnackbar(
                enhanceSnackbarForAction(
                  result?.Message
                    ? {
                        message: result?.Message,
                        options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                      }
                    : NOTIFICATIONS.TX_FAILED_MSG,
                ),
              ),
            )
            break
        }
      }
      setOpen(false)
      setDisabled(false)

    } catch (error) {
      console.error(error)
      setOpen(false)
      setDisabled(false)

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
    <Popup title="" open={open} handleClose={() => setOpen(false)}>
      <Header onClose={() => setOpen(false)} title={'Contract Interaction'} />
      <Wrap>
        <AddressInfo address={safeAddress} />
        <div className="balance">
          Balance: <strong>{formatNativeCurrency(balance)}</strong>
        </div>
        <Divider withArrow />
        <AddressInfo address={contractData.contractAddress} showAvatar={false} showName={false} />
        <div className="function-name">{contractData.selectedFunction}</div>
        <div className="fields">
          {Object.keys(data)?.map((key, index) => (
            <div className="field" key={index}>
              <div className="field__label">{key}:</div>
              <div className="field__data">{data[key]}</div>
            </div>
          ))}
        </div>
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
        <Amount amount={formatNativeCurrency(+gasPriceFormatted)} label="Total Allocation Amount" />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrap>
      <Footer>
        <OutlinedNeutralButton onClick={() => setOpen(false)} disabled={isDisabled}>
          Close
        </OutlinedNeutralButton>
        <FilledButton onClick={signTransaction} disabled={isDisabled}>
          Submit
        </FilledButton>
      </Footer>
    </Popup>
  )
}
