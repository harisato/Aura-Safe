import { Loader } from '@aura/safe-react-components'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getExplorerInfo, getInternalChainId } from 'src/config'
import ImportTokenPopup from 'src/pages/Assets/Tokens/ImportTokenPopup'
import { extractSafeAddress } from 'src/routes/routes'
import { getAllTx } from 'src/services'
import { DEFAULT_PAGE_SIZE } from 'src/services/constant/common'
import { ITransactionListQuery } from 'src/types/transaction'
import { formatWithSchema } from 'src/utils/date'
import { grantedSelector } from 'src/utils/safeUtils/selector'
import { useTransactionDetails } from '../../../../utils/hooks/useTransactionDetails'
import { Centered, InlineEthHashInfo, TxDetailsContainer } from '../../styled'
import { TxActions } from './Action'
import TxMsg from './Message'
import { TxOwners } from './Owner'

export default function TxDetail({ transaction, isHistoryTx, token }) {
  const isOwner = useSelector(grantedSelector)
  const internalChainId = getInternalChainId()
  const safeAddress = extractSafeAddress()
  const { data, loading } = useTransactionDetails(transaction.id, transaction.txHash, transaction.auraTxId)
  const [importTokenPopup, setImportTokenPopup] = useState(false)
  const address = token?.address

  const handleImport = () => {
    setImportTokenPopup(true)
  }

  const fetchTransactionsFromAuraApi = () => {
    const payload: ITransactionListQuery = {
      safeAddress,
      pageIndex: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      isHistory: false,
      internalChainId: internalChainId,
    }
    getAllTx(payload)
  }

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
        <TxMsg tx={transaction} txDetail={data} token={token} onImport={handleImport} />
      </div>

      <div className="tx-exe">
        {transaction.txInfo.displayType !== 'Receive' ? (
          <>
            <TxOwners txDetails={data} />
            {!data.executor && isOwner && !isHistoryTx && (
              <div className="tx-action">
                <TxActions transaction={data} />
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {importTokenPopup && (
        <ImportTokenPopup
          open={importTokenPopup}
          onBack={() => {
            setImportTokenPopup(false)
          }}
          onClose={() => {
            setImportTokenPopup(false)
          }}
          onImport={fetchTransactionsFromAuraApi}
          addressContract={address}
        />
      )}
    </TxDetailsContainer>
  )
}
