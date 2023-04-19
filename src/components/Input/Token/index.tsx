import Select, { IOption } from 'src/components/Input/Select'
import { Token } from 'src/logic/tokens/store/model/token'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import { useSelector } from 'react-redux'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import { List } from 'immutable'

const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`
export default function TokenSelect({ selectedToken, setSelectedToken, disabled = false }) {
  const tokenList = useSelector(extendedSafeTokensSelector) as unknown as Token[]

  const tokenOptions: IOption[] = tokenList.map((token: Token) => ({
    value: token.address,
    label: token.name,
  })) as unknown as IOption[]

  return (
    <Select
      options={tokenOptions}
      value={selectedToken || ''}
      onChange={(token) => {
        setSelectedToken && setSelectedToken(token)
      }}
      disabled={disabled}
      placeholder="Select an asset*"
      customRenderer={(value) => {
        const selectedToken = tokenList.find((token) => token.address == value)
        return selectedToken ? (
          <MenuItemWrapper>
            <img src={selectedToken.logoUri || ''} alt={selectedToken.name} />
            {`${selectedToken.balance.tokenBalance} ${selectedToken.symbol}`}
          </MenuItemWrapper>
        ) : null
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
