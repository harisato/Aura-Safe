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
import { getAllValidator, getAllDelegateOfUser, getAllUnDelegateOfUser } from 'src/services/index'

function Staking(props): ReactElement {
  const [modalIsOpen, setOpenModal] = useState(false)
  const internalChainId = getInternalChainId()
  const [allValidator, setAllValidator] = useState([])

  const handleModal = () => {
    setOpenModal(true)
  }

  const handleClose = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    getAllValidator(internalChainId).then((res) => {
      setAllValidator(res.Data.validators)
    })
  }, [internalChainId])

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
          <CardStaking handleModal={handleModal} />
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
            <Validators allValidator={allValidator} />
          </Col>
        </BoxCard>
      </Block>

      <ModalStaking modalIsOpen={modalIsOpen} handleClose={handleClose} />
    </>
  )
}

export default Staking
