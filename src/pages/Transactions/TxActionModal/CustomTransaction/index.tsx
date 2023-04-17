import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { coin, coins, MsgDelegateEncodeObject } from '@cosmjs/stargate'
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import Amount from 'src/components/TxComponents/Amount'
import { getChainInfo, getCoinMinimalDenom, getInternalChainId, getNativeCurrency } from 'src/config'
import { signCosWasmMessage } from 'src/logic/providers/signing'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { formatNativeCurrency, formatNativeToken, formatNumber } from 'src/utils'
import { TxSignModalContext } from '../../Queue'
import { ReviewTxPopupWrapper } from '../../styled'

import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getNotice, getTitle } from '..'
import EditSequence from '../EditSequence'
import { DeleteButton, TxContent } from '../styles'
import { Message } from 'src/components/CustomTransactionMessage/SmallMsg'
import BigNumber from 'bignumber.js'
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
  const { ethBalance: balance, nextQueueSeq, sequence: currentSequence } = useSelector(currentSafeWithNames)
  const { action } = useContext(TxSignModalContext)
  const userWalletAddress = useSelector(userAccountSelector)
  const [sequence, setSequence] = useState(data?.txSequence)
  const safeAddress = extractSafeAddress()
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('0')
  const nativeCurrency = getNativeCurrency()

  useEffect(() => {
    let newTotalAmount = new BigNumber(0)

    JSON.parse(data.txDetails.rawMessage).map((message: any) => {
      if ('/cosmos.bank.v1beta1.MsgSend' == message.typeUrl) {
        newTotalAmount = newTotalAmount.plus(+formatNumber(message?.value?.amount[0]?.amount || 0))
      }
      if (MsgTypeUrl.MultiSend == message.typeUrl) {
        message.value?.outputs?.map((re) => {
          newTotalAmount = newTotalAmount.plus(+formatNumber(re?.coins[0]?.amount || 0))
        })
      }
    })
    setAmount(newTotalAmount.toString())
  }, [])

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
    const Msg: any = {
      contract: data?.txDetails?.txMessage[0].contractAddress,
      sender: safeAddress,
      funds: [],
      msg: toUtf8(
        JSON.stringify({
          [data?.txDetails?.txMessage[0].contractFunction]: JSON.parse(data?.txDetails?.txMessage[0].contractArgs),
        }),
      ),
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signCosWasmMessage(
        chainId,
        safeAddress,
        MsgTypeUrl.ExecuteContract,
        Msg,
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
    const Msg: any = {
      contract: data?.txDetails?.txMessage[0].contractAddress,
      sender: safeAddress,
      funds: [],
      msg: toUtf8(
        JSON.stringify({
          [data?.txDetails?.txMessage[0].contractFunction]: JSON.parse(data?.txDetails?.txMessage[0].contractArgs),
        }),
      ),
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signCosWasmMessage(
        chainId,
        safeAddress,
        MsgTypeUrl.ExecuteContract,
        Msg,
        sendFee,
        sequence,
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
          <AddressInfo address={safeAddress} />
          <div className="balance">
            Balance: <strong>{formatNativeCurrency(balance)}</strong>
          </div>
          <Divider />
          <div className="msgs">
            {JSON.parse(data.txDetails.rawMessage).map((message, index) => {
              return <Message key={index} index={index} msgData={message} />
            })}
          </div>
          <Gap height={16} />
          {action == 'delete' ? (
            <TxContent>
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
                <div className="value">
                  {formatNativeToken(new BigNumber(+amount).plus(+data.txDetails?.fee || 0).toString())}
                </div>
              </div>
            </TxContent>
          ) : (
            <>
              {+amount > 0 ? <Amount amount={formatNativeToken(new BigNumber(+amount).toString())} /> : null}
              {action == 'change-sequence' && (
                <>
                  <EditSequence defaultSequence={data?.txSequence} sequence={sequence} setSequence={setSequence} />
                  <Gap height={24} />
                </>
              )}
              <Divider />
              <Amount
                label="Total Allocation Amount"
                amount={formatNativeToken(new BigNumber(+amount).plus(+data.txDetails?.fee || 0).toString())}
              />
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
