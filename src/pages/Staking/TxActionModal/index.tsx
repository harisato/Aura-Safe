import { Popup } from 'src/components/Popup'
import Header from 'src/components/Popup/Header'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import styled from 'styled-components'
import { useMemo } from 'react'
import AddressInfo from 'src/components/AddressInfo'
import Divider from 'src/components/Divider'
import Delegate from './Delegate'
import { createSafeTransaction } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { getChainInfo } from 'src/config'
import { useDispatch } from 'react-redux'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import {
  extractSafeAddress,
  extractShortChainName,
  getPrefixedSafeAddressSlug,
  history,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
} from 'src/routes/routes'
import { generatePath } from 'react-router-dom'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import Undelegate from './Undelegate'
import ClaimReward from './ClaimReward'
import Redelegate from './Redelegate'
const Wrapper = styled.div`
  width: 480px;
  padding: 24px;
`
export default function TxActionModal({ open, onClose, action, validator, amount, dstValidator, listReward, gasUsed }) {
  const chainInfo = getChainInfo()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()

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
            dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
            break
        }
      }
      onClose()
    } catch (error) {
      console.error(error)
      onClose()
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

  const title =
    action == MsgTypeUrl.Delegate
      ? 'Delegate'
      : action == MsgTypeUrl.Undelegate
      ? 'Undelegate'
      : action == MsgTypeUrl.Redelegate
      ? 'Redelegate'
      : 'Claim Reward'
  if (!validator && action != MsgTypeUrl.GetReward) {
    return <></>
  }
  return (
    <Popup title="" open={open} handleClose={onClose}>
      <Header onClose={onClose} title={title} />
      {action == MsgTypeUrl.Delegate && (
        <Delegate
          gasUsed={gasUsed}
          onClose={onClose}
          validator={validator}
          amount={amount}
          createTxFromApi={createTxFromApi}
        />
      )}
      {action == MsgTypeUrl.Undelegate && (
        <Undelegate
          gasUsed={gasUsed}
          onClose={onClose}
          validator={validator}
          amount={amount}
          createTxFromApi={createTxFromApi}
        />
      )}
      {action == MsgTypeUrl.Redelegate && (
        <Redelegate
          onClose={onClose}
          validator={validator}
          amount={amount}
          createTxFromApi={createTxFromApi}
          dstValidator={dstValidator}
          gasUsed={gasUsed}
        />
      )}
      {action == MsgTypeUrl.GetReward && (
        <ClaimReward onClose={onClose} gasUsed={gasUsed} listReward={listReward} createTxFromApi={createTxFromApi} />
      )}
    </Popup>
  )
}