import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 24px;
  border-top: 1px solid #404047;
  display: flex;
  justify-content: end;
  > button:nth-child(1) {
    margin-right: 24px;
  }
`
export default function Footer({ children }) {
  return <Wrapper>{children}</Wrapper>
}
