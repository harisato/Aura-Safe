import { ChangeEvent, useEffect, useState } from 'react'
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
      max-height: 60vh;
      overflow: auto;
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
  const [toggleAll, setToggleAll] = useState<boolean>(false)
  const { coinConfig, address } = useSelector(currentSafeWithNames)
  const [config, setConfig] = useState(coinConfig)
  const applyHandler = () => {
    dispatch(
      updateSafe({
        address,
        coinConfig: config,
      }),
    )
    onClose()
  }

  useEffect(() => {
    setConfig(coinConfig)
  }, [address])

  const toggleAllHandler = () => {
    setConfig(config?.map((cf, ii) => ({ ...cf, enable: !toggleAll })))
    setToggleAll(!toggleAll)
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase()
    const filteredTokens = coinConfig?.filter((token) => {
      return (
        token?.symbol?.toLowerCase().includes(searchTerm) ||
        token?.name?.toLowerCase().includes(searchTerm) ||
        token?.address?.toLowerCase().includes(searchTerm)
      )
    })
    setConfig(filteredTokens)
  }

  useEffect(() => {
    const isSelectAll = config?.every((token) => token?.enable)
    setToggleAll(!!isSelectAll)
  }, [config])

  return (
    <Popup open={open} handleClose={onClose} title="Manage token">
      <Header title="Manage token" onClose={onClose} hideNetwork={true} />
      <Wrap>
        <div>
          <SearchInput onChange={handleSearch} placeholder="Search by token name, token symbol or address" />
          <div className="token-list">
            <Row>
              <div className="title">Token list</div>
              <div style={{ marginRight: 16 }}>
                <Checkbox checked={toggleAll} onChange={toggleAllHandler} />
              </div>
            </Row>
            <div className="list">
              {config?.map((c, i) => {
                return (
                  <CoinConfig
                    key={i}
                    type={c.type}
                    name={c.name}
                    isEnable={c.enable || false}
                    setToggle={() => setConfig(config.map((cf, id) => (i == id ? { ...cf, enable: !cf.enable } : cf)))}
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
const CoinConfig = ({ name, isEnable, setToggle, type }) => {
  return (
    <CoinWrapper>
      <div>{name}</div>
      {type !== 'native' ? <Checkbox checked={isEnable} onChange={() => setToggle()} /> : <></>}
    </CoinWrapper>
  )
}
