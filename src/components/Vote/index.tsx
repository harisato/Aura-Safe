import React, { ReactElement } from 'react'
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
function Vote(props): ReactElement {
  const { perYes, perNo, notVote } = props

  return (
    <VoteStyled>
      <YesStyled perYes={perYes} notVote={notVote} />
      <NoStyled perNo={perNo} notVote={notVote} />
    </VoteStyled>
  )
}

export default Vote
