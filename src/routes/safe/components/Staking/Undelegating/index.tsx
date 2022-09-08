import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import cryto from '../assets/cryto.svg'
import { Divider } from '@material-ui/core'
const BoxCardStakingOverview = styled.div`
  padding: 24px;
  background: #363843;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
`
const BoxCardStaking = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  background: #363843;
  align-items: flex-start;
`
const BoxCardStakingList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: flex-start;
  padding: 24px;
  background: #24262e;
  border-radius: 25px;
`

const DelegateRow = styled.div`
  display: flex;
  width: 100%;
`

const TotalDelegate = styled.div`
  display: flex;
`

const ImgStyled = styled.img`
  width: 24px;
  height: 24px;
`

const BoxImg = styled.div`
  display: flex;
  align-self: center;
`

const TextImg = styled(Text)`
  margin-left: 10px;
  align-self: center;
`

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`

function Undelegating(props): ReactElement {
  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <Text size="lg" color="disableAura">
          Undelegating
        </Text>
      </BoxCardStakingOverview>
      <BoxCardStakingList>
        <DelegateRow>
          <Col end="lg" sm={2} xs={12}>
            <BoxImg>
              <ImgStyled src={cryto} alt="DokiaCapital" />
              <TextImg size="lg" color="linkAura">
                DokiaCapital
              </TextImg>
            </BoxImg>
          </Col>
          <Col end="lg" sm={2} xs={12}>
            <div>
              <TotalDelegate>
                <Text size="lg" color="white">
                  1.000000
                </Text>
                <Text size="lg" color="linkAura">
                  AURA
                </Text>
              </TotalDelegate>

              <Text size="lg" color="disableAura">
                14 days remaining
              </Text>
            </div>
          </Col>
        </DelegateRow>

        <StyleDivider />

        <DelegateRow>
          <Col end="lg" sm={2} xs={12}>
            <BoxImg>
              <ImgStyled src={cryto} alt="DokiaCapital" />
              <TextImg size="lg" color="linkAura">
                DokiaCapital
              </TextImg>
            </BoxImg>
          </Col>
          <Col end="lg" sm={2} xs={12}>
            <div>
              <TotalDelegate>
                <Text size="lg" color="white">
                  1.000000
                </Text>
                <Text size="lg" color="linkAura">
                  AURA
                </Text>
              </TotalDelegate>

              <Text size="lg" color="disableAura">
                14 days remaining
              </Text>
            </div>
          </Col>
        </DelegateRow>
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default Undelegating
