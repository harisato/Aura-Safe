import { ReactElement, useEffect, useState } from 'react'
import { IProposal } from 'src/types/proposal'
import styled from 'styled-components'

const VoteStyled = styled.div`
  width: 100%;
  height: 36px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  background-color: #494c58;
  border-radius: 5px;
  overflow: hidden;
`

const YesStyled = styled.div<{ percent: string }>`
  background-color: #5ee6d0;
  width: ${({ percent: per }) => per};
  height: 100%;
`

const NoStyled = styled.div<{ percent: string }>`
  background-color: #fa8684;
  width: ${({ percent: per }) => per};
  height: 100%;
`

const AbstainStyled = styled.div<{ percent: string }>`
  background-color: #494c58;
  width: ${({ percent: per }) => per};
  height: 100%;
`

const NoWithVetoStyled = styled.div<{ percent: string }>`
  background-color: #9da8ff;
  width: ${({ percent: per }) => per};
  height: 100%;
`
interface Props {
  vote: IProposal['tally']
}

interface IVotePercent {
  yes: string
  no: string
  abstain: string
  no_with_veto: string
}

function Vote({ vote }: Props): ReactElement {
  const [percent, setPercent] = useState<IVotePercent | null>(null)

  useEffect(() => {
    const { yes, no, abstain, no_with_veto } = ((): IVotePercent => {
      return {
        yes: `${vote.yes.percent}%`,
        no: `${vote.no.percent}%`,
        abstain: `${vote.abstain.percent}%`,
        no_with_veto: `${vote.noWithVeto.percent}%`,
      }
    })()

    setPercent({ yes, no, abstain, no_with_veto })
  }, [vote, setPercent])

  return percent ? (
    <VoteStyled>
      <YesStyled percent={percent.yes} />
      <NoStyled percent={percent.no} />
      <NoWithVetoStyled percent={percent.no_with_veto} />
      <AbstainStyled percent={percent.abstain} />
    </VoteStyled>
  ) : (
    <></>
  )
}

export default Vote
