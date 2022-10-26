import { Transfer } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useEffect, useState } from 'react'

import { useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'

type Details = {
  title: string
  address: string
  name?: string | undefined // AddressEx returns null if unknown
  quanlity: string
  toAddress?: string | undefined
  toName?: string | undefined
  toAvatarUrl?: string | undefined
}

export const TxInfoTransfer = ({
  txInfo,
  typeUrl,
  txDetails,
}: {
  txInfo: Transfer
  typeUrl: any
  txDetails: any
}): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)
  const [details, setDetails] = useState<Details | undefined>()

  useEffect(() => {
    if (assetInfo && assetInfo.type === 'Transfer') {
      if (typeUrl.TypeURL.typeUrl === '/cosmos.staking.v1beta1.MsgDelegate') {
        setDetails({
          title: 'Delegate',
          quanlity: assetInfo.amountWithSymbol,
          address: txInfo.recipient.value,
          name: txInfo.recipient.name || undefined,
        })
      }
      if (typeUrl.TypeURL.typeUrl === '/cosmos.staking.v1beta1.MsgUndelegate') {
        setDetails({
          title: 'Undelegate',
          quanlity: assetInfo.amountWithSymbol,
          address: txInfo.recipient.value,
          name: txInfo.recipient.name || undefined,
        })
      }
      if (typeUrl.TypeURL.typeUrl === '/cosmos.staking.v1beta1.MsgBeginRedelegate') {
        setDetails({
          title: 'Redelegate',
          quanlity: assetInfo.amountWithSymbol,
          address: txDetails?.txMessage?.[0]?.validatorSrcAddress,
          toAddress: txDetails?.txMessage?.[0]?.validatorDstAddress,
        })
      }
      if (typeUrl.TypeURL.typeUrl === '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward') {
        setDetails({
          title: 'Reward',
          quanlity: assetInfo.amountWithSymbol,
          address: txInfo.sender.value,
          name: txInfo.sender.name || undefined,
        })
      }

      if (txInfo?.direction?.toUpperCase() === 'INCOMING') {
        setDetails({
          title: 'Received',
          quanlity: assetInfo.amountWithSymbol,
          address: txInfo.sender.value,
          name: txInfo.sender.name || undefined,
        })
      }

      if (typeUrl.TypeURL.typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
        setDetails({
          title: 'Send',
          quanlity: assetInfo.amountWithSymbol,
          address: txInfo.recipient.value,
          name: txInfo.recipient.name || undefined,
        })
      }
    }
  }, [assetInfo, txInfo.direction, txInfo.recipient, txInfo.sender])

  return details ? <TxInfoDetails {...details} isTransferType txInfo={txInfo} /> : null
}
