import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'

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
            <Text size="lg" color="linkAura">
              DokiaCapital
            </Text>
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
