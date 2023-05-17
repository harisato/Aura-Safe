import { useState } from 'react'
import { FilledButton } from 'src/components/Button'
import Checkbox from 'src/components/Input/Checkbox'
import SearchInput from 'src/components/Input/Search'
import { Popup } from 'src/components/Popup'
import Header from 'src/components/Popup/Header'
import styled from 'styled-components'

const Wrap = styled.div`
  width: 480px;
  > div {
    padding: 24px;
  }
  > div:first-child {
    margin-bottom: 1px solid #404047;
  }
  .token-list {
    margin-top: 18px;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
    }
  }
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export default function ManageTokenPopup({ open, onClose }) {
  const [toggleAll, setToggleAll] = useState(false)
  return (
    <Popup open={open} handleClose={onClose} title="Manage token">
      <Header title="Manage token" onClose={onClose} hideNetwork={true} />
      <Wrap>
        <div>
          <SearchInput placeholder="Search by token name, token symbol or address" />
          <div className="token-list">
            <Row>
              <div className="title">Token list</div>
              <Checkbox checked={toggleAll} onChange={setToggleAll} />
            </Row>
          </div>
        </div>
        <div>
          <FilledButton>Apply</FilledButton>
        </div>
      </Wrap>
    </Popup>
  )
}
