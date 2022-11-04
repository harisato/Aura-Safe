import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { formatNativeToken } from 'src/utils'
import { AddressInfo } from '../AddressInfo'
import { Fragment } from 'react'
export default function TxMsg({ tx, txDetail }) {
  const type = tx.txInfo.typeUrl
  const amount = formatNativeToken(txDetail.txMessage[0]?.amount || 0)
  if (!txDetail) return null
  if (type == MsgTypeUrl.Delegate) {
    return (
      <div className="tx-msg">
        <strong>
          Delegate <span className="token">{amount}</span> to:
        </strong>
        <AddressInfo address={txDetail?.txMessage[0]?.validatorAddress} />
      </div>
    )
  }
  if (type == MsgTypeUrl.Undelegate) {
    return (
      <div className="tx-msg">
        <strong>
          Undelegate <span className="token">{amount}</span> from:
        </strong>
        <AddressInfo address={txDetail?.txMessage[0]?.validatorAddress} />
      </div>
    )
  }
  if (type == MsgTypeUrl.Send) {
    return (
      <div className="tx-msg">
        <strong>
          Send <span className="token">{amount}</span> to:
        </strong>
        <AddressInfo address={txDetail?.txMessage[0]?.toAddress} />
      </div>
    )
  }
  if (type == MsgTypeUrl.MultiSend) {
    return (
      <div className="tx-msg">
        <strong>
          Send total of <span className="token">{amount}</span> to:
        </strong>
      </div>
    )
  }
  if (type == MsgTypeUrl.Redelegate) {
    return (
      <div className="tx-msg">
        <strong>
          Redelegate <span className="token">{amount}</span> from:
        </strong>
        <AddressInfo address={txDetail?.txMessage[0]?.validatorSrcAddress} />
        <strong>To:</strong>
        <AddressInfo address={txDetail?.txMessage[0]?.validatorDstAddress} />
      </div>
    )
  }
  if (type == MsgTypeUrl.Vote) {
    return (
      <div className="tx-msg">
        <strong>
          Vote <span>Unknown</span> on Proposal <span className="token">#23</span>:
        </strong>
      </div>
    )
  }
  if (type == MsgTypeUrl.GetReward) {
    return (
      <div className="tx-msg">
        <strong>Claim reward from:</strong>
        {txDetail?.txMessage &&
          txDetail?.txMessage?.map((msg, index) => {
            return (
              <Fragment key={index}>
                <AddressInfo address={msg?.validatorAddress} />
                <strong>
                  Amount: <span className="token">{formatNativeToken(msg?.amount || 0)}</span>
                </strong>
              </Fragment>
            )
          })}
      </div>
    )
  }
  return <div></div>
}
