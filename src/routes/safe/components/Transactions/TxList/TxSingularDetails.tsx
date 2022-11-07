import { Loader } from '@aura/safe-react-components'
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { currentChainId } from 'src/logic/config/store/selectors'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { isTxQueued, Transaction, TxLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { HistoryPayload, QueuedPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import {
  getTransactionWithLocationByAttribute,
  historyTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import {
  extractPrefixedSafeAddress,
  extractSafeAddress,
  generateSafeRoute,
  history,
  SafeRouteSlugs,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
  TRANSACTION_ID_NUMBER,
} from 'src/routes/routes'
import { getTxDetailById } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { AppReduxState } from 'src/store'
import { HistoryTxList } from './HistoryTxList'
import { QueueTxList } from './QueueTxList'
import { Centered } from './styled'
import { TxLocationContext } from './TxLocationProvider'
import { makeTransactionDetail } from './utils'

const TxSingularDetails = (): ReactElement => {
  const { [SAFE_ADDRESS_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()
  const { [TRANSACTION_ID_NUMBER]: txId = '' } = useParams<SafeRouteSlugs>()
  const [fetchedTx, setFetchedTx] = useState<TransactionDetails>()
  const [liveTx, setLiveTx] = useState<{ txLocation: TxLocation; transaction: Transaction }>()
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)
  const historyTxs = useSelector(historyTransactions)
  const safeAddress = extractSafeAddress()

  // We must use the tx from the store as the queue actions alter the tx
  const indexedTx = useSelector(
    (state: AppReduxState) =>
      fetchedTx
        ? getTransactionWithLocationByAttribute(state, { attributeName: 'id', attributeValue: fetchedTx.txId })
        : null,
    shallowEqual,
  )

  // The indexedTx can be temporailiy not found when re-fetching the queue
  // To avoid showing a loader, we use a locally cached version of it
  useEffect(() => {
    if (indexedTx != null) {
      setLiveTx(indexedTx)
    }
  }, [indexedTx])

  // When safeTxHash changes, we fetch tx details for this hash
  useEffect(() => {
    let isCurrent = true
    setFetchedTx(undefined)

    if (!txId) {
      const txsRoute = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, extractPrefixedSafeAddress())
      history.replace(txsRoute)
      return
    }

    const getTransaction = async (): Promise<void> => {
      // Remove the previously loaded tx (when making a new tx from the single tx route)
      setLiveTx(undefined)

      let txDetails: any
      try {
        // txDetails = await fetchSafeTransaction(safeTxHash)
        const res = await getTxDetailById(txId, safeAddress, '')

        const { ErrorCode, Data } = res
        if (ErrorCode !== MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
          const txsRoute = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, extractPrefixedSafeAddress())
          history.push(txsRoute)
        } else {
          txDetails = Data
        }
      } catch (e) {
        logError(Errors._614, e.message)
        return
      }

      if (isCurrent) {
        const tempTxDetail = { ...txDetails, txId: txDetails?.Id?.toString() }

        setFetchedTx(tempTxDetail)
      }
    }

    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash, txId, historyTxs, setFetchedTx, setLiveTx, safeAddress])

  // Add the tx to the store
  useEffect(() => {
    if (!fetchedTx) return

    // Format the tx details into a History or Queue-like tx item
    // const listItemTx = makeTxFromDetails(fetchedTx)
    const listItemTx = makeTransactionDetail(fetchedTx)

    const payload: HistoryPayload | QueuedPayload = {
      chainId,
      safeAddress: extractSafeAddress(),
      values: [
        {
          transaction: listItemTx,
          type: 'TRANSACTION', // Other types are discarded in reducer
          conflictType: 'None', // Not used in reducer
        },
      ],
    }
    // And add it to the corresponding list in the store
    dispatch(isTxQueued(listItemTx.txStatus) ? addQueuedTransactions(payload) : addHistoryTransactions(payload))
  }, [fetchedTx, chainId, dispatch])

  if (!liveTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const { transaction, txLocation } = liveTx
  const TxList = isTxQueued(transaction.txStatus) ? QueueTxList : HistoryTxList

  return (
    <TxLocationContext.Provider value={{ txLocation }}>
      <TxList transactions={[[transaction.timestamp.toString(), [transaction]]]} />
    </TxLocationContext.Provider>
  )
}

export default TxSingularDetails
