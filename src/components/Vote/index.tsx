import React, { ReactElement, useEffect, useState } from 'react'
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

const YesStyled = styled.div<{ per: string }>`
  background-color: #5ee6d0;
  width: ${({ per }) => per};
  height: 100%;
`

const NoStyled = styled.div<{ per: string }>`
  background-color: #fa8684;
  width: ${({ per }) => per};
  height: 100%;
`

const AbstainStyled = styled.div<{ per: string }>`
  background-color: #494c58;
  width: ${({ per }) => per};
  height: 100%;
`

const NoWithVetoStyled = styled.div<{ per: string }>`
  background-color: #9da8ff;
  width: ${({ per }) => per};
  height: 100%;
`
interface Props {
  vote: IProposal['final_tally_result']
  perYes?: string
  perNo?: string
  notVote?: boolean
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
      const total = +vote.yes + +vote.abstain + +vote.no + +vote.no_with_veto

      return {
        yes: `${(+vote.yes * 100) / +total}%`,
        no: `${(+vote.no * 100) / +total}%`,
        abstain: `${(+vote.abstain * 100) / +total}%`,
        no_with_veto: `${(+vote.no_with_veto * 100) / +total}%`,
      }
    })()

    setPercent({ yes, no, abstain, no_with_veto })
  }, [vote, setPercent])

  return percent ? (
    <VoteStyled>
      <YesStyled per={percent.yes} />
      <NoStyled per={percent.no} />
      <AbstainStyled per={percent.abstain} />
      <NoWithVetoStyled per={percent.no_with_veto} />
    </VoteStyled>
  ) : (
    <></>
  )
}

export default Vote
