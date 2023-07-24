import styled from 'styled-components'
import TextField from 'src/components/Input/TextField'
import ReloadIcon from 'src/assets/icons/reload.svg'
import { useSelector } from 'react-redux'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { usePagedQueuedTransactions } from 'src/utils/hooks/usePagedQueuedTransactions'

const Wrap = styled.div`
  .noti {
    font-size: 12px;
    line-height: 16px;
    margin-right: 16px;
    margin-top: 8px;
    color: #b4b8c0;
  }
`
export default function EditSequence({ defaultSequence, sequence, setSequence }) {
  const { nativeBalance: balance, nextQueueSeq, sequence: currentSequence } = useSelector(currentSafeWithNames)
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()

  return (
    <Wrap>
      <TextField
        endIcon={<img src={ReloadIcon} onClick={() => setSequence(defaultSequence)} alt="icon" />}
        type="number"
        label="Transaction sequence"
        value={sequence}
        onChange={setSequence}
      />
      {sequence == defaultSequence ? (
        <div></div>
      ) : !sequence || sequence.trim().length == 0 ? (
        <div className="noti">Please enter a sequence number.</div>
      ) : +sequence < +currentSequence ? (
        <div className="noti">The chosen Tx sequence has already been executed.</div>
      ) : transactions.some(([nonce, txs]) => +nonce == +sequence) ? (
        <div className="noti">
          There are other pending transactions with this sequence. Be aware that only one can be executed.
        </div>
      ) : +sequence > +nextQueueSeq ? (
        <div className="noti">
          Be aware that a transaction can only be executed after the execution of all other transactions with lower
          sequences.
        </div>
      ) : (
        <div></div>
      )}
    </Wrap>
  )
}
