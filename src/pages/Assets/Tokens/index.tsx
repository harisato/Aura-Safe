import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import SearchIcon from 'src/assets/icons/search.svg'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import { useSelector } from 'react-redux'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import { formatNativeCurrency, formatWithComma } from 'src/utils'
import SendingPopup from 'src/components/Popup/SendingPopup'
import sendIcon from 'src/assets/icons/ArrowUpRight.svg'
const Wrap = styled.div`
  background: ${(props) => props.theme.backgroundPrimary};
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
  > .header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div:nth-child(2) {
      display: flex;
      gap: 32px;
    }
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
const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 18px;
  text-transform: uppercase;
  img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
`
function Tokens(props): ReactElement {
  const [open, setOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState(undefined)
  const safeTokens: any = useSelector(extendedSafeTokensSelector)
  return (
    <Wrap>
      <div className="header">
        <div className="title">Token list</div>
        <div>
          <div className="token-search-input">
            <input placeholder="Search by name/Token ID" />
            <img src={SearchIcon} alt="" />
          </div>
          <FilledButton className="small">Manage token</FilledButton>
        </div>
      </div>
      <DenseTable headers={['Name', 'Token Type', 'Balance', ' ']}>
        {safeTokens.map((token, index) => {
          console.log(token)
          return (
            <StyledTableRow key={index}>
              <StyledTableCell>
                <TokenInfo>
                  <img src={token.logoUri} alt="" />
                  {token.name || 'Unkonwn token'}
                </TokenInfo>
              </StyledTableCell>
              <StyledTableCell>{token.type}</StyledTableCell>
              <StyledTableCell>{formatWithComma(token.balance.tokenBalance)}</StyledTableCell>
              <StyledTableCell align="right">
                <div>
                  <OutlinedNeutralButton
                    className="small"
                    onClick={() => {
                      setOpen(true)
                      setSelectedToken(token.address)
                    }}
                  >
                    <img src={sendIcon} alt="" />
                    Send
                  </OutlinedNeutralButton>
                  <OutlinedNeutralButton className="small" style={{ marginLeft: 8 }}>
                    <img style={{ transform: 'rotate(180deg)' }} src={sendIcon} alt="" />
                    Receive
                  </OutlinedNeutralButton>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          )
        })}
      </DenseTable>
      <SendingPopup defaultToken={selectedToken} open={open} onOpen={() => {}} onClose={() => setOpen(false)} />
    </Wrap>
  )
}

export default Tokens
