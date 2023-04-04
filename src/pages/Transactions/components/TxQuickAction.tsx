import { toBase64 } from '@cosmjs/encoding'
import { coin, coins } from '@cosmjs/stargate'
import { Tooltip } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Check from 'src/assets/icons/GradientCheck.svg'
import PaperPlaneTiltIcon from 'src/assets/icons/PaperPlaneTilt.svg'
import X from 'src/assets/icons/X.svg'
import { getChainInfo, getCoinMinimalDenom, getInternalChainId, getShortName } from 'src/config'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import { fetchTransactionDetailsById } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress, generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'
import { confirmSafeTransaction, rejectTransactionById, sendSafeTransaction } from 'src/services'
import { AppReduxState } from 'src/store'
import { ICreateSafeTransaction } from 'src/types/transaction'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  flex: unset !important;
  width: 40px;
  > .action {
    margin: 0px 4px;
  }
`

export default function TxQuickAction({ transaction, curSeq }) {
  const userWalletAddress = useSelector(userAccountSelector)

  const chainInfo = getChainInfo()
  const safeAddress = extractSafeAddress()
  const chainId = chainInfo.chainId
  const denom = getCoinMinimalDenom()
  const [loading, setLoading] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const data = useSelector((state: AppReduxState) =>
    getTransactionByAttribute(state, { attributeValue: transaction.id, attributeName: 'id' }),
  )
  const dispatch = useDispatch()

  const confirmTxFromApi = async (data: any, chainId: any, safeAddress: any) => {
    const result = await confirmSafeTransaction(data)
    const { ErrorCode } = result
    if (ErrorCode === 'SUCCESSFUL') {
      history.push(
        generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          shortName: getShortName(),
          safeAddress,
        }),
      )
      dispatch(fetchTransactions(chainId, safeAddress, true))
      setLoading(false)
    } else {
      setLoading(false)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction(
            result?.Message
              ? {
                  message: result?.Message,
                  options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                }
              : NOTIFICATIONS.TX_FAILED_MSG,
          ),
        ),
      )
    }
  }

  useEffect(() => {
    if (isWaiting && data?.txDetails) {
      confirmHandler(null)
    }
  }, [data?.txDetails, isWaiting])

  const confirmHandler = async (event) => {
    event?.stopPropagation()
    if (loading) return
    try {
      setLoading(true)
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_CREATE_MSG))
      if (!data?.txDetails) {
        dispatch(fetchTransactionDetailsById({ transactionId: transaction.id }))
        setIsWaiting(true)
        return
      }
      setIsWaiting(false)
      const type = (data?.txInfo as any)?.typeUrl
      let signResult: any = null
      let sendFee: any = null
      let Data: any = null
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))

      switch (type) {
        case MsgTypeUrl.GetReward:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }

          Data = data?.txDetails?.txMessage?.map((msg) => ({
            typeUrl: MsgTypeUrl.GetReward,
            value: {
              delegatorAddress: msg.delegatorAddress,
              validatorAddress: msg.validatorAddress,
            },
          }))

          break
        case MsgTypeUrl.Delegate:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }
          Data = {
            amount: coin(data?.txDetails?.txMessage[0]?.amount, denom),
            delegatorAddress: data?.txDetails?.txMessage[0]?.delegatorAddress,
            validatorAddress: data?.txDetails?.txMessage[0]?.validatorAddress,
          }
          break
        case MsgTypeUrl.MultiSend:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }

          Data = [
            {
              typeUrl: MsgTypeUrl.MultiSend,
              value: {
                inputs: data?.txDetails?.txMessage[0]?.inputs,
                outputs: data?.txDetails?.txMessage[0]?.outputs,
              },
            },
          ]
          break
        case MsgTypeUrl.Redelegate:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }

          Data = {
            delegatorAddress: data?.txDetails?.txMessage[0]?.delegatorAddress,
            validatorSrcAddress: data?.txDetails?.txMessage[0]?.validatorSrcAddress,
            validatorDstAddress: data?.txDetails?.txMessage[0]?.validatorDstAddress,
            amount: coin(data?.txDetails?.txMessage[0]?.amount, denom),
          }
          break
        case MsgTypeUrl.Send:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }
          Data = {
            amount: coins(data?.txDetails?.txMessage[0]?.amount, denom),
            fromAddress: data?.txDetails?.txMessage[0]?.fromAddress,
            toAddress: data?.txDetails?.txMessage[0]?.toAddress,
          }
          break
        case MsgTypeUrl.Undelegate:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }
          Data = {
            delegatorAddress: data?.txDetails?.txMessage[0]?.delegatorAddress,
            validatorAddress: data?.txDetails?.txMessage[0]?.validatorAddress,
            amount: coin(data?.txDetails?.txMessage[0]?.amount, denom),
          }
          break
        case MsgTypeUrl.Vote:
          sendFee = {
            amount: coins(data?.txDetails?.fee, denom),
            gas: data?.txDetails?.gas.toString(),
          }
          Data = {
            option: data?.txDetails?.txMessage[0]?.voteOption,
            proposalId: data?.txDetails?.extraDetails?.proposalDetail?.id,
            voter: safeAddress,
          }
          break

        default:
          break
      }

      signResult = await createMessage(chainId, safeAddress, type, Data, sendFee, data?.txSequence)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const payload: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: userWalletAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
        transactionId: data?.id,
      }
      confirmTxFromApi(payload, chainId, safeAddress)
    } catch (error) {
      setLoading(false)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction(
            error?.message
              ? {
                  message: error?.message,
                  options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                }
              : NOTIFICATIONS.TX_REJECTED_MSG,
          ),
        ),
      )
    }
  }

  const rejectHandler = async (event) => {
    event?.stopPropagation()
    if (loading) return
    try {
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_CREATE_MSG))
      setLoading(true)
      const payload = {
        transactionId: transaction.id,
        internalChainId: getInternalChainId(),
      }
      const result = await rejectTransactionById(payload)
      const { ErrorCode } = result

      if (ErrorCode === 'SUCCESSFUL') {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_REJECTED_MSG_SUCCESS))
      } else {
        dispatch(
          enqueueSnackbar(
            result?.Message
              ? {
                  message: result?.Message,
                  options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                }
              : NOTIFICATIONS.TX_FAILED_MSG,
          ),
        )
      }
      setLoading(false)
      const chainInfo = getChainInfo()
      const chainId = chainInfo.chainId
      dispatch(fetchTransactions(chainId, safeAddress))
    } catch (error) {
      setLoading(false)
      dispatch(
        enqueueSnackbar(
          error?.message
            ? {
                message: error?.message,
                options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
              }
            : NOTIFICATIONS.TX_FAILED_MSG,
        ),
      )
    }
  }

  const executeHandler = async (event) => {
    event?.stopPropagation()
    if (loading) return
    try {
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_CREATE_MSG))
      setLoading(true)
      const payload = {
        transactionId: transaction.id,
        internalChainId: getInternalChainId(),
        owner: userWalletAddress,
      }
      const result = await sendSafeTransaction(payload)
      const { ErrorCode } = result

      if (ErrorCode === 'SUCCESSFUL') {
        dispatch(enqueueSnackbar(NOTIFICATIONS.TX_EXECUTED_MSG))
      } else {
        dispatch(
          enqueueSnackbar(
            result?.Message
              ? {
                  message: result?.Message,
                  options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                }
              : NOTIFICATIONS.TX_FAILED_MSG,
          ),
        )
      }
      setLoading(false)
      const chainInfo = getChainInfo()
      const chainId = chainInfo.chainId
      dispatch(fetchTransactions(chainId, safeAddress))
    } catch (error) {
      setLoading(false)
      dispatch(
        enqueueSnackbar(
          error?.message
            ? {
                message: error?.message,
                options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
              }
            : NOTIFICATIONS.TX_FAILED_MSG,
        ),
      )
    }
  }

  if (transaction?.executionInfo?.confirmationsRequired <= transaction?.executionInfo?.confirmationsSubmitted.length) {
    if (+curSeq != +transaction.txSequence || transaction.txStatus == 'PENDING') {
      return <Wrap></Wrap>
    }
    return (
      <Wrap>
        <div className="action" onClick={executeHandler}>
          <Tooltip arrow placement="top" title="Execute">
            <img src={PaperPlaneTiltIcon} alt="" />
          </Tooltip>
        </div>
      </Wrap>
    )
  }

  if (
    transaction?.executionInfo?.confirmationsSubmitted?.includes(userWalletAddress) ||
    transaction?.executionInfo?.rejections?.includes(userWalletAddress)
  ) {
    return <Wrap></Wrap>
  }

  return (
    <Wrap>
      <div className="action" onClick={confirmHandler}>
        <Tooltip arrow placement="top" title="Confirm">
          <img src={Check} alt="" />
        </Tooltip>
      </div>
      <div className="action" onClick={rejectHandler}>
        <Tooltip arrow placement="top" title="Reject">
          <img src={X} alt="" />
        </Tooltip>
      </div>
    </Wrap>
  )
}
