import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: rgba(34, 34, 35, 1);
`

const HeaderWrapper = styled.nav`
  height: 76px;
  width: 100%;
  z-index: 1299;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`

const BodyWrapper = styled.div`
  height: calc(100% - 76px);
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SidebarWrapper = styled.aside`
  height: 100%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  background-color: #0f0f0f;
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  padding: 32px;
  background: #131419;
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
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(108.46deg, #5ee6d0 12.51%, #bfc6ff 51.13%, #ffba69 87.49%);
  }
`
export { Container, HeaderWrapper, BodyWrapper, SidebarWrapper, ContentWrapper }
