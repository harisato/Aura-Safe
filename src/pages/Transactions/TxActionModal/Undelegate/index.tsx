import { coin, coins, MsgUndelegateEncodeObject, MsgVoteEncodeObject } from '@cosmjs/stargate'
import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FilledButton, OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import { getChainInfo, getCoinMinimalDenom, getInternalChainId } from 'src/config'
import { allDelegation } from 'src/logic/delegation/store/selectors'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee, formatNativeCurrency, formatNativeToken } from 'src/utils'

import AddressInfo from 'src/components/AddressInfo'
import { TxSignModalContext } from '../../Queue'
import { ReviewTxPopupWrapper } from '../../styled'
import Amount from 'src/components/TxComponents/Amount'
import { toBase64 } from '@cosmjs/encoding'
import EditSequence from '../EditSequence'
import { getNotice, getTitle } from '..'
import { DeleteButton, TxContent } from '../styles'

export default function Execute({
  open,
  onClose,
  data,
  sendTx,
  rejectTx,
  disabled,
  setDisabled,
  confirmTxFromApi,
  changeTxSeqFromApi,
  deleteTx,
}) {
  const { action } = useContext(TxSignModalContext)
  const { ethBalance: balance, nextQueueSeq, sequence: currentSequence } = useSelector(currentSafeWithNames)

  const delegations = useSelector(allDelegation)
  const [sequence, setSequence] = useState(data?.txSequence)
  const stakedAmount = delegations?.find(
    (delegation: any) => delegation.operatorAddress == data?.txDetails?.txMessage[0]?.validatorAddress,
  )?.staked

  const userWalletAddress = useSelector(userAccountSelector)
  const dispatch = useDispatch()

  const confirmTx = async () => {
    setDisabled(true)
    const chainInfo = getChainInfo()
    const safeAddress = extractSafeAddress()
    const chainId = chainInfo.chainId
    const denom = getCoinMinimalDenom()
    const sendFee = {
      amount: coins(data?.txDetails?.fee, denom),
      gas: data?.txDetails?.gas.toString(),
    }
    const Data: MsgUndelegateEncodeObject['value'] = {
      delegatorAddress: data?.txDetails?.txMessage[0]?.delegatorAddress,
      validatorAddress: data?.txDetails?.txMessage[0]?.validatorAddress,
      amount: coin(data?.txDetails?.txMessage[0]?.amount, denom),
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(
        chainId,
        safeAddress,
        MsgTypeUrl.Undelegate,
        Data,
        sendFee,
        data?.txSequence,
      )
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
      setDisabled(false)
      console.error(error)
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      onClose()
    }
  }
  const changeTxSequence = async () => {
    setDisabled(true)
    const chainInfo = getChainInfo()
    const safeAddress = extractSafeAddress()
    const chainId = chainInfo.chainId
    const denom = getCoinMinimalDenom()
    const sendFee = {
      amount: coins(data?.txDetails?.fee, denom),
      gas: data?.txDetails?.gas.toString(),
    }
    const Data: MsgUndelegateEncodeObject['value'] = {
      delegatorAddress: data?.txDetails?.txMessage[0]?.delegatorAddress,
      validatorAddress: data?.txDetails?.txMessage[0]?.validatorAddress,
      amount: coin(data?.txDetails?.txMessage[0]?.amount, denom),
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Undelegate, Data, sendFee, sequence)
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
        oldTxId: data?.id,
      }
      changeTxSeqFromApi(payload, chainId, safeAddress)
    } catch (error) {
      setDisabled(false)
      console.error(error)
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      onClose()
    }
  }

  return (
    <>
      <Popup open={open} handleClose={onClose} title="">
        <Header onClose={onClose} title={getTitle(action)} />
        <ReviewTxPopupWrapper>
          <AddressInfo address={data?.txDetails?.txMessage[0]?.delegatorAddress} />
          <div className="balance">
            Balance: <strong>{formatNativeCurrency(balance)}</strong>
          </div>
          <Divider withArrow rotateArrow />
          <p className="label">Validator</p>
          <AddressInfo address={data?.txDetails?.txMessage[0]?.validatorAddress} />
          {stakedAmount && (
            <div className="balance">
              Amount Staked: <strong>{formatNativeToken(stakedAmount)}</strong>
            </div>
          )}
          <Gap height={24} />
          {action == 'delete' ? (
            <TxContent>
              <div>
                <div className="label">Amount</div>
                <div className="value">{formatNativeToken(data?.txDetails?.txMessage[0]?.amount)}</div>
              </div>
              <div>
                <div className="label">Transaction fee</div>
                <div className="value">{formatNativeToken(+data.txDetails?.fee)}</div>
              </div>
              <div>
                <div className="label">Transaction sequence</div>
                <div className="value">{data?.txSequence}</div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="label">Total Allocation Amount</div>
                <div className="value">{formatNativeToken(+data.txDetails?.fee || 0)}</div>
              </div>
            </TxContent>
          ) : (
            <>
              {action == 'change-sequence' && (
                <>
                  <EditSequence defaultSequence={data?.txSequence} sequence={sequence} setSequence={setSequence} />
                  <Gap height={24} />
                </>
              )}
              <Amount amount={formatNativeToken(data?.txDetails?.txMessage[0]?.amount)} />
              <Divider />
              <Amount label="Total Allocation Amount" amount={formatNativeToken(+data.txDetails?.fee || 0)} />
            </>
          )}
          <div className="notice">{getNotice(action)}</div>
        </ReviewTxPopupWrapper>
        <Footer>
          <OutlinedNeutralButton onClick={onClose}>Back</OutlinedNeutralButton>
          {action == 'delete' ? (
            <DeleteButton onClick={deleteTx}>Delete</DeleteButton>
          ) : (
            <FilledButton
              onClick={() => {
                action == 'confirm'
                  ? confirmTx()
                  : action == 'reject'
                  ? rejectTx()
                  : action == 'change-sequence'
                  ? changeTxSequence()
                  : sendTx()
              }}
              disabled={disabled || +sequence < +currentSequence}
            >
              Submit
            </FilledButton>
          )}
        </Footer>
      </Popup>
    </>
  )
}
