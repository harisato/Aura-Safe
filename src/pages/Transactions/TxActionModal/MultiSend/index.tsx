import { Icon } from '@aura/safe-react-components'
import { toBase64 } from '@cosmjs/encoding'
import { coins } from '@cosmjs/stargate'
import BigNumber from 'bignumber.js'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import Amount from 'src/components/TxComponents/Amount'
import { getChainInfo, getCoinMinimalDenom, getInternalChainId } from 'src/config'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { formatNativeCurrency, formatNativeToken } from 'src/utils'
import { TxSignModalContext } from '../../Queue'
import { ReviewTxPopupWrapper } from '../../styled'
export default function Execute({ open, onClose, data, sendTx, rejectTx, disabled, setDisabled, confirmTxFromApi }) {
  const { action } = useContext(TxSignModalContext)
  const { ethBalance: balance } = useSelector(currentSafeWithNames)
  const userWalletAddress = useSelector(userAccountSelector)
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const confirmTx = async () => {
    setDisabled(true)
    const chainInfo = getChainInfo()
    const chainId = chainInfo.chainId
    const denom = getCoinMinimalDenom()
    const sendFee = {
      amount: coins(data?.txDetails?.fee, denom),
      gas: data?.txDetails?.gas.toString(),
    }

    const Data: any = [
      {
        typeUrl: MsgTypeUrl.MultiSend,
        value: {
          inputs: data?.txDetails?.txMessage[0]?.inputs,
          outputs: data?.txDetails?.txMessage[0]?.outputs,
        },
      },
    ]
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.MultiSend, Data, sendFee)
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

  const totalAmount = data?.txDetails?.txMessage?.[0]?.outputs?.reduce((total, recipient) => {
    return total + +recipient?.coins[0]?.amount
  }, 0)

  const title =
    action == 'confirm' ? 'Confirm transaction' : action == 'reject' ? 'Reject transaction' : 'Execute transaction'
  const noti =
    action == 'confirm'
      ? 'You’re about to confirm a transaction and will have to sign it using your currently connected wallet.'
      : action == 'reject'
      ? 'You’re about to reject a transaction. This action cannot be undone. Please make sure before proceeding.'
      : 'You’re about to execute a transaction and will have to confirm it with your currently connected wallet. Make sure you have enough funds in thís safe to fund the associated transaction amount and fee.'
  return (
    <>
      <Popup open={open} handleClose={onClose} title="">
        <Header onClose={onClose} title={title} />
        <ReviewTxPopupWrapper>
          <AddressInfo address={data?.txDetails?.txMessage[0]?.inputs[0]?.address} />
          <div className="balance">
            Balance: <strong>{formatNativeCurrency(balance)}</strong>
          </div>
          <Divider withArrow />
          <p className="label">Recipients</p>
          {data?.txDetails?.txMessage[0].outputs?.map((recipient, index) => {
            return (
              <div className="recipient" key={index}>
                <div>{`${formatNativeToken(recipient.coins[0].amount)}`}</div>
                <Icon type="arrowRight" size="sm" />
                <AddressInfo showName={false} showAvatar={false} address={recipient.address} />
              </div>
            )
          })}
          <Gap height={24} />
          <Amount label="Total Amount" amount={formatNativeToken(totalAmount)} />
          <Divider />
          <Amount
            label="Total Allocation Amount"
            amount={formatNativeToken(new BigNumber(totalAmount || 0).plus(+data.txDetails?.fee || 0).toString())}
          />
          <div className="notice">{noti}</div>
        </ReviewTxPopupWrapper>
        <Footer>
          <OutlinedNeutralButton size="md" onClick={onClose}>
            Back
          </OutlinedNeutralButton>
          <OutlinedButton
            size="md"
            onClick={() => {
              action == 'confirm' ? confirmTx() : action == 'reject' ? rejectTx() : sendTx()
            }}
            disabled={disabled}
          >
            Submit
          </OutlinedButton>
        </Footer>
      </Popup>
    </>
  )
}
