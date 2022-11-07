import Select, { IOption } from 'src/components/Input/Select'
import { Token } from 'src/logic/tokens/store/model/token'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'

const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`
export default function AssetSelect({ tokenList, selectedToken, setSelectedToken }) {
  const tokenOptions: IOption[] = tokenList.map((token: Token) => ({
    value: token.address,
    label: token.name,
  }))
  return (
    <Select
      options={tokenOptions}
      value={selectedToken || ''}
      onChange={(token) => {
        setSelectedToken(token)
      }}
      placeholder="Select an asset*"
      customRenderer={(value) => {
        const selectedToken = tokenList.find((token) => token.address == value)
        return (
          <MenuItemWrapper>
            <img src={selectedToken.logoUri || ''} alt={selectedToken.name} />
            {`${selectedToken.balance.tokenBalance} ${selectedToken.symbol}`}
          </MenuItemWrapper>
        )
      }}
    >
      {tokenList.map((token: Token, index: any) => {
        return (
          <MenuItem key={index} value={token.address}>
            <MenuItemWrapper>
              <img src={token.logoUri || ''} alt={token.name} />
              {`${token.balance.tokenBalance} ${token.symbol}`}
            </MenuItemWrapper>
          </MenuItem>
        )
      })}
    </Select>
  )
}
