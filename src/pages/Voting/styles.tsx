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
  margin-bottom: 16px;
`

export const GreenText = styled.div`
  color: #5ee6d0;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  white-space: pre-wrap;
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
  .popup-title {
    font-weight: 510;
    font-size: 20px;
    line-height: 26px;
  }
`
export const ReviewTxPopupWrapper = styled.div`
  padding: 24px;
  width: 482px;
  .proposal-title {
    font-weight: 600;
    margin: 0;
    line-height: 150%;
    letter-spacing: 0.05em;
  }
  > .tx-detail {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    > div:nth-child(2) {
      margin: 4px 0px;
    }

    .voting-detail {
      display: flex;
      width: 100%;
      justify-content: space-between;
      font-weight: 400;
      font-size: 12px;
      line-height: 150%;
      text-transform: capitalize;
    }
  }
  .tx-fee {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      margin: 0px 0px 8px;
    }
    .fee {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > .fee-amount {
        display: flex;
        align-items: center;
        letter-spacing: 0.05em;
      }
      img {
        margin-right: 4px;
      }
    }
    .edit-fee-section {
      display: flex;
      align-items: center;
      margin-top: 8px;
      > div:nth-child(1) {
        margin-right: 16px;
      }
      button {
        min-width: 88px !important;
      }
    }
  }
  .total-amount {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      margin: 0px 0px 8px;
    }

    > .amount {
      display: flex;
      align-items: center;
      letter-spacing: 0.05em;
    }
    img {
      margin-right: 4px;
    }
  }
  .notice {
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.05em;
    color: #98989b;
  }
`
