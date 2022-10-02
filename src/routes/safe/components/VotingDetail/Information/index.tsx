import { Text } from '@aura/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'
import DetailVoting from 'src/components/DetailVoting'
import Col from 'src/components/layout/Col'
import { getChainInfo } from 'src/config'
import { MChainInfo } from 'src/services'
import { IProposal } from 'src/types/proposal'
import { calcBalance } from 'src/utils/calc'
import { formatDateTimeDivider } from 'src/utils/date'
import styled from 'styled-components'

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

const parseBalance = (balance: IProposal['totalDeposit'], chainInfo: MChainInfo) => {
  const symbol = chainInfo.nativeCurrency.symbol
  const amount = calcBalance(balance[0].amount, chainInfo.nativeCurrency.decimals)

  return {
    amount: Number(amount)?.toFixed(6) || '-',
    symbol: Number(amount)?.toFixed(6) ? symbol : '',
  }
}

const formatTime = (time) => formatDateTimeDivider(new Date(time).getTime())

interface Props {
  proposal: IProposal
}

function VotingDetail({ proposal }: Props): ReactElement {
  const [initialDeposit, setInitialDeposit] = useState({ amount: '-', symbol: '' })
  const [totalDeposit, setTotalDeposit] = useState({ amount: '-', symbol: '' })

  const chainInfo = getChainInfo() as MChainInfo

  useEffect(() => {
    if (proposal) {
      setInitialDeposit(parseBalance(proposal.totalDeposit, chainInfo))
      const totalDep = proposal.totalDeposit
        .map((item) => parseBalance([item], chainInfo))
        .reduce(
          (value, current) => {
            return {
              amount: (Number(current.amount) + Number(value.amount)).toFixed(6),
              symbol: current.symbol,
            }
          },
          { amount: '0', symbol: '' },
        )

      setTotalDeposit(totalDep)
    }
  }, [proposal, setInitialDeposit, chainInfo])

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
                {proposal.proposer}
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Initial Deposit</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                {initialDeposit.amount} <span style={{ color: '#5EE6D0' }}>{initialDeposit.symbol}</span>
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Total Deposit</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                {totalDeposit.amount} <span style={{ color: '#5EE6D0' }}>{totalDeposit.symbol}</span>
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Voting Start</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="linkAura">
                {formatTime(proposal.votingStart)}
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Type</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                {proposal.type?.split('.').pop()}
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Submit Time</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                {formatTime(proposal.submitTime)}
              </Text>
            </Col>
          </ContentCard>

          <ContentCard>
            <Col sm={2} xs={12}>
              <TitleContentCard>Deposit End Time</TitleContentCard>
            </Col>
            <Col sm={10} xs={12}>
              <Text size="lg" color="white">
                {formatTime(proposal.depositEndTime)}
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
              <DetailVoting description={proposal.description} />
            </Col>
          </ContentCard>
          {false && (
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
          )}
        </Col>
      </Col>
    </>
  )
}

export default VotingDetail
