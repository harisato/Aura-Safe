import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import SearchIcon from 'src/assets/icons/search.svg'
const Wrap = styled.div`
  background: ${(props) => props.theme.backgroundPrimary};
  border-radius: 8px;
  margin-top: 24px;
  > .header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .title {
      font-weight: 600;
      font-size: 22px;
      line-height: 28px;
    }
    .token-search-input {
      border: 1px solid #494c58;
      border-radius: 8px;
      padding: 8px 16px;
      gap: 8px;
      display: flex;
      align-items: center;
      input {
        font-family: inherit;
        font-size: 12px;
        line-height: 16px;
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        min-width: 300px;
      }
    }
  }
`

function Tokens(props): ReactElement {
  const [tab, setTab] = useState(0)
  return (
    <Wrap>
      <div className="header">
        <div className="title">Token list</div>
        <div>
          <div className="token-search-input">
            <input placeholder="Search by name/Token ID" />
            <img src={SearchIcon} alt="" />
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export default Tokens
