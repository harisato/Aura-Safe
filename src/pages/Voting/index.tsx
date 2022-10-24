import { Breadcrumb, BreadcrumbElement, Loader, Text } from '@aura/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import BoxCard from 'src/components/BoxCard'
import Col from 'src/components/layout/Col'
import { LoadingContainer } from 'src/components/LoaderContainer'
import StatusCard from 'src/components/StatusCard'
import TableVoting, { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import { getChainInfo, getInternalChainId, _getChainId } from 'src/config'
import addProposals from 'src/logic/proposal/store/actions/addProposal'
import { extractSafeAddress } from 'src/routes/routes'
import { getProposals, MChainInfo } from 'src/services'
import { IProposal } from 'src/types/proposal'
import { calcBalance } from 'src/utils/calc'
import { formatDateTimeDivider } from 'src/utils/date'
import ProposalsCard from './ProposalsCard'
import { ProposalsSection, StyledBlock, StyledColumn, TitleNumberStyled } from './styledComponents'
import VotingModal from './VotingPopup'

const RowHead = [
  { name: '#ID' },
  { name: 'TITLE' },
  { name: 'STATUS' },
  { name: 'VOTING START' },
  { name: 'SUBMIT TIME' },
  { name: 'TOTAL DEPOSIT' },
]

const parseBalance = (balance: IProposal['totalDeposit'], chainInfo: MChainInfo) => {
  const symbol = chainInfo.nativeCurrency.symbol
  const amount = calcBalance(balance[0].amount, chainInfo.nativeCurrency.decimals)

  return {
    amount: Number(amount)?.toFixed(6) || '-',
    symbol: Number(amount)?.toFixed(6) ? symbol : '',
  }
}

function Voting(): ReactElement {
  const dispatch = useDispatch()
  const chainInfo = getChainInfo() as MChainInfo

  const safeAddress = extractSafeAddress()

  const [openVotingModal, setOpenVotingModal] = useState<boolean>(false)

  const chainId = _getChainId()

  const [proposals, setProposals] = useState<IProposal[]>([])

  useEffect(() => {
    getProposals(getInternalChainId()).then((response) => {
      const { Data } = response
      if (Data?.proposals) {
        setProposals(Data.proposals)

        dispatch(
          addProposals({
            chainId,
            safeAddress,
            proposals: Data.proposals,
          }),
        )
      }
    })
  }, [chainId, dispatch, safeAddress])

  const formatTime = (time) => formatDateTimeDivider(new Date(time).getTime())

  if (proposals.length <= 0) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbElement color="white" iconType="votingAura" text="Voting" />
      </Breadcrumb>
      <StyledBlock>
        <StyledColumn sm={12} xs={12}>
          {proposals.slice(0, 4).map((proposal) => (
            <Col sm={6} xs={12} key={proposal.id}>
              <ProposalsCard
                proposal={proposal}
                handleVote={() => {
                  setOpenVotingModal(true)
                }}
              />
            </Col>
          ))}
        </StyledColumn>
      </StyledBlock>
      <ProposalsSection>
        <Col start="sm" sm={12} xs={12}>
          <BoxCard justify="flex-start" column>
            <TitleNumberStyled>Proposals</TitleNumberStyled>
            <TableVoting RowHead={RowHead}>
              {proposals.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Text size="lg" color="linkAura">
                      {row.title}
                    </Text>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <StatusCard status={row.status} showDot />
                  </StyledTableCell>
                  <StyledTableCell align="left">{formatTime(row.votingStart)}</StyledTableCell>
                  <StyledTableCell align="left">{formatTime(row.votingEnd)}</StyledTableCell>
                  <StyledTableCell align="left">
                    <div style={{ display: 'flex' }}>
                      {parseBalance(row.totalDeposit, chainInfo).amount}&ensp;
                      <Text size="lg" color="linkAura">
                        {parseBalance(row.totalDeposit, chainInfo).symbol}
                      </Text>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableVoting>
          </BoxCard>
        </Col>
      </ProposalsSection>

      <VotingModal
        isOpen={openVotingModal}
        onClose={() => {
          setOpenVotingModal(false)
        }}
      />
    </>
  )
}

export default Voting
