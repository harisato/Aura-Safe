import React, { ReactElement, useState } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'
import CardStaking from 'src/components/CardStaking'
import Undelegating from './Undelegating'
import Validators from './Validators'
import BoxCard from 'src/components/BoxCard'
import ModalNew from 'src/components/ModalNew'
import StakeFish from './assets/StakeFish.svg'
import Inotel from './assets/Inotel.png'
import NotificationPopup from 'src/components/NotificationPopup'
import styled from 'styled-components'
import CloseButton from 'src/components/CloseButton'
import ButtonSelect from 'src/components/ButtonSelect'

import { Divider } from '@material-ui/core'

const ImgStyled = styled.img`
  width: 56px;
  height: 56px;
`
const HeaderPopup = styled.div`
  display: flex;
`

const HeaderContainer = styled.div`
  display: flex;
`

const BoxImgStyled = styled.div`
  align-self: center;
  margin-left: 10px;
`

const BoxVotingPower = styled.div`
  margin-left: 20px;
  align-self: center;
`

const TextPower = styled.div`
  font-size: 16px;
  color: #868a97;
  font-weight: 400;
`

const TextDelegators = styled.div`
  font-size: 16px;
  color: #868a97;
  margin-top: 8px;
  font-weight: 400;
`
const Commission = styled.div`
  font-weight: 510;
  font-size: 16px;
`

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`

const TextNotiStyled = styled.div`
  color: #868a97;
  font-weight: 400;
  font-size: 14px;
`

const TextGreen = styled.span`
  color: #5ee6d0;
`

const TextDelegateNoti = styled.span`
  color: #e5e7ea;
`

const BoxDelegate = styled.div`
  display: flex;
`

const FotterModal = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
`

function Staking(props): ReactElement {
  const [modalIsOpen, setOpenModal] = useState(false)
  const handleModal = () => {
    setOpenModal(!modalIsOpen)
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
            <Validators />
          </Col>
        </BoxCard>
      </Block>

      <ModalNew modalIsOpen={modalIsOpen}>
        <HeaderContainer>
          <HeaderPopup>
            <ImgStyled src={StakeFish} alt="StakeFish" />
            <BoxImgStyled>
              <img src={Inotel} alt="StakeFish" />
              <Commission>Commission - 6%</Commission>
            </BoxImgStyled>
          </HeaderPopup>
          <BoxVotingPower>
            <TextPower>
              Voting power - 5.58% (64.000000 <TextGreen>AURA</TextGreen> )
            </TextPower>
            <TextDelegators>Delegators - 27,733</TextDelegators>
          </BoxVotingPower>
        </HeaderContainer>

        <StyleDivider />
        <NotificationPopup>
          <div>
            <TextNotiStyled>
              You can <TextDelegateNoti>“Delegate”</TextDelegateNoti> more to this validator{' '}
            </TextNotiStyled>
            <TextNotiStyled>
              Or use <TextDelegateNoti>“Redelegate”</TextDelegateNoti> to switch your assets to another validator
            </TextNotiStyled>
            <TextNotiStyled>
              Or use <TextDelegateNoti>“Undelegate”</TextDelegateNoti> to start the unbonding
            </TextNotiStyled>
          </div>
        </NotificationPopup>

        <div style={{ display: 'flex', marginTop: 10 }}>
          <Col sm={6} xs={12} layout="column">
            <BoxDelegate>
              <Col sm={7} xs={12}>
                <Text size="lg" color="white">
                  My delegation
                </Text>
              </Col>
              <Text size="lg" color="numberAura">
                5.000000 <TextGreen>AURA</TextGreen>
              </Text>
            </BoxDelegate>
            <BoxDelegate>
              <Col sm={7} xs={12}>
                <Text size="lg" color="white">
                  Pending Reward
                </Text>
              </Col>
              <Text size="lg" color="numberAura">
                0.632315 <TextGreen>AURA</TextGreen>
              </Text>
            </BoxDelegate>
          </Col>
          <Col sm={6} xs={12} layout="column">
            <BoxDelegate>
              <Col sm={7} xs={12}>
                <Text size="lg" color="white">
                  Delegatable Balance
                </Text>
              </Col>

              <Text size="lg" color="numberAura">
                17.641376 <TextGreen>AURA</TextGreen>
              </Text>
            </BoxDelegate>
            <BoxDelegate>
              <Col sm={7} xs={12}>
                <Text size="lg" color="white">
                  Total Reward
                </Text>
              </Col>

              <Text size="lg" color="numberAura">
                2.239288 <TextGreen>AURA</TextGreen>
              </Text>
            </BoxDelegate>
          </Col>
        </div>
        <FotterModal>
          <CloseButton title="Close" />
          <ButtonSelect />
        </FotterModal>
      </ModalNew>
    </>
  )
}

export default Staking
