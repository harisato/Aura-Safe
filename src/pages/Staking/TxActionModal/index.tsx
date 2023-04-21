import { Popup } from 'src/components/Popup'
import Header from 'src/components/Popup/Header'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import ClaimReward from './ClaimReward'
import Delegate from './Delegate'
import Redelegate from './Redelegate'
import Undelegate from './Undelegate'
export default function TxActionModal({ open, onClose, action, validator, amount, dstValidator, listReward, gasUsed }) {
  const title =
    action == MsgTypeUrl.Delegate
      ? 'Delegate'
      : action == MsgTypeUrl.Undelegate
      ? 'Undelegate'
      : action == MsgTypeUrl.Redelegate
      ? 'Redelegate'
      : 'Claim Reward'
  if (!validator && action != MsgTypeUrl.GetReward) {
    return <></>
  }
  return (
    <Popup title="" open={open} handleClose={onClose}>
      <Header onClose={onClose} title={title} />
      {action == MsgTypeUrl.Delegate && (
        <Delegate gasUsed={gasUsed} onClose={onClose} validator={validator} amount={amount} />
      )}
      {action == MsgTypeUrl.Undelegate && (
        <Undelegate gasUsed={gasUsed} onClose={onClose} validator={validator} amount={amount} />
      )}
      {action == MsgTypeUrl.Redelegate && (
        <Redelegate
          onClose={onClose}
          validator={validator}
          amount={amount}
          dstValidator={dstValidator}
          gasUsed={gasUsed}
        />
      )}
      {action == MsgTypeUrl.GetReward && <ClaimReward onClose={onClose} gasUsed={gasUsed} listReward={listReward} />}
    </Popup>
  )
}
