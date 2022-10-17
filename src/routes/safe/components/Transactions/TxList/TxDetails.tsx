import { Icon, Link, Loader, Text } from '@aura/safe-react-components'
import cn from 'classnames'
import { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { useSelector } from 'react-redux'
import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'
import {
  ExpandedTxDetails,
  isModuleExecutionInfo,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { AlignItemsWithMargin, Centered, TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxExpandedActions } from './TxExpandedActions'
import { TxInfo } from './TxInfo'
import { TxLocationContext } from './TxLocationProvider'
import TxModuleInfo from './TxModuleInfo'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'
import { isCancelTxDetails, NOT_AVAILABLE } from './utils'

const NormalBreakingText = styled(Text)`
  line-break: normal;
  word-break: normal;
`

const TxDataGroup = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement | null => {
  console.log('txDetails1', txDetails)
  if (isTransferTxInfo(txDetails.txInfo) || isSettingsChangeTxInfo(txDetails.txInfo)) {
    return <TxInfo txInfo={txDetails.txInfo} typeUrl={txDetails} />
  }

  if (isCancelTxDetails(txDetails.txInfo) && isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    const txNonce = `${txDetails.detailedExecutionInfo.nonce ?? NOT_AVAILABLE}`
    const isTxExecuted = txDetails.executedAt

    // executed rejection transaction
    let message = `This is an on-chain rejection that didn't send any funds.
     This on-chain rejection replaced all transactions with nonce ${txNonce}.`

    if (!isTxExecuted) {
      // queued rejection transaction
      message = `This is an on-chain rejection that doesn't send any funds.
 Executing this on-chain rejection will replace all currently awaiting transactions with nonce ${txNonce}.`
    }
    return (
      <>
        <NormalBreakingText size="xl">{message}</NormalBreakingText>
        {!isTxExecuted && (
          <>
            <br />
            <Link
              href="https://aura.network/"
              target="_blank"
              rel="noreferrer"
              title="Why do I need to pay for rejecting a transaction?"
            >
              <AlignItemsWithMargin>
                <Text size="xl" as="span" color="primary">
                  Why do I need to pay for rejecting a transaction?
                </Text>
                <Icon size="sm" type="externalLink" color="primary" />
              </AlignItemsWithMargin>
            </Link>
          </>
        )}
      </>
    )
  }

  if (!txDetails.txData) {
    return null
  }

  return <TxData txData={txDetails.txData} txInfo={txDetails.txInfo} />
}

type TxDetailsProps = {
  transaction: Transaction
}

export const TxDetails = ({ transaction }: any): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const { data, loading } = useTransactionDetails(
    transaction.id,
    transaction.txHash,
    (transaction.txInfo as any)?.direction,
  )

  const txStatus = useLocalTxStatus(transaction)
  const willBeReplaced = txStatus === LocalTransactionStatus.WILL_BE_REPLACED
  const isPending = txStatus === LocalTransactionStatus.PENDING
  const currentUser = useSelector(userAccountSelector)
  const hasModule = transaction.txDetails && isModuleExecutionInfo(transaction.txDetails.detailedExecutionInfo)
  const isMultiSend = data && isMultiSendTxInfo(data.txInfo)

  // To avoid prop drilling into TxDataGroup, module details are positioned here accordingly
  const getModuleDetails = () => {
    if (!transaction.txDetails || !isModuleExecutionInfo(transaction.txDetails.detailedExecutionInfo)) {
      return null
    }

    return (
      <div className="tx-module">
        <TxModuleInfo detailedExecutionInfo={transaction.txDetails?.detailedExecutionInfo} />
      </div>
    )
  }

  if (loading) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  if (!data) {
    return (
      <TxDetailsContainer>
        <Text size="xl" strong>
          No data available
        </Text>
      </TxDetailsContainer>
    )
  }

  return (
    <TxDetailsContainer ownerRows={hasModule ? 3 : 2}>
      <div className={cn('tx-summary', { 'will-be-replaced': willBeReplaced })}>
        <TxSummary txDetails={data} />
      </div>
      {isMultiSend && getModuleDetails()}
      <div
        className={cn('tx-details', {
          'no-padding': isMultiSend,
          'not-executed': !data?.executedAt,
          'will-be-replaced': willBeReplaced,
        })}
        style={{ borderTop: '1px solid #484852' }}
      >
        <TxDataGroup txDetails={data} />
      </div>
      {!isMultiSend && getModuleDetails()}
      <div
        className={cn('tx-owners', {
          'will-be-replaced': willBeReplaced,
        })}
      >
        <TxOwners txDetails={data} isPending={isPending} />
      </div>
      {!isPending && !data.executedAt && txLocation !== 'history' && !!currentUser && (
        <div
          className={cn('tx-details-actions', { 'will-be-replaced': willBeReplaced })}
          style={{ borderTop: '1px solid #484852' }}
        >
          <TxExpandedActions transaction={transaction} />
        </div>
      )}
    </TxDetailsContainer>
  )
}
