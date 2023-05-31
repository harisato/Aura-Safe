import { MenuItem } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Token } from 'src/logic/tokens/store/model/token'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import styled from 'styled-components'
import ic_trash from '../../assets/icons/ic_trash.svg'
import ButtonHelper from '../ButtonHelper'
import AmountInput from '../Input/AmountInput'
import Select, { IOption } from '../Input/Select'

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
  align-items: center;
  justify-content: space-between;
`
const FormItemWrapper = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
`

const FormLabel = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
`

const ErrorMsg = styled.div`
  color: #bf2525;
  font-size: 12px;
  position: absolute;
  left: 55%;
`
const Wrap = styled.div`
  position: relative;
  width: 100%;
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

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined)
  const [token, setToken] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [amountValidateMsg, setAmountValidateMsg] = useState('')

  useEffect(() => {
    setAmountValidateMsg('')
    if (selectedToken?.address) {
      const tokenbalance = tokenList.find((t) => t.denom == selectedToken?.denom)?.balance?.tokenBalance
      if (tokenbalance && +amount > +tokenbalance) {
        setAmountValidateMsg('Given amount is greater than available balance.')
      }
    }
  }, [amount, selectedToken?.address])

  const handleDenomChange = (token: string) => {
    fund.denom = token
    onSelectToken(token)
    setToken(token)
    const selectedToken = filteredTokenList.find((e) => e.denom === token)
    setSelectedToken(selectedToken)
  }

  const setMaxAmount = () => {
    if (selectedToken) {
      setAmount(selectedToken?.balance?.tokenBalance || '')
    }
  }

  const handleAmountChange = (value) => {
    fund.amount = value
    setAmount(value)
  }

  return (
    <>
      <FormWrapper>
        <FormItemWrapper>
          <FormLabel>Token:</FormLabel>
          <Select
            options={tokenOptions}
            value={token || ''}
            onChange={handleDenomChange}
            placeholder="Token"
            customRenderer={(value) => {
              const selectedToken = tokenList.find((token) => token.denom == value)
              return selectedToken ? (
                <MenuItemWrapper>
                  <img src={selectedToken.logoUri || ''} alt={selectedToken.name} />
                  {`${selectedToken.balance.tokenBalance} ${selectedToken.symbol}`}
                </MenuItemWrapper>
              ) : null
            }}
          >
            {filteredTokenList.map((token: Token, index: any) => {
              return (
                <MenuItem key={index} value={token.denom}>
                  <MenuItemWrapper>
                    <img src={token.logoUri || ''} alt={token.name} />
                    {`${token.balance.tokenBalance} ${token.symbol}`}
                  </MenuItemWrapper>
                </MenuItem>
              )
            })}
          </Select>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormLabel>Amount:</FormLabel>
          <AmountInput value={amount} onChange={handleAmountChange} handleMax={setMaxAmount} token={selectedToken} />
        </FormItemWrapper>
        <ButtonHelper onClick={() => onDelete(fund.id)}>
          <img src={ic_trash} alt="Trash Icon" />
        </ButtonHelper>
      </FormWrapper>
      {amountValidateMsg && (
        <Wrap>
          <ErrorMsg>{amountValidateMsg}</ErrorMsg>
        </Wrap>
      )}
    </>
  )
}

export default FundForm
