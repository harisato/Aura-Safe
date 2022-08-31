import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import DetailVoting from 'src/components/DetailVoting'

const ContentCard = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  p {
    text-align: left;
  }
`

const TitleContentCard = styled.div`
  font-weight: 510;
  font-size: 14px;
  color: #868a97;
`

function VotingDetail(props): ReactElement {
  return (
    <>
      <Col layout="column" sm={12} xs={12}>
        <Col sm={12} xs={12} layout="column">
          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Proposer</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="linkAura">
                aura1k...awuen817n
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Initial Deposit</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                1.000000 <span style={{ color: '#5EE6D0' }}>AURA</span>
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Total Deposit</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                64.000000 <span style={{ color: '#5EE6D0' }}>AURA</span>
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Voting Start</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="linkAura">
                2022-01-09 | 07:55:02
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Type</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                SoftwareUpgrade
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Submit Time</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                2022-01-09 | 07:55:02
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Deposit End Time</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                2022-01-09 | 07:55:02
              </Text>
            </Col>
          </ContentCard>
        </Col>

        <Col sm={12} xs={12} layout="column">
          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Details</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <DetailVoting />
            </Col>
          </ContentCard>
          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Request Amount</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                37.500000 <span style={{ color: '#5EE6D0' }}>ATOM</span>
              </Text>
            </Col>
          </ContentCard>
        </Col>
      </Col>
    </>
  )
}

export default VotingDetail
