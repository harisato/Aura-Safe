import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getChainInfo, getInternalChainId, getShortName } from 'src/config'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { fetchTransactionDetailsById } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { txTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress, generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'
import { confirmSafeTransaction, rejectTransactionById, sendSafeTransaction } from 'src/services'
import { TxSignModalContext } from '../Queue'
import ClaimRewardPopup from './ClaimReward'
import DelegatePopup from './Delegate'
import RedelegatePopup from './Redelegate'
import SendPopup from './Send'
import UndelegatePopup from './Undelegate'
import VotePopup from './Vote'

export default function TxActionModal() {
  const { open, txId, setOpen, action } = useContext(TxSignModalContext)
  const allTxs = useSelector(txTransactions)
  const txData = allTxs?.[txId]?.[0]
  const type = txData?.txInfo?.typeUrl
  const [isDisabled, setIsDisabled] = useState(false)
  const userWalletAddress = useSelector(userAccountSelector)
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()

  const confirmTxFromApi = async (data: any, chainId: any, safeAddress: any) => {
    const { ErrorCode } = await confirmSafeTransaction(data)
    if (ErrorCode === 'SUCCESSFUL') {
      history.push(
        generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          shortName: getShortName(),
          safeAddress,
        }),
      )
      dispatch(fetchTransactions(chainId, safeAddress, true))
      // dispatch(fetchTransactionDetailsById({ transactionId: data.transactionId }))
      setIsDisabled(false)
      setOpen(false)
      // window.location.reload()
    } else {
      setIsDisabled(false)
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
    }
  }

  const sendTx = async () => {
    try {
      setIsDisabled(true)
      const payload = {
        transactionId: txData.txDetails.txId,
        internalChainId: getInternalChainId(),
        owner: userWalletAddress,
      }
      const result = await sendSafeTransaction(payload)
      const { ErrorCode } = result

      if (ErrorCode === 'SUCCESSFUL') {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_EXECUTED_MSG))
      } else {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FAILED_MSG))
        setIsDisabled(false)
      }
      const chainInfo = getChainInfo()
      const chainId = chainInfo.chainId
      dispatch(fetchTransactions(chainId, safeAddress))
      setOpen(false)
    } catch (error) {
      setIsDisabled(false)
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FAILED_MSG))
    }
  }

  const rejectTx = async () => {
    try {
      setIsDisabled(true)
      const payload = {
        transactionId: txData.txDetails.txId,
        internalChainId: getInternalChainId(),
      }
      const result = await rejectTransactionById(payload)
      const { ErrorCode } = result

      if (ErrorCode === 'SUCCESSFUL') {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_REJECTED_MSG_SUCCESS))
      } else {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FAILED_MSG))
        setIsDisabled(false)
      }
      const chainInfo = getChainInfo()
      const chainId = chainInfo.chainId
      dispatch(fetchTransactions(chainId, safeAddress))
      setOpen(false)
    } catch (error) {
      setIsDisabled(false)
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FAILED_MSG))
    }
  }

  if (!txData || !open || !txId) return <></>
  if (type == MsgTypeUrl.Delegate) {
    return (
      <DelegatePopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.Undelegate) {
    return (
      <UndelegatePopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.Send) {
    return (
      <SendPopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.MultiSend) {
    return (
      <SendPopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.Redelegate) {
    return (
      <RedelegatePopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.Vote) {
    return (
      <VotePopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  if (type == MsgTypeUrl.GetReward) {
    return (
      <ClaimRewardPopup
        open={open}
        onClose={() => setOpen(false)}
        data={txData}
        sendTx={sendTx}
        rejectTx={rejectTx}
        disabled={isDisabled}
        setDisabled={setIsDisabled}
        confirmTxFromApi={confirmTxFromApi}
      />
    )
  }
  return <></>
}
