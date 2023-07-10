import styled from 'styled-components'

export const PopupWrapper = styled.div`
  width: 640px;
`
export const BodyWrapper = styled.div`
  padding: 24px;
  .recipient-input {
    display: flex;
    > :nth-child(2) {
      margin-left: 16px;
      width: 20%;
    }
  }
  .error * {
    color: #f56161 !important;
  }
  .balance-amount {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-top: 16px;
    > p {
      margin: 6px 0px 0px;
    }
    .value {
      font-weight: 600;
    }
  }
  .token-selection {
    width: 50%;
  }
  table {
    min-width: unset;
  }
  .label {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #e5e7ea;
    margin-bottom: 8px;
  }
  .error-msg {
    color: #f56161;
    font-size: 12px;
    margin: 6px 0px 0px;
  }
  .success-msg {
    color: #67c091;
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
  width: 640px;
  padding: 24px;
  .recipients {
    max-height: 18vh;
    overflow: auto;
  }
  .recipient {
    display: flex;
    align-items: center;
    > span {
      margin: 0px 8px;
    }
  }
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
    margin-top: 24px;
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
  .edit-fee-section {
    margin-top: 8px;

    button {
      min-width: 88px !important;
    }
    > div:last-child {
      display: flex;
      justify-content: space-between;
    }
    .gas-fee {
      display: flex;
      justify-content: space-between;
      margin: 0px -8px 16px;
      > div {
        flex: 1;
        margin: 0px 8px;
      }
      .tx-fee {
        .title {
          font-size: 16px;
          line-height: 20px;
        }
        .fee {
          height: 48px;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    .noti {
      font-size: 12px;
      line-height: 16px;
      margin-right: 16px;
      color: #b4b8c0;
    }
  }
`
