import { useState } from 'react'
import Select, { IOption } from '../Input/Select'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import { MenuItem } from '@material-ui/core'
import { Token } from 'src/logic/tokens/store/model/token'
import AmountInput from '../Input/AmountInput'
import { FilledButton } from '../Button'

const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const FormItemWrapper = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
`

const FormLabel = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
`
export type IFund = {
  id: number
  denom: string
  amount: string
}

type IFundFormProps = {
  fund: IFund
  onDelete: (id: number) => void
  onSelectToken: (token: string) => void
  selectedTokens: string[]
}

const FundForm = ({ fund, selectedTokens, onDelete, onSelectToken }: IFundFormProps) => {
  const tokenList = useSelector(extendedSafeTokensSelector) as unknown as Token[]
  const filteredTokenList = tokenList.filter((token) => !selectedTokens.includes(token.denom))
  const tokenOptions: IOption[] = tokenList.map((token: Token) => ({
    value: token.denom,
    label: token.name,
  }))
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const handleDenomChange = (token: string) => {
    fund.denom = token
    onSelectToken(token)
    setSelectedToken(token)
  }

  const handleAmountChange = (value) => {
    fund.amount = value
    setAmount(value)
  }

  return (
    <FormWrapper>
      <FormItemWrapper>
        <FormLabel>Token:</FormLabel>
        <Select
          options={tokenOptions}
          value={selectedToken || ''}
          onChange={handleDenomChange}
          placeholder="Token"
          customRenderer={(value) => {
            const selectedToken = tokenList.find((token) => token.denom == value)
            return selectedToken ? (
              <MenuItemWrapper>
                <img src={selectedToken.logoUri || ''} alt={selectedToken.name} />
                {selectedToken.name}
              </MenuItemWrapper>
            ) : null
          }}
        >
          {filteredTokenList.map((token: Token, index: any) => {
            return (
              <MenuItem key={index} value={token.denom}>
                <MenuItemWrapper>
                  <img src={token.logoUri || ''} alt={token.name} />
                  {token.name}
                </MenuItemWrapper>
              </MenuItem>
            )
          })}
        </Select>
      </FormItemWrapper>
      <FormItemWrapper>
        <FormLabel>Amount:</FormLabel>
        <AmountInput value={amount} onChange={handleAmountChange} endAdornment={false} />
      </FormItemWrapper>
      <FilledButton onClick={() => onDelete(fund.id)}>Delete</FilledButton>
    </FormWrapper>
  )
}

export default FundForm
