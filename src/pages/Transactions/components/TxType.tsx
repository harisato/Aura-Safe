import { Icon } from '@aura/safe-react-components'
import CustomIcon from 'src/assets/icons/custom.svg'
import IncomingIcon from 'src/assets/icons/incoming.svg'
import OutgoingIcon from 'src/assets/icons/outgoing.svg'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'

export default function TxType({ type }) {
  if (type == MsgTypeUrl.Delegate) {
    return (
      <div className="tx-type">
        <Icon size="sm" type="stakingAura" />
        <p>Delegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Undelegate) {
    return (
      <div className="tx-type">
        <Icon size="sm" type="stakingAura" />

        <p>Undelegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Send || type === 'Send') {
    return (
      <div className="tx-type">
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Send</p>
      </div>
    )
  }
  if (type == 'Receive') {
    return (
      <div className="tx-type">
        <img src={IncomingIcon} alt="incoming-icon" />
        <p>Receive</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.MultiSend) {
    return (
      <div className="tx-type">
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Multi-send</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Redelegate) {
    return (
      <div className="tx-type">
        <Icon size="sm" type="stakingAura" />

        <p>Redelegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Vote) {
    return (
      <div className="tx-type">
        <Icon size="sm" type="votingAura" />

        <p>Vote</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.GetReward) {
    return (
      <div className="tx-type">
        <Icon size="sm" type="stakingAura" />

        <p>Claim Reward</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.ExecuteContract) {
    return (
      <div className="tx-type">
        <img src={CustomIcon} alt="custom-icon" />
        <p>Contract Interaction</p>
      </div>
    )
  }
  return (
    <div className="tx-type">
      <img src={CustomIcon} alt="custom-icon" />
      <p>Custom Transaction</p>
    </div>
  )
}
