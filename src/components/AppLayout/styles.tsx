import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: rgba(34, 34, 35, 1);
`

const HeaderWrapper = styled.nav`
  height: 52px;
  width: 100%;
  z-index: 1299;

  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`

const BodyWrapper = styled.div`
  height: calc(100% - 52px);
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SidebarWrapper = styled.aside`
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
  z-index: 1;

  padding: 8px 8px 0 8px;
  background-color: rgba(18, 18, 18, 1);
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  padding: 0 16px;

  > :nth-child(1) {
    flex-grow: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  > :nth-child(2) {
    width: 100%;
    height: 59px;
  }
`
export { Container, HeaderWrapper, BodyWrapper, SidebarWrapper, ContentWrapper }
