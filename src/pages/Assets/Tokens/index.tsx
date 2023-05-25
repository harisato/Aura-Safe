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
import ManageTokenPopup from './ManageTokenPopup'
import SearchInput from 'src/components/Input/Search'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
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
    .search-input {
      min-width: 300px;
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
const TokenType = styled.div`
  padding: 8px 16px;
  border-radius: 8px;
  width: fit-content;
  text-transform: uppercase;
  &.ibc {
    background: #273033;
    color: #67c091;
  }
  &.CW20 {
    color: #ffba69;
    background: #3d3730;
  }
`
function Tokens(props): ReactElement {
  const [open, setOpen] = useState(false)
  const [manageTokenPopupOpen, setManageTokenPopupOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState(undefined)
  const safeTokens: any = useSelector(extendedSafeTokensSelector)
  const { coinConfig, address } = useSelector(currentSafeWithNames)

  return (
    <Wrap>
      <div className="header">
        <div className="title">Token list</div>
        <div>
          <SearchInput placeholder="Search by name/Token ID" />
          <FilledButton className="small" onClick={() => setManageTokenPopupOpen(true)}>
            Manage token
          </FilledButton>
        </div>
      </div>
      <DenseTable headers={['Name', 'Token Type', 'Balance', ' ']}>
        {safeTokens
          .filter((token) => {
            return (
              token.type == 'native' ||
              coinConfig?.find((coin) => {
                return coin.address == token.address
              })?.enable
            )
          })
          .map((token, index) => {
            return (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <TokenInfo>
                    <img src={token.logoUri} alt="" />
                    {token.name || 'Unkonwn token'}
                  </TokenInfo>
                </StyledTableCell>
                <StyledTableCell>
                  <TokenType className={token.type}>{token.type == 'native' ? '' : token.type}</TokenType>
                </StyledTableCell>
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
      <ManageTokenPopup open={manageTokenPopupOpen} onClose={() => setManageTokenPopupOpen(false)} />
    </Wrap>
  )
}

export default Tokens
