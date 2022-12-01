import { Button, Text } from '@aura/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Col from 'src/components/layout/Col'
import StatusCard from 'src/components/StatusCard'
import VoteBar from 'src/components/Vote'
import { getChainInfo, getExplorerInfo, getExplorerUriTemplate } from 'src/config'
import { evalTemplate } from 'src/config/utils'
import { loadedSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { borderLinear } from 'src/theme/variables'
import { IProposal, VoteMapping } from 'src/types/proposal'
import { formatDateTimeDivider } from 'src/utils/date'
import styled from 'styled-components'

const Box = styled.div`
  width: 100%;
  margin: 10px;
  background-color: #24262e;
  padding: 24px;
  display: flex;
  align-items: center;
  border-radius: 12px;
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

const ContentCard = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`

const TitleContentCard = styled.div`
  font-weight: 510;
  font-size: 14px;
  color: #868a97;
`

const TextStyled = styled(Text)`
  color: #b4b8c0;
`

const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
  margin-left: 10px;
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
  }
`

const StyledButtonDetail = styled(Button)`
  border: 1px solid #5c606d;
  border-radius: 50px !important;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
`

const ContainDotVot = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
`

const DotVoteStyled = styled.div`
  width: 16px;
  height: 16px;
  background: #5ee6d0;
  background: ${(props) => props.color ?? '#5ee6d0'};
  border-radius: 23px;
  margin-right: 10px;
`

interface Props {
  handleVote?: () => void
  proposal: IProposal
}

function ProposalsCard({ handleVote, proposal }: Props): ReactElement {
  const history = useHistory()
  const granted = useSelector(grantedSelector)
  const loaded = useSelector(loadedSelector)

  const handleDetail = (proposalId) => {
    const uri = getExplorerUriTemplate()['proposals']
    window.open(evalTemplate(uri, { ['proposalsId']: proposalId }))
  }

  const proposalMostVotedOnName = proposal.tally.mostVotedOn.name
  const isEnded = new Date(proposal.votingEnd).getTime() < Date.now()

  return (
    <Box>
      <Col layout="column">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <TitleNumberStyled>#{proposal.id}</TitleNumberStyled>
            <TitleStyled>{proposal.title}</TitleStyled>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <StatusCard status={proposal.status} />
          </div>
        </div>

        <Col sm={8} xs={12} layout="column">
          <ContentCard>
            <TitleContentCard>Proposer</TitleContentCard>
            <Text size="lg" color="linkAura">
              {proposal.proposer || '-'}
            </Text>
          </ContentCard>

          <ContentCard>
            <TitleContentCard>Voting Start</TitleContentCard>
            <Text size="lg" color="white">
              {formatDateTimeDivider(proposal.votingStart)}
            </Text>
          </ContentCard>

          <ContentCard>
            <TitleContentCard>Voting End</TitleContentCard>
            <Text size="lg" color="white">
              {formatDateTimeDivider(proposal.votingEnd)}
            </Text>
          </ContentCard>
        </Col>

        <Col sm={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Col sm={8} xs={12}>
            <VoteBar vote={proposal.tally} />
          </Col>
          <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
            <div>
              {' '}
              <TitleContentCard>Most voted on</TitleContentCard>
            </div>
            <ContainDotVot>
              <div style={{ display: 'flex' }}>
                <DotVoteStyled
                  color={
                    proposalMostVotedOnName == 'no'
                      ? '#fa8684'
                      : proposalMostVotedOnName == 'abstain'
                      ? '#494c58'
                      : proposalMostVotedOnName == 'yes'
                      ? '#5ee6d0'
                      : '#9da8ff'
                  }
                />
                <Text size="xl" color="white">
                  {VoteMapping[proposalMostVotedOnName || 'yes']}
                </Text>
              </div>
              <div>
                <Text size="xl" color="white">
                  {proposal.tally.mostVotedOn.percent}%
                </Text>
              </div>
            </ContainDotVot>
          </Col>
        </Col>

        <div
          style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #363843', paddingTop: 10 }}
        >
          <div style={{ alignSelf: 'center' }}>
            {isEnded && (
              <TextStyled size="lg" color="linkAura">
                Voting ended
              </TextStyled>
            )}
          </div>
          <div>
            <StyledButtonDetail size="md" disabled={false} onClick={() => handleDetail(proposal.id)}>
              <Text size="lg" color="white">
                Details
              </Text>
            </StyledButtonDetail>

            {!(loaded && !granted) && (
              <StyledButton size="md" disabled={isEnded} onClick={handleVote}>
                <Text size="lg" color="white">
                  Vote
                </Text>
              </StyledButton>
            )}
          </div>
        </div>
      </Col>
    </Box>
  )
}

export default ProposalsCard
