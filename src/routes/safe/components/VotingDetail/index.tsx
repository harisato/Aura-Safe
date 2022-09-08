import { ReactElement } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text, Button } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'
import BoxCard from 'src/components/BoxCard'
import StatusCard from 'src/components/StatusCard'
import styled from 'styled-components'
import { borderLinear } from 'src/theme/variables'
import { Divider } from '@material-ui/core'
import InformationVoting from './Information'
import Current from './Current'
import Vote from './Vote'
import ValidatorVote from './ValidatorVote'
import Depositors from './Depositors'
import { useHistory } from 'react-router-dom'

const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
`

const TitleNumberStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: #b4b8c0;
`

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margi0n-bottom: 10px;
`

function VotingDetail(props): ReactElement {
  const history = useHistory()
  const handleBack = () => {
    history.goBack()
  }
  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <div onClick={handleBack} style={{ cursor: 'pointer' }}>
              <BreadcrumbElement color="white" iconType="backAura" text="Voting Detail" />
            </div>
          </Breadcrumb>
        </Col>
      </Menu>

      <Block>
        <BoxCard>
          <Col layout="column" sm={12} xs={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <TitleNumberStyled>#60</TitleNumberStyled>
                <TitleStyled>Increase MaxValidator value</TitleStyled>
              </div>
              <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                <StatusCard status="deposit" />
                <Divider orientation="vertical" flexItem />
                <StyledButton size="md" disabled={true} onClick={() => {}}>
                  <Text size="lg" color="white">
                    Vote
                  </Text>
                </StyledButton>
              </div>
            </div>
            <InformationVoting />
            <StyleDivider />
            <Col sm={12} xs={12}>
              <Current />
            </Col>
          </Col>
        </BoxCard>

        <Block margin="mdTop">
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <Vote />
            </Col>
          </BoxCard>
        </Block>

        <Block margin="mdTop">
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <ValidatorVote />
            </Col>
          </BoxCard>
        </Block>

        <Block margin="mdTop" style={{ marginBottom: 10 }}>
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <Depositors />
            </Col>
          </BoxCard>
        </Block>
      </Block>
    </>
  )
}

export default VotingDetail
