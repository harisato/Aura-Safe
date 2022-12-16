import styled from 'styled-components'

export const Wrap = styled.div`
  margin: 16px 0px;
  border-radius: 12px;
  overflow: hidden;
  background: #24262e;
  align-items: flex-start;
`

export const HeaderValidator = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 16px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
  .div-bar {
    height: 24px;
    width: 2px;
    background: #494c58;
    margin: 0px 24px;
  }
`

export const ContainSearch = styled.div`
  background: #131419;
  border: 1px solid #494c58;
  border-radius: 8px;
  width: 450px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #131419;
`
export const StyleSearch = styled.input`
  background: transparent;
  height: 100%;
  width: 90%;
  outline: none;
  border: none;
  color: #868a97;
  font-family: Inter;
`
export const ImgRow = styled.div`
  display: flex;
  > img {
    margin-right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  > p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.01em;
    color: #2cb1f5;
  }
`
export const TitleStyled = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`
