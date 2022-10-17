import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchTransactionDetailsByHash } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'
import { TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'

export type LoadTransactionDetails = {
  data?: any
  loading: boolean
}

export const useTransactionDetails = (
  transactionId: string,
  txHash?: string,
  direction?: TransferDirection,
): LoadTransactionDetails => {
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<LoadTransactionDetails>({
    loading: true,
    data: undefined,
  })
  const data = useSelector((state: AppReduxState) =>
    getTransactionByAttribute(state, { attributeValue: transactionId, attributeName: 'id' }),
  )

  useEffect(() => {
    const dataTemp = {
      ...data?.txDetails,
      TypeURL: data?.txInfo,
    }

    if (data?.txDetails) {
      setTxDetails({ loading: false, data: dataTemp })
    } else {
      // lookup tx details
      // dispatch.current(fetchTransactionDetails({ transactionId }))

      dispatch.current(fetchTransactionDetailsByHash({ transactionId, txHash: txHash || null, direction }))
    }
  }, [data?.txDetails, transactionId, txHash, direction])

  return txDetails
}
