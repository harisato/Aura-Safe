import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0 3px;
  cursor: pointer;
  user-select: none;

  & > * {
    margin-right: 5px;
  }
`

const TitleWrapper = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
`
export { Wrapper, HeaderWrapper, TitleWrapper, Header }
