import {
  AddressEx,
  TokenType,
  TransactionListPage,
  TransactionStatus,
  TransferDirection,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { matchPath } from 'react-router-dom'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { history, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SIZE } from 'src/services/constant/common'
import { ITransactionListItem, ITransactionListQuery, MTransactionListItem } from 'src/types/transaction'

export const addressInList =
  (list: AddressEx[] = []) =>
  (address: string): boolean =>
    list.some((ownerAddress) => sameAddress(ownerAddress.value, address))

export const isDeeplinkedTx = (): boolean => {
  const txMatch = matchPath(history.location.pathname, {
    path: [SAFE_ROUTES.TRANSACTIONS_HISTORY, SAFE_ROUTES.TRANSACTIONS_QUEUE],
  })

  const deeplinkMatch = matchPath(history.location.pathname, {
    path: SAFE_ROUTES.TRANSACTIONS_SINGULAR,
  })

  return !txMatch && !!deeplinkMatch?.params?.[TRANSACTION_ID_SLUG]
}

export const makeHistoryTransactionsFromService = (
  list: ITransactionListItem[],
  currentPayload?: ITransactionListQuery,
): TransactionListPage => {
  const transaction: MTransactionListItem[] = makeTransactions(list)

  let next: string | undefined = undefined

  if (list?.length >= DEFAULT_PAGE_SIZE) {
    const nextPage = currentPayload ? currentPayload.pageIndex + 1 : DEFAULT_PAGE_FIRST + 1
    next = JSON.stringify({ pageIndex: nextPage })
  }

  const page: TransactionListPage = {
    results: [...transaction],
    next,
    previous: undefined,
  }

  return page
}

export const makeQueueTransactionsFromService = (
  list: ITransactionListItem[],
  currentPayload?: ITransactionListQuery,
): TransactionListPage => {
  const transaction: MTransactionListItem[] = makeTransactions(list)
  let next: string | undefined = undefined

  if (list.length >= DEFAULT_PAGE_SIZE) {
    const nextPage = currentPayload ? currentPayload.pageIndex + 1 : DEFAULT_PAGE_FIRST + 1
    next = JSON.stringify({ pageIndex: nextPage })
  }

  const page: TransactionListPage = {
    results: [...transaction],
    next,
    previous: undefined,
  }
  return page
}

const makeTransactions = (list: ITransactionListItem[]): MTransactionListItem[] =>
  list.map((tx: ITransactionListItem) => {
    return {
      conflictType: 'None',
      type: 'TRANSACTION',
      transaction: {
        executionInfo: {
          confirmationsRequired: tx?.ConfirmationsRequired || 0,
          confirmationsSubmitted: tx?.Confirmations || 0,
          rejections: tx?.Rejections || 0,
          nonce: +tx?.Sequence,
          type: 'MULTISIG',
          missingSigners: null,
        },
        id: tx?.MultisigTxId?.toString(),
        auraTxId: tx?.AuraTxId?.toString(),
        txHash: tx?.TxHash,
        timestamp: tx?.Timestamp ? new Date(tx?.Timestamp).getTime() : new Date(tx?.UpdatedAt).getTime(),
        txStatus: tx?.Status as TransactionStatus,
        txSequence: tx?.Sequence || '-1',
        txInfo: {
          type: 'Transfer',
          typeUrl: tx?.TypeUrl,
          amount: tx?.FinalAmount,
          denom: tx?.Denom,
          sender: {
            value: tx?.FromAddress,
            name: null,
            logoUri: null,
          },
          recipient: {
            value: tx?.ToAddress,
            name: null,
            logoUri: null,
          },
          direction: tx?.Direction as TransferDirection,
          transferInfo: {
            type: TokenType.NATIVE_COIN,
            value: tx?.Amount?.toString(),
          },
          displayType: tx?.DisplayType,
          contractAddress: tx?.ContractAddress,
        },
      },
    }
  })
