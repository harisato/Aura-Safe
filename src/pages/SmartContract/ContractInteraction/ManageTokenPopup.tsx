import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import Checkbox from 'src/components/Input/Checkbox'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import { addToFunds } from 'src/logic/contracts/store/actions'
import { getFunds } from 'src/logic/contracts/store/selectors'

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

const Col = styled.div`
  display: flex;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
`

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

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-left: 16px;
`

const List = styled.div`
  margin-top: 16px;
  border-radius: 8px;
  padding: 0px 16px;
  background: #363843;
  max-height: 60vh;
  overflow: auto;
`
const WrapToken = styled.div`
  margin-left: 16px;
`

const CoinConfig = ({ token, isEnable, setToggle }) => {
  return (
    <CoinWrapper>
      <Col>
        <Checkbox checked={isEnable} onChange={() => setToggle()} />
        <WrapToken>{token.name}</WrapToken>
      </Col>
      <Col>
        <div>{token.balance}</div>
      </Col>
    </CoinWrapper>
  )
}

const ManageTokenPopup = ({ open, onClose, setFunds, listTokens, setListTokens, defListTokens }) => {
  const [toggleAll, setToggleAll] = useState<boolean>(false)
  const funds = useSelector(getFunds)
  const dispatch = useDispatch()

  const toggleAllHandler = () => {
    setListTokens(listTokens?.map((token) => ({ ...token, enabled: !toggleAll })))
    setToggleAll(!toggleAll)
  }

  const handleAddFunds = () => {
    const listFunds = listTokens.filter((token) => token.enabled)
    dispatch(addToFunds(listTokens))
    setFunds(listFunds)
    onClose()
  }

  const handleClose = () => {
    if (!funds || funds.length == 0) {
      dispatch(addToFunds(defListTokens))
      setListTokens(defListTokens)
    } else {
      setListTokens(funds)
    }
    onClose()
  }

  useEffect(() => {
    const isSelectAll = listTokens?.every((token) => token?.enabled)
    setToggleAll(isSelectAll)
  }, [listTokens])

  return (
    <Popup open={open} handleClose={handleClose} title="Select Asset">
      <Header title="Select Asset" onClose={handleClose} hideNetwork={true} />
      <Wrap>
        <div style={{ marginRight: 16 }}>
          <Row>
            <Col>
              <Checkbox checked={toggleAll} onChange={toggleAllHandler} />
              <Title>Asset</Title>
            </Col>
            <Col>
              <Title>Balance</Title>
            </Col>
          </Row>
          <List>
            {listTokens?.map((token, i) => {
              return (
                <CoinConfig
                  key={i}
                  token={token}
                  isEnable={token?.enabled || false}
                  setToggle={() =>
                    setListTokens(
                      listTokens.map((token, id) => (i === id ? { ...token, enabled: !token.enabled } : token)),
                    )
                  }
                />
              )
            })}
          </List>
        </div>
        <Footer>
          <OutlinedNeutralButton onClick={handleClose}>Cancel</OutlinedNeutralButton>
          <FilledButton onClick={handleAddFunds}>Apply</FilledButton>
        </Footer>
      </Wrap>
    </Popup>
  )
}

export default ManageTokenPopup
