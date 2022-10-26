import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'

export const ProposalsSection = styled.div`
  margin-top: 20px;
`

export const StyledColumn = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

export const StyledBlock = styled(Block)`
  margin: -10px;
`

export const TitleNumberStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: white;
  align-self: start;
`

export const VotingPopupWrapper = styled.div`
  padding: 24px;
  width: 482px;
  > .proposal-name,
  .buttons,
  .voting-options {
    margin-top: 24px;
  }
  > .buttons {
    float: right;
    > button:nth-child(2) {
      margin-left: 10px;
    }
  }
`
