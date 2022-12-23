import styled from 'styled-components'

export const Wrap = styled.div`
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
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        margin: 0px 0px 8px 0px;
      }
      .fee {
        height: 48px;
        font-size: 14px;
        line-height: 18px;
        .fee-amount {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .noti {
    font-size: 12px;
    line-height: 16px;
    margin-right: 16px;
    color: #b4b8c0;
  }
`
export const Info = styled.div`
  display: flex;
  align-items: flex-start;
  > div {
    flex: 1;
  }
  > button {
    margin-top: 4px;
  }

  .tx-sequence {
    margin-top: 24px;
  }
  .tx-fee,
  .tx-sequence {
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
  }
`
