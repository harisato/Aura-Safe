import { Dispatch } from 'redux'
import { getChainInfo, getInternalChainId } from 'src/config'

import { currentChainId } from 'src/logic/config/store/selectors'
import { ERROR, NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { store } from 'src/logic/safe/store'
import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { signMessage } from 'src/logic/providers/signing'
import {
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
  extractSafeAddress,
  extractShortChainName,
  getPrefixedSafeAddressSlug,
} from 'src/routes/routes'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { calcFee, formatNativeCurrency, formatNumber } from 'src/utils'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { changeTransactionSequenceById, confirmSafeTransaction, createSafeTransaction } from 'src/services'
import { generatePath } from 'react-router-dom'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { history } from 'src/routes/routes'
export const signAndCreateTransaction =
  (
    message: any[],
    gasLimit: string,
    sequence: string,
    beforeSigningCallback?: () => void,
    successSigningCallback?: () => void,
    errorSigningCallback?: (error: any) => void,
  ) =>
  async (dispatch: Dispatch<any>): Promise<any> => {
    try {
      const chainInfo = getChainInfo()
      const safeAddress = extractSafeAddress()
      const sendFee = calcFee(gasLimit)
      const chainId = chainInfo.chainId
      const msgs = message.map((msg: any) => {
        if (
          [
            '/cosmwasm.wasm.v1.MsgInstantiateContract',
            '/cosmwasm.wasm.v1.MsgExecuteContract',
            '/cosmwasm.wasm.v1.MsgMigrateContract',
          ].includes(msg.typeUrl as never)
        ) {
          return {
            ...msg,
            value: {
              ...msg.value,
              msg: toUtf8(JSON.stringify(msg.value.msg)),
            },
          }
        }

        return msg
      })
      beforeSigningCallback && beforeSigningCallback()
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signMessage(chainId, safeAddress, msgs, sendFee, sequence)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const data: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: signResult.signerAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
      }
      const result = await createSafeTransaction(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        const chainId = chainInfo.chainId
        dispatch(fetchTransactions(chainId, safeAddress))
        const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
        const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
        })
        successSigningCallback && successSigningCallback()
        history.push(txRoute + `?transactionId=${result.Data.transactionId}`)
      } else {
        errorSigningCallback && errorSigningCallback(result?.Message)
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
    } catch (error) {
      errorSigningCallback && errorSigningCallback(error)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Transaction request failed',
            options: { variant: ERROR, persist: false, autoHideDuration: 5000, preventDuplicate: true },
          }),
        ),
      )
    }
  }
export const signAndConfirmTransaction =
  (
    transactionId: string,
    message: any[],
    sendFee: any,
    sequence: string,
    beforeSigningCallback?: () => void,
    successSigningCallback?: () => void,
    errorSigningCallback?: (error: any) => void,
  ) =>
  async (dispatch: Dispatch<any>): Promise<any> => {
    try {
      const chainInfo = getChainInfo()
      const safeAddress = extractSafeAddress()
      const chainId = chainInfo.chainId
      const msgs = message.map((msg: any) => {
        if (
          [
            '/cosmwasm.wasm.v1.MsgInstantiateContract',
            '/cosmwasm.wasm.v1.MsgExecuteContract',
            '/cosmwasm.wasm.v1.MsgMigrateContract',
          ].includes(msg.typeUrl as never)
        ) {
          return {
            ...msg,
            value: {
              ...msg.value,
              msg: toUtf8(JSON.stringify(msg.value.msg)),
            },
          }
        }

        return msg
      })
      beforeSigningCallback && beforeSigningCallback()
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signMessage(chainId, safeAddress, msgs, sendFee, sequence)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const data: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: signResult.signerAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
        transactionId,
      }
      const result = await confirmSafeTransaction(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        const chainId = chainInfo.chainId
        dispatch(fetchTransactions(chainId, safeAddress, true))
        const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
        const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
        })
        successSigningCallback && successSigningCallback()
        history.push(txRoute)
      } else {
        errorSigningCallback && errorSigningCallback(result?.Message)
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
    } catch (error) {
      errorSigningCallback && errorSigningCallback(error)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Transaction request failed',
            options: { variant: ERROR, persist: false, autoHideDuration: 5000, preventDuplicate: true },
          }),
        ),
      )
    }
  }
export const signAndChangeTransactionSequence =
  (
    oldTxId: string,
    message: any[],
    sendFee: any,
    sequence: string,
    beforeSigningCallback?: () => void,
    successSigningCallback?: () => void,
    errorSigningCallback?: (error: any) => void,
  ) =>
  async (dispatch: Dispatch<any>): Promise<any> => {
    try {
      const chainInfo = getChainInfo()
      const safeAddress = extractSafeAddress()
      const chainId = chainInfo.chainId
      const msgs = message.map((msg: any) => {
        if (
          [
            '/cosmwasm.wasm.v1.MsgInstantiateContract',
            '/cosmwasm.wasm.v1.MsgExecuteContract',
            '/cosmwasm.wasm.v1.MsgMigrateContract',
          ].includes(msg.typeUrl as never)
        ) {
          return {
            ...msg,
            value: {
              ...msg.value,
              msg: toUtf8(JSON.stringify(msg.value.msg)),
            },
          }
        }

        return msg
      })
      beforeSigningCallback && beforeSigningCallback()
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await signMessage(chainId, safeAddress, msgs, sendFee, sequence)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const data: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: signResult.signerAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
        oldTxId,
      }
      const result = await changeTransactionSequenceById(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        const chainId = chainInfo.chainId
        dispatch(fetchTransactions(chainId, safeAddress))
        const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
        const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
        })
        successSigningCallback && successSigningCallback()
        history.push(txRoute)
      } else {
        errorSigningCallback && errorSigningCallback(result?.Message)
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
    } catch (error) {
      errorSigningCallback && errorSigningCallback(error)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Transaction request failed',
            options: { variant: ERROR, persist: false, autoHideDuration: 5000, preventDuplicate: true },
          }),
        ),
      )
    }
  }
