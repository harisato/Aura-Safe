import MenuItem from '@material-ui/core/MenuItem'
import { useSelector } from 'react-redux'
import Select, { IOption } from 'src/components/Input/Select'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import styled from 'styled-components'

const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`
export default function TokenSelect({ selectedToken, setSelectedToken, disabled = false, onlyNativeToken = false }) {
  const tokenList: any = useSelector(extendedSafeTokensSelector)
  const { coinConfig } = useSelector(currentSafeWithNames)
  const tokenConfig = tokenList.filter((token) => {
    return (
      token.type == 'native' ||
      coinConfig?.find((coin) => {
        return coin.address == token.address
      })?.enable
    )
  })

  const tokenOptions: IOption[] = tokenConfig.map((token: Token) => ({
    value: token.address,
    label: token.name,
  })) as IOption[]

  return (
    <Select
      options={tokenOptions}
      value={selectedToken || ''}
      onChange={(token) => {
        setSelectedToken && setSelectedToken(() => tokenList.find((t) => t.address == token))
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
      {tokenConfig.map((token: any, index: any) => {
        if (onlyNativeToken && token.type !== 'native') {
          return null
        }
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
