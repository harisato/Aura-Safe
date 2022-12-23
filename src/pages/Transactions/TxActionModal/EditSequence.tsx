import styled from 'styled-components'
import TextField from 'src/components/Input/TextField'
import ReloadIcon from 'src/assets/icons/reload.svg'
import { useSelector } from 'react-redux'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'

const Wrap = styled.div``
export default function EditSequence({ defaultSequence, sequence, setSequence }) {
  const { ethBalance: balance, nextQueueSeq, sequence: currentSequence } = useSelector(currentSafeWithNames)

  return (
    <Wrap>
      <TextField
        endIcon={<img src={ReloadIcon} onClick={() => setSequence(defaultSequence)} alt="icon" />}
        type="number"
        label="Transaction sequence"
        value={sequence}
        onChange={setSequence}
      />
      {+sequence == defaultSequence ? (
        <div></div>
      ) : +sequence > +nextQueueSeq ? (
        <div className="notice">
          Be aware that a transaction can only be executed after the execution of all other transactions with lower
          sequences.
        </div>
      ) : +sequence == +currentSequence ? (
        <div className="notice">
          There are other pending transactions with this sequence. Be aware that only one can be executed.
        </div>
      ) : +sequence < +currentSequence ? (
        <div className="notice">The chosen Tx sequence has already been executed.</div>
      ) : (
        <div></div>
      )}
    </Wrap>
  )
}
