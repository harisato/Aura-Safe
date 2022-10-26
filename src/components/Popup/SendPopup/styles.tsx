import styled from 'styled-components'

export const PopupWrapper = styled.div``
export const HeaderWrapper = styled.div`
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 640px;
  border-bottom: 1px solid #404047;
  > div:nth-child(2) {
    display: flex;
    color: #98989b;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    > span:nth-child(1) {
      margin-right: 16px;
    }
  }
  .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin: 0;
  }
  .sub-title {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #98989b;
    margin: 2px 0px 0px 0px;
  }
  .close-icon {
    color: #98989b !important;
    cursor: pointer;
  }
`
export const BodyWrapper = styled.div`
  padding: 24px;
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
