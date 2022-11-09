import { CustomIconText } from 'src/components/CustomIconText'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import IncomingIcon from 'src/assets/icons/incoming.svg'
import OutgoingIcon from 'src/assets/icons/outgoing.svg'
import CustomIcon from 'src/assets/icons/custom.svg'
export default function TxType({ type }) {
  if (type == MsgTypeUrl.Delegate) {
    return (
      <div className="tx-type">
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Delegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Undelegate) {
    return (
      <div className="tx-type">
        <img src={IncomingIcon} alt="incoming-icon" />
        <p>Undelegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Send) {
    return (
      <div className="tx-type">
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Send</p>
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
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Redelegate</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.Vote) {
    return (
      <div className="tx-type">
        <img src={OutgoingIcon} alt="outgoing-icon" />
        <p>Vote</p>
      </div>
    )
  }
  if (type == MsgTypeUrl.GetReward) {
    return (
      <div className="tx-type">
        <img src={IncomingIcon} alt="incoming-icon" />
        <p>Claim Reward</p>
      </div>
    )
  }
  return (
    <div className="tx-type">
      <img src={CustomIcon} alt="custom-icon" />
      <p>Unknown</p>
    </div>
  )
}
