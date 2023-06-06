import styled from 'styled-components'

export const PopupWrapper = styled.div`
  width: 480px;
`

export const BodyWrapper = styled.div`
  padding: 24px;
  .label {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #98989b;
    margin-bottom: 4px;
  }
  .error-msg {
    color: #f56161;
    font-size: 12px;
    margin: 6px 0px 0px;
  }
  .amount-section {
    display: flex;
    align-items: center;
    > button {
      white-space: nowrap;
      margin-left: 16px;
      font-size: 12px;
      line-height: 150%;
    }
  }
`
export const Footer = styled.div`
  padding: 24px;
  border-top: 1px solid #404047;
  display: flex;
  justify-content: end;
  > button:nth-child(1) {
    margin-right: 24px;
  }
`

export const Wrapper = styled.div`
  width: 480px;
  padding: 24px;
  .label {
    font-size: 12px;
    line-height: 150%;
    color: #98989b;
    margin: 0px 0px 4px;
  }
  .balance {
    background: #404047;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    line-height: 140%;
    width: fit-content;
    margin-left: 38px;
    margin-top: 4px;
  }
  .total-amount {
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
    margin-top: 16px;
  }
`
