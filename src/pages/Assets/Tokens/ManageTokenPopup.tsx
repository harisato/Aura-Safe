import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FilledButton } from 'src/components/Button'
import Checkbox from 'src/components/Input/Checkbox'
import SearchInput from 'src/components/Input/Search'
import { Popup } from 'src/components/Popup'
import Header from 'src/components/Popup/Header'
import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import styled from 'styled-components'

const Wrap = styled.div`
  width: 480px;
  > div {
    padding: 24px;
  }
  > div:first-child {
    border-bottom: 1px solid #404047;
  }
  .token-list {
    margin-top: 18px;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
    }
    .list {
      margin-top: 16px;
      border-radius: 8px;
      padding: 0px 16px;
      background: #363843;
    }
  }
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export default function ManageTokenPopup({ open, onClose }) {
  const dispatch = useDispatch()
  const [toggleAll, setToggleAll] = useState(false)
  const { coinConfig, address } = useSelector(currentSafeWithNames)
  const [config, setConfig] = useState(coinConfig)

  const applyHandler = () => {
    dispatch(
      updateSafe({
        address,
        coinConfig: config,
      }),
    )
  }
  return (
    <Popup open={open} handleClose={onClose} title="Manage token">
      <Header title="Manage token" onClose={onClose} hideNetwork={true} />
      <Wrap>
        <div>
          <SearchInput placeholder="Search by token name, token symbol or address" />
          <div className="token-list">
            <Row>
              <div className="title">Token list</div>
              <div style={{ marginRight: 16 }}>
                <Checkbox checked={toggleAll} onChange={setToggleAll} />
              </div>
            </Row>
            <div className="list">
              {config?.map((c, i) => {
                return (
                  <CoinConfig
                    key={i}
                    name={c.name}
                    isEnable={c.enable || false}
                    setToggle={() => setConfig(config.map((cc, ii) => (i == ii ? { ...cc, enable: !cc.enable } : cc)))}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div style={{ float: 'right' }}>
          <FilledButton onClick={() => applyHandler()}>Apply</FilledButton>
        </div>
      </Wrap>
    </Popup>
  )
}

const CoinWrapper = styled.div`
  margin: 8px 0px;
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    text-transform: uppercase;
  }
`
const CoinConfig = ({ name, isEnable, setToggle }) => {
  return (
    <CoinWrapper>
      <div>{name}</div>
      <Checkbox checked={isEnable} onChange={() => setToggle()} />
    </CoinWrapper>
  )
}
