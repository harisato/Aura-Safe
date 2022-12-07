import { MsgVoteEncodeObject } from '@cosmjs/stargate'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'

const Vote = (value: MsgVoteEncodeObject['value']): MsgVoteEncodeObject => ({
  typeUrl: MsgTypeUrl.Vote,
  value: value,
})

export { Vote }
