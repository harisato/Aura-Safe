import { createAction } from 'redux-actions'

import {
  AddressEx,
  DetailedExecutionInfo,
  MultisigConfirmation,
  Operation,
  SafeAppInfo,
  TokenType,
  TransactionData,
  TransactionDetails,
  TransactionStatus,
  TransferDirection,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { getCoinDecimal, getCoinSymbol } from 'src/config'
import { currentChainId } from 'src/logic/config/store/selectors'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionDetailsPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { extractSafeAddress } from 'src/routes/routes'
import { getTxDetailById } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { AppReduxState } from 'src/store'

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

type DetailedExecutionInfoExtended = {
  gasPrice: string
}

export const fetchTransactionDetailsById =
  ({ transactionId, txHash, auraTxId }: { transactionId: string; txHash?: string | null; auraTxId?: string }) =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
    const transaction = getTransactionByAttribute(getState(), {
      attributeValue: transactionId,
      attributeName: 'id',
    })
    const safeAddress = extractSafeAddress()
    const chainId = currentChainId(getState())

    if (transaction?.txDetails || !safeAddress || !transactionId) {
      return
    }

    try {
      const { Data, ErrorCode } = await getTxDetailById(transactionId, safeAddress, auraTxId)
      if (ErrorCode !== MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        return
      }

      const direction: TransferDirection = (Data?.Direction as TransferDirection) || TransferDirection.UNKNOWN
      let safeAppInfo: SafeAppInfo | null = null
      let detailedExecutionInfo: (DetailedExecutionInfo & DetailedExecutionInfoExtended) | null = null
      let txData: TransactionData | null = null

      const coinDecimal = getCoinDecimal()
      const symbol = getCoinSymbol()

      console.log(Data)

      if (direction == TransferDirection.OUTGOING && false) {
        safeAppInfo = {
          name: '',
          url: '',
          logoUri: '',
        }

        detailedExecutionInfo = {
          type: 'MULTISIG',
          submittedAt: new Date(Data.CreatedAt).getTime(),
          nonce: Data?.MultisigTxId,
          safeTxGas: (Data?.GasUsed || 0)?.toString(),
          baseGas: (Data?.GasWanted || 0)?.toString(),
          gasPrice: (Data?.GasPrice || 0)?.toString(),
          gasToken: Data.Denom,
          refundReceiver: {
            logoUri: null,
            name: null,
            value: '0000000000000000000000000000000000000000',
          },
          safeTxHash: safeAddress,
          executor: !Data?.Executor[0]
            ? null
            : {
                logoUri: null,
                name: null,
                value: Data.Executor[0].ownerAddress,
              },
          signers:
            Data?.Signers.map(
              (signer) =>
                ({
                  logoUri: null,
                  name: null,
                  value: signer.OwnerAddress,
                } as AddressEx),
            ) || [],
          confirmationsRequired: Data.ConfirmationsRequired,
          confirmations: Data?.Confirmations.map(
            (cf) =>
              ({
                signature: cf.signature,
                signer: {
                  logoUri: null,
                  name: null,
                  value: cf.ownerAddress,
                },
                submittedAt: new Date(cf.createdAt).getTime(),
              } as MultisigConfirmation),
          ),
          rejectors: Data?.Rejectors.map((re) => ({ logoUri: null, name: null, value: re.ownerAddress } as AddressEx)),
          gasTokenInfo: {
            address: '',
            decimals: coinDecimal,
            logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
            name: 'Aura',
            symbol,
          },
        }

        txData = {
          hexData: null,
          dataDecoded: null,
          to: {
            logoUri: null,
            name: null,
            value: Data.ToAddress,
          },
          value: Data.Amount?.toString(),
          operation: Operation.CALL,
          addressInfoIndex: null,
        }
      }

      const transactionDetails: any = {
        txId: Data?.MultisigTxId?.toString() || null,
        auraTxId: Data?.AuraTxId?.toString() || null,
        executedAt: Data.Executor ? new Date(Data.Executor.updatedAt).getTime() : null,
        createAt: Data.CreatedAt ? new Date(Data.CreatedAt).getTime() : null,
        txStatus: (Data.Status == '0' ? TransactionStatus.SUCCESS : Data.Status) as TransactionStatus,
        txMessage: Data?.Messages?.length ? Data?.Messages : [],
        txHash: Data?.TxHash || null,
        confirmationsRequired: Data.ConfirmationsRequired,
        confirmations: Data?.Confirmations.map(
          (cf) =>
            ({
              signature: cf.signature,
              signer: {
                logoUri: null,
                name: null,
                value: cf.ownerAddress,
              },
              submittedAt: new Date(cf.createdAt).getTime(),
            } as MultisigConfirmation),
        ),
        executor: !Data?.Executor
          ? null
          : {
              logoUri: null,
              name: null,
              value: Data.Executor.ownerAddress,
            },
        rejectors: Data?.Rejectors.map((re) => ({ logoUri: null, name: null, value: re.ownerAddress } as AddressEx)),
      }

      dispatch(
        updateTransactionDetails({
          chainId,
          transactionId: transactionDetails.txId,
          safeAddress,
          value: transactionDetails,
        }),
      )
    } catch (error) {
      console.error(`Failed to retrieve transaction details`, error.message)
    }
  }
