import React, { ReactElement, useState, useEffect } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'
import CardStaking from 'src/components/CardStaking'
import Undelegating from './Undelegating'
import Validators from './Validators'
import BoxCard from 'src/components/BoxCard'
import ModalStaking from './ModalStaking/index'

import { getInternalChainId } from 'src/config'
import {
  getAllValidator,
  getAllDelegateOfUser,
  getAllUnDelegateOfUser,
  clamRewards,
  getDelegateOfUser,
} from 'src/services/index'
import { getExplorerInfo, getNativeCurrency } from 'src/config'

import { extractSafeAddress } from 'src/routes/routes'
import queryString from 'query-string'

import ReviewSendFundsTx from './ReviewSendFundsTx'
import Modal from 'src/components/Modal'

export const TypeStaking = {
  delegate: '/cosmos.staking.v1beta1.MsgDelegate',
  undelegate: '/cosmos.staking.v1beta1.MsgUndelegate',
  redelegate: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  reward: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
}

function Staking(props): ReactElement {
  const [isOpenDelagate, setIsOpenDelagate] = useState(false)
  const [isOpenReview, setIsOpenReview] = useState(false)
  const [typeStaking, setTypeStaking] = useState('')
  const [title, setTitle] = useState('')

  const nativeCurrency = getNativeCurrency().symbol

  const [amount, setAmount] = useState<any>('')

  const [availableBalance, setAvailableBalance] = useState(0)
  const [totalStake, setTotalStake] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)

  const internalChainId = getInternalChainId()

  const SafeAddress = extractSafeAddress()

  const [allValidator, setAllValidator] = useState([])
  const [validatorOfUser, setValidatorOfUser] = useState([])
  const [unValidatorOfUser, setUnValidatorOfUser] = useState([])
  const [listReward, setListReward] = useState([])

  const [valueDelegate, setValueDelegate] = React.useState()
  const [itemValidator, setItemValidator] = useState<any>()
  const [handlValueDelegate, setHandleValueDelegate] = useState('')
  const [itemDelegate, setItemDelegate] = useState<any>()
  const [dataDelegateOfUser, setDataDelegateOfUser] = useState<any>()

  const handleChange = (event) => {
    setHandleValueDelegate(event.target.value)
  }

  const handleChangeRedelegate = (event) => {
    setValueDelegate(event.target.value)
  }

  const handleAmoutRedelegate = (event) => {
    setAmount(event.target.value)
  }

  const handleListValidator = async (internalChainId) => {
    const listValidator: any = (await getAllValidator(internalChainId)) || []
    setAllValidator(listValidator?.Data?.validators)
  }

  useEffect(() => {
    const dataTemp: any = []
    handleListValidator(internalChainId)
    //
    getAllDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setValidatorOfUser(res.Data?.delegations)
      setAvailableBalance(res.Data?.availableBalance || 0)
      setTotalStake(res.Data.total?.staked)
      setRewardAmount(res.Data.total?.reward || 0)
      res.Data?.delegations?.map((item) => {
        dataTemp.push({
          delegatorAddress: SafeAddress,
          validatorAddress: item?.operatorAddress,
        })
      })
      setListReward(dataTemp)
    })
    getAllUnDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setUnValidatorOfUser(res.Data?.undelegations)
    })
  }, [internalChainId, SafeAddress])

  const handleAmout = (event) => {
    setAmount(event.target.value)
  }

  const handleCallDataValidator = (address) => {
    const dataSend: any = {
      internalChainId: internalChainId,
      operatorAddress: address,
      delegatorAddress: SafeAddress,
    }
    getDelegateOfUser(queryString.stringify(dataSend)).then((res) => {
      setDataDelegateOfUser(res.Data)
    })
  }

  const handleReward = (item) => {
    const dataTemp = {
      safeStaking: item.operatorAddress,
    }

    handleCallDataValidator(item.operatorAddress)
    setItemValidator(dataTemp)
    setItemDelegate(item)
    setIsOpenDelagate(true)
    setHandleValueDelegate('reward')
  }

  const handleManageDelegate = (item) => {
    const dataTemp = {
      safeStaking: item.operatorAddress,
    }
    handleCallDataValidator(item.operatorAddress)
    setIsOpenDelagate(true)
    setItemValidator(dataTemp)
    setHandleValueDelegate('delegate')
  }

  const handleSubmitDelegate = (item) => {
    setIsOpenReview(true)
    setIsOpenDelagate(false)

    if (item === 'delegate') {
      setTypeStaking(TypeStaking.delegate)
      setTitle('Delegate')
    }

    if (item === 'redelegate') {
      setTypeStaking(TypeStaking.redelegate)
      setTitle('Redelegate')
    }

    if (item === 'undelegate') {
      setTypeStaking(TypeStaking.undelegate)
      setTitle('UnDedelegate')
    }
  }

  const ClaimReward = () => {
    setIsOpenReview(true)
    setIsOpenDelagate(false)
    setTypeStaking(TypeStaking.reward)
    setTitle('Claim reward')
  }

  const handleCloseSendFund = () => {
    setIsOpenReview(false)
  }

  const handlePrevSendFund = () => {
    setIsOpenReview(false)
  }

  ///
  const temp = {
    token: '0000000000000000000000000000000000000000',
    tokenSpendingLimit: 0,
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
            <BreadcrumbElement
              color="white"
              iconType="stakingAura"
              text="Staking"
              // counter={addressBook?.length.toString()}
            />
          </Breadcrumb>
        </Col>
      </Menu>
      <Block>
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <CardStaking
            handleModal={handleReward}
            availableBalance={availableBalance}
            totalStake={totalStake}
            rewardAmount={rewardAmount}
            validatorOfUser={validatorOfUser}
            ClaimReward={ClaimReward}
            nativeCurrency={nativeCurrency}
            allValidator={allValidator}
          />
        </Col>
      </Block>

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
            <Validators allValidator={allValidator} dandleManageDelegate={handleManageDelegate} />
          </Col>
        </BoxCard>
      </Block>

      <ModalStaking
        modalIsOpen={isOpenDelagate}
        handleClose={HandleClose}
        handlValueDelegate={handlValueDelegate}
        handleChange={handleChange}
        handleSubmit={handleSubmitDelegate}
        handleAmout={handleAmout}
        amount={amount}
        allValidator={allValidator}
        itemValidator={itemValidator}
        handleChangeRedelegate={handleChangeRedelegate}
        valueDelegate={valueDelegate}
        handleAmoutRedelegate={handleAmoutRedelegate}
        nativeCurrency={nativeCurrency}
        itemDelegate={itemDelegate}
        availableBalance={availableBalance}
        handleMax={handleMax}
        dataDelegateOfUser={dataDelegateOfUser}
      />

      <Modal
        description="Send Tokens Form"
        handleClose={handleCloseSendFund}
        open={isOpenReview}
        paperClassName="smaller-modal-window"
        title={title}
      >
        <ReviewSendFundsTx
          onClose={handleCloseSendFund}
          onPrev={handlePrevSendFund}
          tx={temp as any}
          typeStaking={typeStaking}
          amount={amount}
          itemValidator={itemValidator}
          title={title}
          valueDelegate={valueDelegate}
          validatorOfUser={validatorOfUser}
          listReward={listReward}
        />
      </Modal>
    </>
  )
}

export default Staking
