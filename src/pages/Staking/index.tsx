import { Breadcrumb, BreadcrumbElement, Menu } from '@aura/safe-react-components'
import React, { ReactElement, useEffect, useState } from 'react'
import BoxCard from 'src/components/BoxCard'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import ActionModal from './ActionModal/index'
import Undelegating from './Undelegating'
import Validators from './Validators'

import { getInternalChainId, getNativeCurrency } from 'src/config'
import { getAllDelegateOfUser, getAllUnDelegateOfUser, getAllValidator, getDelegateOfUser } from 'src/services/index'

import queryString from 'query-string'
import { extractSafeAddress } from 'src/routes/routes'

import { useDispatch, useSelector } from 'react-redux'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { formatBigNumber, formatNumber } from 'src/utils'
import MyDelegation from './MyDelegation'
import TxActionModal from './TxActionModal'
import { grantedSelector } from 'src/routes/safe/container/selector'
import useConnectWallet from 'src/logic/hooks/useConnectWallet'
import { ConnectWalletModal } from 'src/components/ConnectWalletModal'
import { loadedSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { usePagedQueuedTransactions } from '../Transactions/hooks/usePagedQueuedTransactions'
import BigNumber from 'bignumber.js'

function Staking(props): ReactElement {
  const dispatch = useDispatch()
  const granted = useSelector(grantedSelector)
  const { connectWalletState, onConnectWalletShow, onConnectWalletHide } = useConnectWallet()
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()
  const loaded = useSelector(loadedSelector)

  const [hasPendingTx, setHasPendingTx] = useState(false)
  const [isOpenDelagate, setIsOpenDelagate] = useState(false)
  const [isOpenReview, setIsOpenReview] = useState(false)
  const [typeStaking, setTypeStaking] = useState('')

  const nativeCurrency = getNativeCurrency()
  const [amount, setAmount] = useState<any>('')

  const [availableBalance, setAvailableBalance] = useState({ _id: '', amount: '', denom: '' })
  const [totalStake, setTotalStake] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)

  const internalChainId = getInternalChainId()

  const SafeAddress = extractSafeAddress()

  const [allValidator, setAllValidator] = useState([])
  const [validatorOfUser, setValidatorOfUser] = useState([])
  const [unValidatorOfUser, setUnValidatorOfUser] = useState([])
  const [listReward, setListReward] = useState([])

  const [valueDelegate, setValueDelegate] = React.useState('none')
  const [itemValidator, setItemValidator] = useState<any>()
  const [selectedAction, setSelectedAction] = useState('')
  const [itemDelegate, setItemDelegate] = useState<any>()
  const [dataDelegateOfUser, setDataDelegateOfUser] = useState<any>()
  const [validateMsg, setValidateMsg] = useState<string | undefined>()

  const handleChangeAction = (event) => {
    setSelectedAction(event.target.value)
    setAmount('')
    setValidateMsg('')
    setValueDelegate('none')
  }

  const handleChangeRedelegate = (event) => {
    setValueDelegate(event.target.value)
  }

  const handleDelegatedAmount = (event) => {
    setValidateMsg(undefined)
    const value = formatNumber(event.target.value)
    setAmount(value)
    if (value > formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount)) {
      setValidateMsg('Given amount is greater than available balance!')
    }
  }

  const handleListValidator = async (internalChainId) => {
    const listValidator: any = (await getAllValidator(internalChainId)) || []
    setAllValidator(listValidator?.Data?.validators)
  }

  useEffect(() => {
    console.log(transactions)
    const hasPendingTx = transactions.find((tx: any) =>
      [MsgTypeUrl.Delegate, MsgTypeUrl.Redelegate, MsgTypeUrl.Undelegate, MsgTypeUrl.GetReward].includes(
        tx?.[1]?.[0]?.txInfo?.typeUrl,
      ),
    )
    if (hasPendingTx) {
      dispatch(enqueueSnackbar(NOTIFICATIONS.CREATE_SAFE_PENDING_EXECUTE_MSG))
      setHasPendingTx(false)
    }
  }, [])

  useEffect(() => {
    const dataTemp: any = []
    handleListValidator(internalChainId)
    //
    getAllDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setValidatorOfUser(res.Data?.delegations)
      res.Data?.availableBalance && setAvailableBalance(res.Data?.availableBalance)
      setTotalStake(res.Data.total?.staked)
      setRewardAmount(res.Data.total?.reward || 0)
      res.Data?.delegations?.map((item) => {
        if (item.reward?.[0]?.amount) {
          dataTemp.push({
            delegatorAddress: SafeAddress,
            validatorAddress: item?.operatorAddress,
          })
        }
      })
      setListReward(dataTemp)
    })
    getAllUnDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setUnValidatorOfUser(res.Data?.undelegations)
    })
  }, [internalChainId, SafeAddress])

  const handleAmout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidateMsg(undefined)
    const value = formatNumber(event.target.value)
    setAmount(value)
    if (value > formatBigNumber(availableBalance?.amount)) {
      setValidateMsg('Given amount is greater than available balance!')
    }
  }

  const handleCallDataValidator = async (address) => {
    setDataDelegateOfUser(null)
    const dataSend: any = {
      internalChainId: internalChainId,
      operatorAddress: address,
      delegatorAddress: SafeAddress,
    }
    const res = await getDelegateOfUser(queryString.stringify(dataSend))
    setDataDelegateOfUser(res.Data)
  }

  const handleManage = async (item) => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    setSelectedAction('manage')
    setIsOpenDelagate(true)
    const dataTemp = {
      safeStaking: item.operatorAddress,
      name: item.validator,
      avatar: item.description.picture,
    }

    await handleCallDataValidator(item.operatorAddress)
    setItemValidator(dataTemp)
    setItemDelegate(item)
  }

  const handleManageDelegate = async (item) => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    setIsOpenDelagate(true)
    setValidateMsg('')
    setSelectedAction('delegate')
    const dataTemp = {
      safeStaking: item.operatorAddress,
      name: item.validator,
      avatar: item.description.picture,
    }
    await handleCallDataValidator(item.operatorAddress)
    setItemValidator(dataTemp)
  }

  const handleSubmit = (action) => {
    if (action === 'delegate') {
      if (amount > formatBigNumber(availableBalance?.amount) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      setTypeStaking(MsgTypeUrl.Delegate)
    }

    if (action === 'redelegate') {
      if (amount > formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      setTypeStaking(MsgTypeUrl.Redelegate)
    }

    if (action === 'undelegate') {
      if (amount > formatBigNumber(dataDelegateOfUser?.delegation?.delegationBalance?.amount) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      setTypeStaking(MsgTypeUrl.Undelegate)
    }
    setIsOpenReview(true)
    setIsOpenDelagate(false)
  }

  const claimReward = () => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    setIsOpenReview(true)
    setIsOpenDelagate(false)
    setTypeStaking(MsgTypeUrl.GetReward)
  }

  const handleCloseSendFund = () => {
    setIsOpenReview(false)
  }

  const handleMax = (item) => {
    setAmount(item)
  }

  const HandleClose = () => {
    setIsOpenDelagate(false)
    setItemValidator(null)
    setAmount('')
  }

  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement color="white" iconType="stakingAura" text="Staking" />
          </Breadcrumb>
        </Col>
      </Menu>

      <MyDelegation
        handleModal={handleManage}
        availableBalance={availableBalance}
        totalStake={totalStake}
        rewardAmount={rewardAmount}
        validatorOfUser={validatorOfUser}
        claimReward={claimReward}
        nativeCurrency={nativeCurrency}
        allValidator={allValidator}
        disabledButton={(loaded && !granted) || hasPendingTx}
      />

      {unValidatorOfUser && unValidatorOfUser.length > 0 && (
        <Block margin="mdTop">
          {' '}
          <Col start="sm" sm={12} xs={12}>
            <Undelegating unValidatorOfUser={unValidatorOfUser} allValidator={allValidator} />
          </Col>
        </Block>
      )}

      <Block margin="mdTop" style={{ marginBottom: 10 }}>
        {' '}
        <BoxCard>
          <Col layout="column" sm={12} xs={12}>
            <Validators
              allValidator={allValidator}
              handleManageDelegate={handleManageDelegate}
              disabledButton={(loaded && !granted) || hasPendingTx}
            />
          </Col>
        </BoxCard>
      </Block>

      <ActionModal
        modalIsOpen={isOpenDelagate}
        handleClose={HandleClose}
        selectedAction={selectedAction}
        handleChangeAction={handleChangeAction}
        handleSubmit={handleSubmit}
        handleAmout={handleAmout}
        amount={amount}
        allValidator={allValidator}
        itemValidator={itemValidator}
        handleChangeRedelegate={handleChangeRedelegate}
        valueDelegate={valueDelegate}
        handleDelegatedAmount={handleDelegatedAmount}
        nativeCurrency={nativeCurrency}
        itemDelegate={itemDelegate}
        availableBalance={availableBalance}
        handleMax={handleMax}
        dataDelegateOfUser={dataDelegateOfUser}
        validateMsg={validateMsg}
      />
      <TxActionModal
        open={isOpenReview}
        onClose={handleCloseSendFund}
        action={typeStaking}
        validator={itemValidator}
        dstValidator={valueDelegate}
        amount={amount}
        listReward={listReward}
      />

      <ConnectWalletModal isOpen={connectWalletState.showConnect} onClose={onConnectWalletHide}></ConnectWalletModal>
    </>
  )
}

export default Staking
