import { ReactElement, useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbElement, Loader, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import CardVoting from 'src/components/CardVoting'
import Block from 'src/components/layout/Block'
import BoxCard from 'src/components/BoxCard'
import TableVoting from 'src/components/TableVoting'
import { StyleCard, TitleNumberStyled } from './styles'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import StatusCard from 'src/components/StatusCard'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { getProposals } from 'src/services'
import { getInternalChainId } from 'src/config'
import { format } from 'date-fns'
import { formatDateTime, formatDateTime2 } from 'src/utils/date'
import { IProposal } from 'src/types/proposal'
import { LoadingContainer } from 'src/components/LoaderContainer'

const RowHead = [
  { name: '#ID' },
  { name: 'TITLE' },
  { name: 'STATUS' },
  { name: 'VOTING START' },
  { name: 'SUBMIT TIME' },
  { name: 'TOTAL DEPOSIT' },
]

const RowData = [
  {
    id: '#60',
    title: 'Signal proposal',
    status: 'deposit',
    voting: '2022-01-09 | 07:55:02',
    submitTime: '2022-01-09 | 07:55:02',
    total: '64.000000',
    nerwork: ' AURA',
  },
  {
    id: '#61',
    title: 'Signal proposal',
    status: 'deposit',
    voting: '2022-01-09 | 07:55:02',
    submitTime: '2022-01-09 | 07:55:02',
    total: '64.000000',
    nerwork: ' AURA',
  },
]

function Voting(props): ReactElement {
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

  return proposals.length <= 0 ? (
    <LoadingContainer>
      <Loader size="md" />
    </LoadingContainer>
  ) : (
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
          {/* <Col sm={6} xs={12}>
            <CardVoting
              handleVote={() => {
                setOpenVotingModal(true)
              }}
            />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col> */}
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
                      {row.total_deposit[0].amount}&ensp;
                      <Text size="lg" color="linkAura">
                        {row.total_deposit[0].denom}
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
