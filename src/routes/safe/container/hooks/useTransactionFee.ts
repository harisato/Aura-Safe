import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { calculateFee, coins, GasPrice, MsgSendEncodeObject, SignerData, StdFee } from '@cosmjs/stargate'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { getAccountOnChain, getMChainsConfig } from 'src/services'
import { ReviewTxProp } from '../../components/Balances/SendModal/screens/ReviewSendFundsTx'
import { getInternalChainId } from 'src/config'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'

export type TxFee = {
  sendFee: StdFee | undefined
  gasEstimation: number | undefined
  gasPrice: GasPrice | undefined
  signerData: SignerData | undefined
  gasPriceFormatted: string | undefined
  txEstimationStatus: EstimationStatus
}
/**
 * This hooks is used to store tx parameter
 * It needs to be initialized calling setGasEstimation.
 */
export const useTransactionFees = (
  chainInfo: ChainInfo,
  tx: ReviewTxProp,
  safeAddress: string,
  gasDefault: string,
): TxFee => {
  const [gasEstimation, setGasEstimation] = useState<number | undefined>()
  const [gasPrice, setGasPrice] = useState<GasPrice | undefined>()
  const [gasPriceFormatted, setGasPriceFormatted] = useState<string | undefined>()
  const [sendFee, setSendFee] = useState<StdFee | undefined>()
  const [signerData, setSignerData] = useState<SignerData | undefined>()
  const [txEstimationStatus, setTxEstimationStatus] = useState<EstimationStatus>(EstimationStatus.LOADING)

  const { chainId, rpcUri, shortName } = chainInfo

  console.log('chainInfo', chainInfo)

  useEffect(() => {
    const loadFee = async () => {
      const listChain = await getMChainsConfig()

      const denom = listChain.find((x) => x.chainId === chainId)?.denom || ''

      if (window.getOfflineSignerOnlyAmino) {
        const offlineSigner = window.getOfflineSignerOnlyAmino(chainId)

        const amountFinal =
          shortName === 'evmos'
            ? Math.floor(Number(tx?.amount) * Math.pow(10, 18)).toString() || ''
            : Math.floor(Number(tx?.amount) * Math.pow(10, 6)).toString() || ''

        const signingInstruction = await (async () => {
          // get account on chain from API
          const { Data: accountOnChainResult } = await getAccountOnChain(safeAddress, getInternalChainId())
          // const accountOnChain = await client.getAccount(safeAddress)

          return {
            accountNumber: accountOnChainResult?.accountNumber,
            sequence: accountOnChainResult?.sequence,
            memo: '',
          }
        })()

        const msgSend: Partial<MsgSend> = {
          fromAddress: safeAddress,
          toAddress: tx.recipientAddress,
          amount: coins(amountFinal, denom),
        }

        const msg: MsgSendEncodeObject = {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: msgSend,
        }

        // const accounts = await offlineSigner.getAccounts()

        // const onlineClient = await SigningCosmWasmClient.connectWithSigner(rpcUri.value, offlineSigner)

        // const gasEstimation = await onlineClient.simulate(accounts[0].address, [msg], signingInstruction.memo)

        const gasEstimation = await Promise.all([
          offlineSigner.getAccounts(),
          SigningCosmWasmClient.connectWithSigner(rpcUri.value, offlineSigner),
        ])
          .then(([accounts, onlineClient]) =>
            onlineClient.simulate(accounts[0].address, [msg], signingInstruction.memo),
          )
          .then((gasEstimation) => {
            gasEstimation && setTxEstimationStatus(EstimationStatus.SUCCESS)

            return gasEstimation
          })
          .catch((error) => {
            console.log({ error })

            setTxEstimationStatus(EstimationStatus.FAILURE)

            return 80000
          })

        const multiplier = 1.3
        const gasPrice = GasPrice.fromString(`${gasDefault}${denom}`)
        const sendFee = calculateFee(Math.round(gasEstimation * multiplier), gasPrice)

        const signerData: SignerData = {
          accountNumber: signingInstruction.accountNumber || 0,
          sequence: signingInstruction.sequence || 0,
          chainId: chainId,
        }

        const _gasPrice = +sendFee.amount[0].amount / Math.pow(10, 6)

        setSignerData(signerData)
        setGasPrice(gasPrice)
        setGasPriceFormatted(_gasPrice.toString())
        setGasEstimation(gasEstimation)
        setSendFee(sendFee)
      }
    }

    loadFee()
  }, [chainId, rpcUri, shortName, tx, safeAddress, gasDefault])

  return {
    sendFee,
    gasEstimation,
    gasPrice,
    gasPriceFormatted,
    signerData,
    txEstimationStatus,
  }
}
