import { Breadcrumb, BreadcrumbElement, Button, Loader, Menu, Text } from '@aura/safe-react-components'
import { Divider } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import BoxCard from 'src/components/BoxCard'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import { LoadingContainer } from 'src/components/LoaderContainer'
import StatusCard from 'src/components/StatusCard'
import { getInternalChainId, _getChainId } from 'src/config'
import addOrUpdateProposals from 'src/logic/proposal/store/actions/addOrUpdateProposals'
import { proposalDetail } from 'src/logic/proposal/store/selectors'
import { extractSafeAddress, SafeRouteSlugs, VOTING_ID_NUMBER } from 'src/routes/routes'
import { getProposalDetail } from 'src/services'
import { AppReduxState } from 'src/store'
import { borderLinear } from 'src/theme/variables'
import { ProposalStatus } from 'src/types/proposal'
import styled from 'styled-components'
import CurrentTurnout from './Current'
import Depositors from './Depositors'
import InformationVoting from './Information'
import ValidatorVote from './ValidatorVote'
import Vote from './Vote'
import VoteBar from 'src/components/Vote'
import VotingBarDetail from 'src/routes/safe/components/VotingBarDetail'

const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
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

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margin-bottom: 10px;
`

const VotingStatusWrapper = styled.div`
  align-self: center;
  display: flex;
  justify-content: space-between;
  min-width: 300px;
  align-items: center;
`

function VotingDetail(): ReactElement {
  const history = useHistory()
  const dispatch = useDispatch()

  const safeAddress = extractSafeAddress()
  const chainId = _getChainId()

  const [loading, setLoading] = useState<boolean>(true)

  const { [VOTING_ID_NUMBER]: proposalId = '' } = useParams<SafeRouteSlugs>()

  const proposal = useSelector((state: AppReduxState) =>
    proposalDetail(state, { attributeName: 'id', attributeValue: proposalId }),
  )

  useEffect(() => {
    if (!proposal?.description && proposalId) {
      setLoading(true)
      getProposalDetail(getInternalChainId(), proposalId).then((proposal) => {
        dispatch(
          addOrUpdateProposals({
            chainId,
            safeAddress,
            proposals: [proposal.Data],
          }),
        )
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [proposal, setLoading, proposalId, dispatch, safeAddress, chainId])

  const handleBack = () => {
    history.goBack()
  }

  if (!proposal || loading) {
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
            <div onClick={handleBack} style={{ cursor: 'pointer' }}>
              <BreadcrumbElement color="white" iconType="backAura" text="Voting Detail" />
            </div>
          </Breadcrumb>
        </Col>
      </Menu>

      <Block>
        <BoxCard>
          <Col layout="column" sm={12} xs={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <TitleNumberStyled>#{proposal.id}</TitleNumberStyled>
                <TitleStyled> {proposal.title}</TitleStyled>
              </div>

              <VotingStatusWrapper>
                <StatusCard status={proposal.status} />
                <Divider orientation="vertical" flexItem />
                <StyledButton size="md" disabled={true} onClick={() => {}}>
                  <Text size="lg" color="white">
                    Vote
                  </Text>
                </StyledButton>
              </VotingStatusWrapper>
            </div>
            <InformationVoting proposal={proposal} />
            <StyleDivider />
            {proposal.status === ProposalStatus.VotingPeriod && (
              <Col sm={12} xs={12}>
                <CurrentTurnout turnout={proposal.turnout} tally={proposal.tally} />
              </Col>
            )}

            {proposal.status !== ProposalStatus.VotingPeriod && <VotingBarDetail proposal={proposal} />}
          </Col>
        </BoxCard>

        <Block margin="mdTop">
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <Vote />
            </Col>
          </BoxCard>
        </Block>

        <Block margin="mdTop">
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <ValidatorVote />
            </Col>
          </BoxCard>
        </Block>

        <Block margin="mdTop" style={{ marginBottom: 10 }}>
          <BoxCard>
            <Col layout="column" sm={12} xs={12}>
              <Depositors />
            </Col>
          </BoxCard>
        </Block>
      </Block>
    </>
  )
}

export default VotingDetail
