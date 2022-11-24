import { ThemeColors } from '@aura/safe-react-components/dist/theme'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'

import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressInList } from 'src/utils/transactionUtils'

export type TransactionStatusProps = {
  color: ThemeColors
  text: string
}

export const useTransactionStatus = (transaction: Transaction): TransactionStatusProps => {
  const currentUser = useSelector(userAccountSelector)
  const [status, setStatus] = useState<TransactionStatusProps>({ color: 'primary', text: '' })
  const txStatus = useLocalTxStatus(transaction)
  const { executionInfo } = transaction

  useEffect(() => {
    switch (txStatus) {
      case LocalTransactionStatus.SUCCESS:
        setStatus({ color: 'successAura', text: 'Success' })
        break
      case LocalTransactionStatus.FAILED:
        setStatus({ color: 'failAura', text: 'Failed' })
        break
      case LocalTransactionStatus.CANCELLED:
        setStatus({ color: 'failAura', text: 'Rejected' })
        break
      case LocalTransactionStatus.WILL_BE_REPLACED:
        setStatus({ color: 'placeHolder', text: 'Transaction will be replaced' })
        break
      case LocalTransactionStatus.AWAITING_CONFIRMATIONS:
        const signaturePending = addressInList((executionInfo as MultisigExecutionInfo)?.missingSigners ?? undefined)
        const text = signaturePending(currentUser) ? 'Needs your confirmation' : 'Needs confirmations'
        setStatus({ color: 'confirmationAura', text })
        break
      case LocalTransactionStatus.AWAITING_EXECUTION:
      case LocalTransactionStatus.PENDING_FAILED:
        setStatus({ color: 'rinkeby', text: 'Needs execution' })
        break
      case LocalTransactionStatus.PENDING:
        setStatus({ color: 'rinkeby', text: 'Pending' })
        break
    }
  }, [setStatus, txStatus, currentUser, executionInfo])

  return status
}