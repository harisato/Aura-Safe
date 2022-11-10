import { ReactElement } from 'react'
import { IProposal, VoteMapping } from 'src/types/proposal'

import Col from 'src/components/layout/Col'
import VoteBar from 'src/components/Vote'
import Row from 'src/components/layout/Row'
import styled, { css } from 'styled-components'
import { Text } from '@aura/safe-react-components'
import { getCoinDecimal, getCoinSymbol } from 'src/config'
import { calcBalance } from 'src/utils/calc'

const ContainDotVot = styled.div`
  display: flex;
  justify-content: space-between;
`

const DotVoteStyled = styled.div<{ bg: string }>`
  width: 16px;
  height: 16px;
  background: ${(props) => props.bg || '#5ee6d0'};
  border-radius: 23px;
`
const TextValue = styled(Text)`
  margin-left: 26px;
  margin-top: 6px;
`

const TextPercent = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  margin-left: 22px;
`

interface Props {
  proposal: IProposal
}

function VotingBarDetail({ proposal }: Props): ReactElement {
  const symbol = getCoinSymbol()
  const decimal = getCoinDecimal()
  return (
    <>
      <Col sm={12} xs={12}>
        <VoteBar vote={proposal.tally} />
      </Col>
      <Row>
        <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
          <ContainDotVot>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DotVoteStyled bg="#5EE6D0" />
              <Text size="xl" color="white">
                {VoteMapping['yes']}
              </Text>

              <TextPercent size="xl" color="white">
                {Number(proposal.tally.yes.percent).toFixed(2)}%
              </TextPercent>
            </div>
          </ContainDotVot>
          <TextValue size="lg" color="white">
            {Number(calcBalance(proposal.tally.yes.number || '0', decimal)).toFixed(6)}{' '}
            <span style={{ color: '#5EE6D0' }}> {symbol} </span>
          </TextValue>
        </Col>

        <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
          <ContainDotVot>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DotVoteStyled bg="#d5625e" />
              <Text size="xl" color="white">
                {VoteMapping['no']}
              </Text>

              <TextPercent size="xl" color="white">
                {Number(proposal.tally.no.percent).toFixed(2)}%
              </TextPercent>
            </div>
          </ContainDotVot>
          <TextValue size="lg" color="white">
            {Number(calcBalance(proposal.tally?.no?.number || '0', decimal)).toFixed(6)}{' '}
            <span style={{ color: '#5EE6D0' }}> {symbol} </span>
          </TextValue>
        </Col>

        <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
          <ContainDotVot>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DotVoteStyled bg="#9da8ff" />
              <Text size="xl" color="white">
                {VoteMapping['abstain']}
              </Text>

              <TextPercent size="xl" color="white">
                {Number(proposal.tally.abstain.percent).toFixed(2)}%
              </TextPercent>
            </div>
          </ContainDotVot>
          <TextValue size="lg" color="white">
            {Number(calcBalance(proposal?.tally?.abstain?.number || '0', decimal)).toFixed(6)}{' '}
            <span style={{ color: '#5EE6D0' }}> {symbol} </span>
          </TextValue>
        </Col>

        <Col sm={3} xs={12} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
          <ContainDotVot>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DotVoteStyled bg="#777E91" />
              <Text size="xl" color="white">
                {VoteMapping['no_with_veto']}
              </Text>

              <TextPercent size="xl" color="white">
                {Number(proposal.tally.mostVotedOn.percent).toFixed(2)}%
              </TextPercent>
            </div>
          </ContainDotVot>
          <TextValue size="lg" color="white">
            {Number(calcBalance(proposal.tally.mostVotedOn.number || '0', decimal)).toFixed(6)}{' '}
            <span style={{ color: '#5EE6D0' }}> {symbol} </span>
          </TextValue>
        </Col>
      </Row>
    </>
  )
}

export default VotingBarDetail
