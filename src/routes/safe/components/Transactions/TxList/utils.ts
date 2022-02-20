import {
  AddressEx,
  TransactionInfo,
  Transfer,
  TokenType,
  TransactionDetails,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  TransactionListPage,
  TransferDirection,
  TransactionListItem,
  TransactionStatus,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'bignumber.js'
import { now } from 'lodash'
import { matchPath } from 'react-router-dom'
import { getNativeCurrency } from 'src/config'
import { getNativeCurrencyAddress } from 'src/config/utils'

import {
  isCustomTxInfo,
  isModuleExecutionInfo,
  isMultiSigExecutionDetails,
  isTransferTxInfo,
  isTxQueued,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES, TRANSACTION_ID_SLUG, history } from 'src/routes/routes'
import { ITransactionListItem } from 'src/types/transaction'

export const NOT_AVAILABLE = 'n/a'
interface AmountData {
  decimals?: number | string
  symbol?: string
  value: number | string
}

const getAmountWithSymbol = (
  { decimals = 0, symbol = NOT_AVAILABLE, value }: AmountData,
  formatted = false,
): string => {
  const nonFormattedValue = new BigNumber(value).times(`1e-${decimals}`).toFixed()
  const finalValue = formatted ? formatAmount(nonFormattedValue).toString() : nonFormattedValue
  const txAmount = finalValue === 'NaN' ? NOT_AVAILABLE : finalValue

  return `${txAmount} ${symbol}`
}

export const getTxAmount = (txInfo?: TransactionInfo, formatted = true): string => {
  if (!txInfo || !isTransferTxInfo(txInfo)) {
    return NOT_AVAILABLE
  }

  switch (txInfo.transferInfo.type) {
    case TokenType.ERC20:
      return getAmountWithSymbol(
        {
          decimals: `${txInfo.transferInfo.decimals ?? 0}`,
          symbol: `${txInfo.transferInfo.tokenSymbol ?? NOT_AVAILABLE}`,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    case TokenType.ERC721:
      // simple workaround to avoid displaying unexpected values for incoming NFT transfer
      return `1 ${txInfo.transferInfo.tokenSymbol}`
    case TokenType.NATIVE_COIN: {
      const nativeCurrency = getNativeCurrency()
      return getAmountWithSymbol(
        {
          decimals: nativeCurrency.decimals,
          symbol: nativeCurrency.symbol,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    }
    default:
      return NOT_AVAILABLE
  }
}

type txTokenData = {
  address: string
  value: string
  decimals: number | null
}

export const getTxTokenData = (txInfo: Transfer): txTokenData => {
  const nativeCurrency = getNativeCurrency()
  switch (txInfo.transferInfo.type) {
    case TokenType.ERC20:
      return {
        address: txInfo.transferInfo.tokenAddress,
        value: txInfo.transferInfo.value,
        decimals: txInfo.transferInfo.decimals,
      }
    case TokenType.ERC721:
      return { address: txInfo.transferInfo.tokenAddress, value: '1', decimals: 0 }
    default:
      return {
        address: getNativeCurrencyAddress(),
        value: txInfo.transferInfo.value,
        decimals: nativeCurrency.decimals,
      }
  }
}

export const isCancelTxDetails = (txInfo: Transaction['txInfo']): boolean =>
  // custom transaction
  isCustomTxInfo(txInfo) &&
  // flag-based identification
  txInfo.isCancellation

export const addressInList =
  (list: AddressEx[] = []) =>
    (address: string): boolean =>
      list.some((ownerAddress) => sameAddress(ownerAddress.value, address))

export const getTxTo = ({ txInfo }: Pick<Transaction, 'txInfo'>): AddressEx | undefined => {
  switch (txInfo.type) {
    case 'Transfer': {
      return txInfo.recipient
    }
    case 'SettingsChange': {
      return undefined
    }
    case 'Custom': {
      return txInfo.to
    }
    case 'Creation': {
      return txInfo.factory || undefined
    }
  }
}

// Our store does not match the details returned from the endpoint
export const makeTxFromDetails = (txDetails: TransactionDetails): Transaction => {
  const getMissingSigners = ({
    signers,
    confirmations,
  }: MultisigExecutionDetails): MultisigExecutionInfo['missingSigners'] => {
    const missingSigners = signers.filter(({ value }) => {
      const hasConfirmed = confirmations?.some(({ signer }) => signer?.value === value)
      return !hasConfirmed
    })

    return missingSigners.length ? missingSigners : null
  }

  const getMultisigExecutionInfo = ({
    detailedExecutionInfo,
  }: TransactionDetails): MultisigExecutionInfo | undefined => {
    if (!isMultiSigExecutionDetails(detailedExecutionInfo)) return undefined

    return {
      type: detailedExecutionInfo.type,
      nonce: detailedExecutionInfo.nonce,
      confirmationsRequired: detailedExecutionInfo.confirmationsRequired,
      confirmationsSubmitted: detailedExecutionInfo.confirmations?.length || 0,
      missingSigners: getMissingSigners(detailedExecutionInfo),
    }
  }

  const executionInfo: Transaction['executionInfo'] = isModuleExecutionInfo(txDetails.detailedExecutionInfo)
    ? txDetails.detailedExecutionInfo
    : getMultisigExecutionInfo(txDetails)

  // Will only be used as a fallback whilst waiting on backend tx creation cache
  const now = Date.now()
  const timestamp = isTxQueued(txDetails.txStatus)
    ? isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)
      ? txDetails.detailedExecutionInfo.submittedAt
      : now
    : txDetails.executedAt || now

  const tx: Transaction = {
    id: txDetails.txId,
    timestamp,
    txStatus: txDetails.txStatus,
    txInfo: txDetails.txInfo,
    executionInfo,
    safeAppInfo: txDetails?.safeAppInfo || undefined,
    txDetails,
  }

  return tx
}

export const isDeeplinkedTx = (): boolean => {
  const txMatch = matchPath(history.location.pathname, {
    path: [SAFE_ROUTES.TRANSACTIONS_HISTORY, SAFE_ROUTES.TRANSACTIONS_QUEUE],
  })

  const deeplinkMatch = matchPath(history.location.pathname, {
    path: SAFE_ROUTES.TRANSACTIONS_SINGULAR,
  })

  return !txMatch && !!deeplinkMatch?.params?.[TRANSACTION_ID_SLUG]
}

export const isAwaitingExecution = (
  txStatus: typeof LocalTransactionStatus[keyof typeof LocalTransactionStatus],
): boolean => [LocalTransactionStatus.AWAITING_EXECUTION, LocalTransactionStatus.PENDING_FAILED].includes(txStatus)

export const makeTransactionsFromService = (list: ITransactionListItem[]): TransactionListPage => {
  console.log('list', list)
  /**
  Amount: 1
  CreatedAt: "2022-02-18T01:33:57.314Z"
  Denom: "uaura"
  FromAddress: "aura14g36ajgngkmw2jp26zvc4388ecxmppmxqgz5kx"
  Id: 27
  Signatures: []
  Status: "PENDING"
  ToAddress: "aura14g36ajgngkmw2jp26zvc4388ecxmppmxqgz5kx"
  TxHash: null
  UpdatedAt: "2022-02-18T01:33:57.314Z"
   */



  const transaction: TransactionListItem[] = list.map(tx => {
    const trans: TransactionListItem = {
      conflictType: 'None',
      type: 'TRANSACTION',
      transaction: {
        id: tx.Id.toString(),
        timestamp: new Date(tx.UpdatedAt).getTime(),
        txStatus: TransactionStatus.PENDING,
        txInfo: {
          type: 'Transfer',
          sender: {
            value: tx.FromAddress,
            name: null,
            logoUri: null,
          },
          recipient: {
            value: tx.ToAddress,
            name: null,
            logoUri: null,
          },
          direction: TransferDirection.OUTGOING,
          transferInfo: {
            type: TokenType.NATIVE_COIN,
            value: (tx.Amount).toString(),
          },
        },
      }
    }

    return trans
  })
  let page: TransactionListPage = {
    results: [...transaction]
  }


  return page;
} 
