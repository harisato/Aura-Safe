import styled from 'styled-components'

export const Wrap = styled.div`
  width: 540px;
  padding: 24px;
  .gas-warning {
    font-size: 14px;
    background: #3d3730;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }
  .msgs {
    max-height: 25vh;
    overflow: auto;
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
  .function-name {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #b4b8c0;
    margin-top: 8px;
  }
  .field__label {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #b4b8c0;
    margin-top: 6px;
  }
  .field__data {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
  .fields {
    max-height: 26vh;
    overflow: auto;
  }
`
