import { ThemeColors } from '@aura/safe-react-components/dist/theme'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'

import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressInList } from 'src/utils/transactionUtils'

type TransactionStatusProps = {
  color: string
  text: string
}

export const useTransactionStatus = (transaction: Transaction): TransactionStatusProps => {
  const currentUser = useSelector(userAccountSelector)
  const [status, setStatus] = useState<TransactionStatusProps>({ color: '#ffffff ', text: '' })
  const txStatus = useLocalTxStatus(transaction)
  const { executionInfo } = transaction

  useEffect(() => {
    switch (txStatus) {
      case LocalTransactionStatus.SUCCESS:
        setStatus({ color: '#49996F', text: 'Success' })
        break
      case LocalTransactionStatus.FAILED:
        setStatus({ color: '#D5625E', text: 'Failed' })
        break
      case LocalTransactionStatus.DELETED:
        setStatus({ color: '#D5625E', text: 'Deleted' })
        break
      case LocalTransactionStatus.CANCELLED:
        setStatus({ color: '#D5625E', text: 'Rejected' })
        break
      case LocalTransactionStatus.REPLACED:
        setStatus({ color: '#CCD0D5', text: 'Replaced' })
        break
      case LocalTransactionStatus.AWAITING_CONFIRMATIONS:
        const signaturePending = addressInList((executionInfo as MultisigExecutionInfo)?.missingSigners ?? undefined)
        const text = signaturePending(currentUser) ? 'Needs your confirmation' : 'Needs confirmations'
        setStatus({ color: '#0F82C5 ', text })
        break
      case LocalTransactionStatus.AWAITING_EXECUTION:
        setStatus({ color: '#FFBA69', text: 'Needs execution' })
        break
      case LocalTransactionStatus.PENDING_FAILED:
        setStatus({ color: '#FFBA69', text: 'Pending failed' })
        break
      case LocalTransactionStatus.PENDING:
        setStatus({ color: '#FFAE51', text: 'Pending' })
        break
    }
  }, [setStatus, txStatus, currentUser, executionInfo])

  return status
}
