import Loader from 'src/components/Loader'
import styled from 'styled-components'
import { useTransactionStatus } from '../hooks/useTransactionStatus'

const SmallDot = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

const CircularProgressPainter = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  > div {
    margin-right: 8px;
  }
  > p {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
  }
`

export default function TxStatus({ transaction, shouldDisplayDot = false }) {
  const status = useTransactionStatus(transaction)
  return (
    <CircularProgressPainter color={status.color} className="tx-status">
      {transaction.txStatus == 'PENDING' ? (
        <Loader color={status.color} size={14} />
      ) : (
        <SmallDot color={status.color} />
      )}
      <p style={{ color: status.color }}>{status.text}</p>
    </CircularProgressPainter>
  )
}
