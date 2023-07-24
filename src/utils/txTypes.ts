import { GeneratedType } from '@cosmjs/proto-signing'
import { MsgSend, MsgMultiSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { MsgVote, MsgDeposit, MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx'
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgMigrateContract,
  MsgStoreCode,
  MsgInstantiateContract,
  MsgUpdateAdmin,
} from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
  MsgCreateValidator,
  MsgEditValidator,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgExec, MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx'
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import {
  MsgAcknowledgement,
  MsgChannelCloseConfirm,
  MsgChannelCloseInit,
  MsgChannelOpenAck,
  MsgChannelOpenConfirm,
  MsgChannelOpenInit,
  MsgChannelOpenTry,
  MsgRecvPacket,
  MsgTimeout,
  MsgTimeoutOnClose,
} from 'cosmjs-types/ibc/core/channel/v1/tx'
import {
  MsgCreateClient,
  MsgSubmitMisbehaviour,
  MsgUpdateClient,
  MsgUpgradeClient,
} from 'cosmjs-types/ibc/core/client/v1/tx'
import {
  MsgConnectionOpenAck,
  MsgConnectionOpenConfirm,
  MsgConnectionOpenInit,
  MsgConnectionOpenTry,
} from 'cosmjs-types/ibc/core/connection/v1/tx'

export const TxTypes: Iterable<[string, GeneratedType]> = [
  ['/cosmos.base.v1beta1.Coin', Coin],
  ['/cosmos.bank.v1beta1.MsgSend', MsgSend],
  ['/cosmos.bank.v1beta1.MsgMultiSend', MsgMultiSend],
  ['/cosmos.staking.v1beta1.MsgDelegate', MsgDelegate],
  ['/cosmos.staking.v1beta1.MsgBeginRedelegate', MsgBeginRedelegate],
  ['/cosmos.staking.v1beta1.MsgUndelegate', MsgUndelegate],
  ['/cosmos.staking.v1beta1.MsgCreateValidator', MsgCreateValidator],
  ['/cosmos.staking.v1beta1.MsgEditValidator', MsgEditValidator],
  ['/cosmos.gov.v1beta1.MsgVote', MsgVote],
  ['/cosmos.gov.v1beta1.MsgDeposit', MsgDeposit],
  ['/cosmos.gov.v1beta1.MsgSubmitProposal', MsgSubmitProposal],
  ['/cosmos.authz.v1beta1.MsgExec', MsgExec],
  ['/cosmos.authz.v1beta1.MsgGrant', MsgGrant],
  ['/cosmos.authz.v1beta1.MsgRev', MsgRevoke],
  ['/cosmos.distribution.v1beta1.MsgFundCommunityPool', MsgFundCommunityPool],
  ['/cosmos.distribution.v1beta1.MsgSetWithdrawAddress', MsgSetWithdrawAddress],
  ['/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward', MsgWithdrawDelegatorReward],
  ['/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission', MsgWithdrawValidatorCommission],
  ['/cosmos.feegrant.v1beta1.MsgGrantAllowance', MsgGrantAllowance],
  ['/cosmos.feegrant.v1beta1.MsgRevokeAllowance', MsgRevokeAllowance],
  ['/ibc.applications.transfer.v1.MsgTransfer', MsgTransfer],
  ['/ibc.core.channel.v1.MsgAcknowledgement', MsgAcknowledgement],
  ['/ibc.core.channel.v1.MsgChannelCloseConfirm', MsgChannelCloseConfirm],
  ['/ibc.core.channel.v1.MsgChannelCloseInit', MsgChannelCloseInit],
  ['/ibc.core.channel.v1.MsgChannelOpenAck', MsgChannelOpenAck],
  ['/ibc.core.channel.v1.MsgChannelOpenConfirm', MsgChannelOpenConfirm],
  ['/ibc.core.channel.v1.MsgChannelOpenInit', MsgChannelOpenInit],
  ['/ibc.core.channel.v1.MsgChannelOpenTry', MsgChannelOpenTry],
  ['/ibc.core.channel.v1.MsgRecvPacket', MsgRecvPacket],
  ['/ibc.core.channel.v1.MsgTimeout', MsgTimeout],
  ['/ibc.core.channel.v1.MsgTimeoutOnClose', MsgTimeoutOnClose],
  ['/ibc.core.client.v1.MsgCreateClient', MsgCreateClient],
  ['/ibc.core.client.v1.MsgSubmitMisbehaviour', MsgSubmitMisbehaviour],
  ['/ibc.core.client.v1.MsgUpdateClient', MsgUpdateClient],
  ['/ibc.core.client.v1.MsgUpgradeClient', MsgUpgradeClient],
  ['/ibc.core.connection.v1.MsgConnectionOpenAck', MsgConnectionOpenAck],
  ['/ibc.core.connection.v1.MsgConnectionOpenConfirm', MsgConnectionOpenConfirm],
  ['/ibc.core.connection.v1.MsgConnectionOpenInit', MsgConnectionOpenInit],
  ['/ibc.core.connection.v1.MsgConnectionOpenTry', MsgConnectionOpenTry],
  ['/cosmwasm.wasm.v1.MsgClearAdmin', MsgClearAdmin],
  ['/cosmwasm.wasm.v1.MsgExecuteContract', MsgExecuteContract],
  ['/cosmwasm.wasm.v1.MsgMigrateContract', MsgMigrateContract],
  ['/cosmwasm.wasm.v1.MsgStoreCode', MsgStoreCode],
  ['/cosmwasm.wasm.v1.MsgInstantiateContract', MsgInstantiateContract],
  ['/cosmwasm.wasm.v1.MsgUpdateAdmin', MsgUpdateAdmin],
]
