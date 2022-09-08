import React, { ReactElement, useEffect, useState } from 'react'
import { IProposal } from 'src/types/proposal'
import styled from 'styled-components'

const VoteStyled = styled.div`
  width: 100%;
  height: 36px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
`

const YesStyled = styled.div<{ perYes: string; notVote: boolean }>`
  background-color: ${({ notVote }) => (notVote ? '#9DA8FF' : '#5ee6d0')};
  width: ${({ perYes }) => perYes};
  height: 100%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const NoStyled = styled.div<{ perNo: string; notVote: boolean }>`
  background-color: ${({ notVote }) => (notVote ? '#494C58' : '#FA8684')};
  width: ${({ perNo }) => perNo};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
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
  const { yes: _yes, no: _no, abstain: _abstain, no_with_veto: _no_with_veto } = vote

  const [percent, setPercent] = useState<IVotePercent | null>(null)

  useEffect(() => {
    const { yes, no, abstain, no_with_veto } = ((): IVotePercent => {
      const total = +_yes + +_abstain + +_no + +_no_with_veto

      return {
        yes: `${(+_yes * 100) / +total}%`,
        no: `${(+_no * 100) / +total}%`,
        abstain: `${(+_abstain * 100) / +total}%`,
        no_with_veto: `${(+_no_with_veto * 100) / +total}%`,
      }
    })()

    setPercent({ yes, no, abstain, no_with_veto })
  }, [vote, setPercent])

  return percent ? (
    <VoteStyled>
      <YesStyled perYes={percent.yes} notVote={false} />
      <NoStyled perNo={percent.no} notVote={false} />
    </VoteStyled>
  ) : (
    <></>
  )
}

export default Vote
