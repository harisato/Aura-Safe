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
import { Operation, TokenType, TransactionDetails, TransactionStatus, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'

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

export const fetchTransactionDetailsWithHash = ({ txHash }: { txHash: string }) =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
    // const transaction = getTransactionByAttribute(getState(), {
    //   attributeValue: transactionId,
    //   attributeName: 'id',
    // })
    const safeAddress = extractSafeAddress()
    const chainId = currentChainId(getState())

    console.log('fetchTransactionDetailsWithHash', txHash);

    if (!txHash || !safeAddress) {
      return
    }



    try {
      const { Data, ErrorCode } = await getTxDetailByHash(txHash, safeAddress)

      console.log(Data);



      if (ErrorCode !== MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        return
      }

      const transactionDetails: TransactionDetails = {
        txId: Data.Id.toString(),
        executedAt: new Date(Data.UpdatedAt).getTime(),
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
          direction: Data.Direction as TransferDirection,
          transferInfo: {
            type: TokenType.NATIVE_COIN,
            value: (Data.Amount).toString(),
          },
        },
        txHash: Data.TxHash,
        safeAppInfo: {
          name: 'safeAppInfo',
          url: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
          logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
        },
        detailedExecutionInfo: {
          type: 'MULTISIG',
          submittedAt: new Date(Data.CreatedAt).getTime(),
          nonce: Data.Id,
          safeTxGas: Data.GasUsed.toString(),
          baseGas: Data.GasUsed.toString(),
          gasPrice: '0',
          gasToken: Data.Denom,
          refundReceiver: {
            logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
            name: '',
            value: Data.ToAddress
          },
          safeTxHash: 'aura1r2gv6rx0fxdmepu8gd2gmn5j8cjetkqrw836x5',
          executor: {
            logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
            name: '',
            value: Data.FromAddress
          },
          signers: [] /* Data.Signatures.map(e => (
            {
              logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
              name: 'Owner ' + e.id,
              value: e.ownerAddress
            }
          )) */,
          confirmationsRequired: Data.Signatures.length,
          confirmations: [],
          rejectors: null,
          gasTokenInfo: {
            address: '',
            decimals: 6,
            logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
            name: 'Aura',
            symbol: 'Aura'

          },
        },
        txData: {
          hexData: null,
          dataDecoded: null,
          to: {
            logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
            name: '',
            value: Data.ToAddress
          },
          value: Data.Amount.toString(),
          operation: Operation.CALL,
          addressInfoIndex: null
        }
      }

      console.log('transactionDetails', transactionDetails)

      dispatch(updateTransactionDetails({ chainId, transactionId: transactionDetails.txId, safeAddress, value: transactionDetails }))
    } catch (error) {
      console.error(`Failed to retrieve transaction details`, error.message)
    }
  }

/* 
export type TransactionDetails = {
  txId: string
  executedAt: number | null
  txStatus: TransactionStatus
  txInfo: TransactionInfo
  txData: TransactionData | null
  detailedExecutionInfo: DetailedExecutionInfo | null
  txHash: string | null
  safeAppInfo: SafeAppInfo | null
}
*/