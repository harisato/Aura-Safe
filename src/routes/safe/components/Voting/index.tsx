import { Breadcrumb, BreadcrumbElement, Loader, Menu, Text } from '@aura/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'

import BoxCard from 'src/components/BoxCard'
import CardVoting from 'src/components/CardVoting'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import { LoadingContainer } from 'src/components/LoaderContainer'
import StatusCard from 'src/components/StatusCard'
import TableVoting, { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import { getChainInfo, getInternalChainId } from 'src/config'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { getProposals, MChainInfo } from 'src/services'
import { IProposal } from 'src/types/proposal'
import { calcBalance } from 'src/utils/calc'
import { formatDateTime2 } from 'src/utils/date'
import { StyleCard, TitleNumberStyled } from './styles'

const RowHead = [
  { name: '#ID' },
  { name: 'TITLE' },
  { name: 'STATUS' },
  { name: 'VOTING START' },
  { name: 'SUBMIT TIME' },
  { name: 'TOTAL DEPOSIT' },
]

const parseBalance = (balance: IProposal['total_deposit'], chainInfo: MChainInfo) => {
  const symbol = chainInfo.nativeCurrency.symbol
  const amount = calcBalance(balance[0].amount, chainInfo.nativeCurrency.decimals)

  return {
    amount: Number(amount)?.toFixed(6) || '-',
    symbol: Number(amount)?.toFixed(6) ? symbol : '',
  }
}

function Voting(): ReactElement {
  const chainInfo = getChainInfo() as MChainInfo
  const [openVotingModal, setOpenVotingModal] = useState<boolean>(false)

  const [proposals, setProposals] = useState<IProposal[]>([])

  useEffect(() => {
    getProposals(getInternalChainId()).then((response) => {
      const { Data } = response
      if (Data) {
        setProposals(Data.proposals)
      }
    })
  }, [])

  const formatTime = (time) => formatDateTime2(new Date(time).getTime())

  if (proposals.length <= 0) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement color="white" iconType="votingAura" text="Voting" />
          </Breadcrumb>
        </Col>
      </Menu>
      <Block>
        {' '}
        <Col
          sm={12}
          xs={12}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginLeft: -10,
          }}
        >
          {proposals.slice(0, 4).map((proposal) => (
            <Col sm={6} xs={12} key={proposal.proposal_id}>
              <CardVoting
                proposal={proposal}
                handleVote={() => {
                  setOpenVotingModal(true)
                }}
              />
            </Col>
          ))}
        </Col>
      </Block>
      <StyleCard>
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <BoxCard justify="flex-start" column>
            <TitleNumberStyled>Proposals</TitleNumberStyled>
            <TableVoting RowHead={RowHead}>
              {proposals.map((row) => (
                <StyledTableRow key={row.proposal_id}>
                  <StyledTableCell component="th" scope="row">
                    {row.proposal_id}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Text size="lg" color="linkAura">
                      {row.content.title}
                    </Text>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <StatusCard status={row.status} showDot />
                  </StyledTableCell>
                  <StyledTableCell align="left">{formatTime(row.voting_start_time)}</StyledTableCell>
                  <StyledTableCell align="left">{formatTime(row.voting_end_time)}</StyledTableCell>
                  <StyledTableCell align="left">
                    <div style={{ display: 'flex' }}>
                      {parseBalance(row.total_deposit, chainInfo).amount}&ensp;
                      <Text size="lg" color="linkAura">
                        {parseBalance(row.total_deposit, chainInfo).symbol}
                      </Text>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableVoting>
          </BoxCard>
        </Col>
      </StyleCard>

      <SendModal
        isOpen={openVotingModal}
        onClose={() => {
          setOpenVotingModal(false)
        }}
        activeScreenType={'voting'}
      />
    </>
  )
}

export default Voting
