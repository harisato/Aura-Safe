import { ReactElement, useEffect, useMemo, useState } from 'react'
import BoxCard from '../BoxCard'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import StatusCard from '../StatusCard'
import { Text, Button, Divider } from '@aura/safe-react-components'
import { borderLinear } from 'src/theme/variables'
import { useHistory } from 'react-router-dom'
import Vote from '../Vote'
import { SAFE_ROUTES, extractSafeAddress, generateSafeRoute } from 'src/routes/routes'
import { getShortName } from 'src/config'
import { IProposal, VoteLabel, VoteMapping } from 'src/types/proposal'
import { formatDateTime2 } from 'src/utils/date'
import { calcBalance, calcPercentInObj, calcVotePercent, maxVote } from 'src/utils/calc'
import { MChainInfo } from 'src/services'
import { getBalanceAndDecimalsFromToken } from 'src/logic/tokens/utils/tokenHelpers'

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
`

const DotVoteStyled = styled.div`
  width: 16px;
  height: 16px;
  background: #5ee6d0;
  border-radius: 23px;
  margin-right: 10px;
`

interface Props {
  handleVote?: () => void
  proposal: IProposal
}

const formatTime = (time) => formatDateTime2(new Date(time).getTime())

const calcMax = (
  proposal,
): {
  key: VoteLabel
  value: string
} => {
  if (proposal && proposal.final_tally_result) {
    const percent = calcVotePercent(calcPercentInObj(proposal.final_tally_result))
    const max = maxVote(percent)

    return (
      max || {
        key: 'Yes',
        value: '0%',
      }
    )
  }

  return {
    key: 'Yes',
    value: '0%',
  }
}

function CardVoting({ handleVote, proposal }: Props): ReactElement {
  const history = useHistory()
  const safeAddress = extractSafeAddress()

  const maxVote: {
    key: VoteLabel
    value: string
  } = useMemo(() => calcMax(proposal), [proposal])

  const handleDetail = () => {
    history.push(
      generateSafeRoute(SAFE_ROUTES.VOTING_DETAIL, {
        shortName: getShortName(),
        safeAddress,
      }),
    )
  }

  return (
    <BoxCard width={'100%'} top={'10px'} left={'10px'}>
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
              {'-'}
            </Text>
          </ContentCard>

          <ContentCard>
            <TitleContentCard>Voting Start</TitleContentCard>
            <Text size="lg" color="white">
              {formatTime(proposal.votingStart)}
            </Text>
          </ContentCard>

          <ContentCard>
            <TitleContentCard>Voting End</TitleContentCard>
            <Text size="lg" color="white">
              {formatTime(proposal.votingEnd)}
            </Text>
          </ContentCard>
        </Col>

        <Col sm={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Col sm={8} xs={12}>
            <Vote vote={proposal.tally} />
          </Col>
          <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
            <div>
              {' '}
              <TitleContentCard>Most voted on</TitleContentCard>
            </div>
            <ContainDotVot>
              <div style={{ display: 'flex' }}>
                <DotVoteStyled />
                <Text size="xl" color="white">
                  {VoteMapping[proposal.tally.mostVotedOn.name || 'yes']}
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
            <TextStyled size="lg" color="linkAura">
              Voting ended
            </TextStyled>
          </div>
          <div>
            <StyledButtonDetail size="md" disabled={false} onClick={handleDetail}>
              <Text size="lg" color="white">
                Details
              </Text>
            </StyledButtonDetail>

            <StyledButton size="md" disabled={false} onClick={handleVote}>
              <Text size="lg" color="white">
                Vote
              </Text>
            </StyledButton>
          </div>
        </div>
      </Col>
    </BoxCard>
  )
}

export default CardVoting
