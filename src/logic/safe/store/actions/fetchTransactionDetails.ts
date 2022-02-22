import { createAction } from 'redux-actions'

import { Dispatch } from 'src/logic/safe/store/actions/types'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionDetailsPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { currentChainId } from 'src/logic/config/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { getTxDetailByHash } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { TokenType, TransactionStatus, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'

export const UPDATE_TRANSACTION_DETAILS = 'UPDATE_TRANSACTION_DETAILS'
const updateTransactionDetails = createAction<TransactionDetailsPayload>(UPDATE_TRANSACTION_DETAILS)

export const fetchTransactionDetails =
  ({ transactionId }: { transactionId: Transaction['id'] }) =>
    async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
      const transaction = getTransactionByAttribute(getState(), {
        attributeValue: transactionId,
        attributeName: 'id',
      })
      const safeAddress = extractSafeAddress()
      const chainId = currentChainId(getState())

      if (transaction?.txDetails || !safeAddress) {
        return
      }

      try {
        const transactionDetails = await fetchSafeTransaction(transactionId)

        dispatch(updateTransactionDetails({ chainId, transactionId, safeAddress, value: transactionDetails }))
      } catch (error) {
        console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
      }
    }
/* 
export const fetchTransactionDetailsWithHash = (txHash: string) => {
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
    // const transaction = getTransactionByAttribute(getState(), {
    //   attributeValue: transactionId,
    //   attributeName: 'id',
    // })
    // const safeAddress = extractSafeAddress()
    // const chainId = currentChainId(getState())

    // if (transaction?.txDetails || !safeAddress) {
    //   return
    // }

    try {
      // const transactionDetails = await fetchSafeTransaction(transactionId)
      const { Data, ErrorCode } = await getTxDetailByHash(txHash)

      if (ErrorCode !== MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        return
      }

      const value: Transaction = {
        id: Data.Id,
        timestamp: (new Date(Data.UpdatedAt)).getTime(),
        txStatus: (Data.Status == '0' ? TransactionStatus.SUCCESS : Data.Status) as TransactionStatus,
        txInfo: {
          type: 'Transfer',
          sender: {
            value: Data.FromAddress,
            name: null,
            logoUri: null,
          },
          recipient: {
            value: Data.ToAddress,
            name: null,
            logoUri: null,
          },
          direction: TransferDirection.INCOMING,
          transferInfo: {
            type: TokenType.NATIVE_COIN,
            value: (Data.Amount).toString(),
          },
        },

      }

      dispatch(updateTransactionDetails({ chainId, transactionId, safeAddress, value: transactionDetails }))
    } catch (error) {
      // console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
    }
  }
} */
