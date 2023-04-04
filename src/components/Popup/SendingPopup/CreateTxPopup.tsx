import { toBase64 } from '@cosmjs/encoding'
import { coins, MsgSendEncodeObject } from '@cosmjs/stargate'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import FeeAndSequence from 'src/components/FeeAndSequence'
import Gap from 'src/components/Gap'
import Loader from 'src/components/Loader'
import Amount from 'src/components/TxComponents/Amount'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getCoinMinimalDenom,
  getInternalChainId,
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
  const denom = getCoinMinimalDenom()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const gasFee = chainDefaultGasPrice ? calculateGasFee(400000, +chainDefaultGasPrice, decimal) : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>('400000')
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)

  const [sequence, setSequence] = useState('1')

  const chainInfo = getChainInfo()

  useEffect(() => {
    if (gasUsed != '0') {
      setManualGasLimit(gasUsed)
    }
  }, [gasUsed])

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
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Send, Msg, _sendFee, sequence)
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
        sequence: +sequence,
      }
      createTxFromApi(data)
    } catch (error) {
      setDisabled(false)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction(
            error?.message
              ? {
                  message: error?.message,
                  options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                }
              : NOTIFICATIONS.TX_REJECTED_MSG,
          ),
        ),
      )
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
        setDisabled(false)
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
      handleClose()
    } catch (error) {
      console.error(error)
      setDisabled(false)
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
