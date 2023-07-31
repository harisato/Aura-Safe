import { AccordionDetails } from '@aura/safe-react-components'
import { useEffect, useState } from 'react'
import { getDetailToken } from 'src/services'
import { formatTimeInWords } from 'src/utils/date'
import TxAmount from '../components/TxAmount'
import TxDetail from '../components/TxDetail'
import TxExecutionInfo from '../components/TxExecutionInfo'
import TxQuickAction from '../components/TxQuickAction'
import TxSequence from '../components/TxSequence'
import TxStatus from '../components/TxStatus'
import TxTime from '../components/TxTime'
import TxType from '../components/TxType'
import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'

export default function Transaction({
  transaction,
  hideSeq,
  curSeq,
  listTokens,
}: {
  transaction: any
  hideSeq?: boolean
  curSeq: string
  listTokens?: any
}) {
  const [txDetailLoaded, setTxDetailLoaded] = useState(false)
  let defToken
  if (transaction.txInfo.contractAddress) {
    defToken = listTokens.find((t) => t.address === transaction.txInfo.contractAddress)
  } else {
    defToken = listTokens.find(
      (t) =>
        t.denom === transaction.txInfo.denom ||
        t.symbol === transaction.txInfo.denom ||
        t.cosmosDenom === transaction.txInfo.denom,
    )
  }
  const [token, setToken] = useState(defToken)

  useEffect(() => {
    setToken(defToken)
  }, [listTokens])

  useEffect(() => {
    if (!token) {
      getContractDetail()
    }
  }, [token])

  if (!transaction) {
    return null
  }

  const getContractDetail = async () => {
    if (!transaction?.txInfo?.contractAddress) return
    try {
      const { data } = await getDetailToken(transaction?.txInfo?.contractAddress)
      setToken({ ...data, isNotExist: true, address: transaction.txInfo.contractAddress })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <NoPaddingAccordion
      id={`tx-${transaction.id}`}
      onChange={() => setTxDetailLoaded(true)}
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <StyledAccordionSummary>
        <StyledTransaction>
          {hideSeq ? (
            <TxSequence style={{ visibility: 'hidden' }} sequence={transaction.txSequence} />
          ) : (
            <TxSequence sequence={transaction.txSequence} />
          )}
          <TxType type={transaction.txInfo.displayType ?? transaction.txInfo.typeUrl} />
          <TxAmount amount={transaction.txInfo.typeUrl == 'Custom' ? 0 : transaction.txInfo.amount} token={token} />
          <TxTime time={transaction.timestamp ? formatTimeInWords(transaction.timestamp) : 'Unknown'} />
          <TxExecutionInfo
            required={transaction.executionInfo.confirmationsRequired}
            submitted={transaction.executionInfo.confirmationsSubmitted}
            rejected={transaction.executionInfo.rejections}
          />
          <TxQuickAction transaction={transaction} curSeq={curSeq} />
          <TxStatus shouldDisplayDot transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>
        {txDetailLoaded && <TxDetail transaction={transaction} isHistoryTx={false} token={token} />}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
