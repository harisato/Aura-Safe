import React, { ReactElement, useState, useEffect } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'
import CardStaking from 'src/components/CardStaking'
import Undelegating from './Undelegating'
import Validators from './Validators'
import BoxCard from 'src/components/BoxCard'
import ModalStaking from './ModalStaking/index'
import { getChainInfo, getInternalChainId, _getChainId } from 'src/config'
import { getAllValidator, getAllDelegateOfUser, getAllUnDelegateOfUser, clamRewards } from 'src/services/index'
import SendModal from '../Balances/SendModal'
import { extractSafeAddress, extractSafeId } from 'src/routes/routes'

function Staking(props): ReactElement {
  const [isOpenRerawd, setIsOpenRerawd] = useState(false)
  const [isOpenDelagate, setIsOpenDelagate] = useState(false)
  const [isRedelegate, setIsRedelegate] = useState(false)

  const internalChainId = getInternalChainId()

  const [allValidator, setAllValidator] = useState([])
  const [validatorOfUser, setValidatorOfUser] = useState([])
  const [unValidatorOfUser, setUnValidatorOfUser] = useState([])
  const [listReward, setListReward] = useState([])

  const SafeAddress = extractSafeAddress()

  useEffect(() => {
    getAllValidator(internalChainId).then((res) => {
      setAllValidator(res.Data.validators)
    })
    getAllDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setValidatorOfUser(res.Data.delegations)
    })
    getAllUnDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setUnValidatorOfUser(res.Data.undelegations)
    })
    clamRewards(internalChainId, SafeAddress).then((res) => {
      setListReward(res.Data.rewards)
    })
  }, [internalChainId, SafeAddress])

  const handleManageDelegate = (item) => {
    console.log('item', item)
    setIsOpenDelagate(true)
  }

  const handleReward = (item) => {
    console.log('item', item)
    setIsOpenRerawd(true)
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
          <CardStaking handleModal={handleReward} />
        </Col>
      </Block>

      <Block margin="mdTop">
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <Undelegating />
        </Col>
      </Block>

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
        handleClose={() => {
          setIsOpenDelagate(false)
        }}
        typeValidator="delegate"
      />
      <ModalStaking
        modalIsOpen={isRedelegate}
        handleClose={() => {
          setIsRedelegate(false)
        }}
        typeValidator="redelegate"
      />
      <ModalStaking
        modalIsOpen={isOpenRerawd}
        handleClose={() => {
          setIsOpenRerawd(false)
        }}
        typeValidator="reward"
      />
    </>
  )
}

export default Staking
