import { Loader } from '@aura/safe-react-components'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getExplorerInfo } from 'src/config'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { formatWithSchema } from 'src/utils/date'
import { useTransactionDetails } from '../../../../utils/hooks/useTransactionDetails'
import { Centered, InlineEthHashInfo, TxDetailsContainer } from '../../styled'
import { TxActions } from './Action'
import TxMsg from './Message'
import { TxOwners } from './Owner'
export default function TxDetail({ transaction, isHistoryTx }) {
  const isOwner = useSelector(grantedSelector)
  const { data, loading } = useTransactionDetails(transaction.id, transaction.txHash, transaction.auraTxId)

  if (loading) {
    return (
      <Centered padding={20}>
        <Loader size="md" />
      </Centered>
    )
  }
  
  if (!data) {
    return (
      <Centered padding={20}>
        <strong>No data available!</strong>
      </Centered>
    )
  }

  return (
    <TxDetailsContainer>
      <div>
        <div className="tx-summary">
          {data.txHash && (
            <div className="tx-hash">
              Transaction hash:{' '}
              <span>
                <InlineEthHashInfo
                  textSize="lg"
                  textColor="textAura"
                  hash={data.txHash}
                  showCopyBtn
                  shortenHash={16}
                  explorerUrl={data.txHash ? getExplorerInfo(data.txHash) : undefined}
                />
              </span>
            </div>
          )}
          {data.createAt && (
            <p className="time">
              Created: <span>{formatWithSchema(data.createAt, 'MMM d, yyyy - h:mm:ss a')}</span>
            </p>
          )}
          {data.executedAt && (
            <p className="time">
              Executed: <span>{formatWithSchema(data.executedAt, 'MMM d, yyyy - h:mm:ss a')}</span>
            </p>
          )}
        </div>
        <TxMsg tx={transaction} txDetail={data} />
      </div>

      <div className="tx-exe">
        <TxOwners txDetails={data} />
        {!data.executor && isOwner && !isHistoryTx && (
          <div className="tx-action">
            <TxActions transaction={data} />
          </div>
        )}
      </div>
    </TxDetailsContainer>
  )
}
