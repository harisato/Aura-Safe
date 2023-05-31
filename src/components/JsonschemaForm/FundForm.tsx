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
`
const SelectWrapper = styled.div`
  margin-right: 16px;
  width: 35%;
`

const InputWrapper = styled.div`
  margin-right: 23px;
  width: 30%;
`

const ErrorMsg = styled.div`
  color: #d5625e;
  font-size: 12px;
  position: absolute;
  left: 37%;
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
  const [amount, setAmount] = useState<string>('')
  const [amountValidateMsg, setAmountValidateMsg] = useState('')

  useEffect(() => {
    setAmountValidateMsg('')
    if (selectedToken?.denom) {
      const tokenbalance = tokenList.find((t) => t.denom == selectedToken?.denom)?.balance?.tokenBalance
      if (tokenbalance && +amount > +tokenbalance) {
        setAmountValidateMsg('Insufficient funds.')
      }
    }
  }, [amount, selectedToken?.address])

  const handleDenomChange = (token: string) => {
    fund.denom = token
    onSelectToken(token)
    const selectedToken = filteredTokenList.find((e) => e.denom === token)
    setSelectedToken(selectedToken)
  }

  const handleAmountChange = (value) => {
    fund.amount = value
    setAmount(value)
  }

  return (
    <>
      <FormWrapper>
        <SelectWrapper>
          <Select
            options={tokenOptions}
            value={selectedToken?.denom || ''}
            onChange={handleDenomChange}
            placeholder="Select an asset*"
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
        </SelectWrapper>
        <InputWrapper>
          <AmountInput
            invalid={!!amountValidateMsg}
            disabled={!selectedToken}
            value={amount}
            onChange={handleAmountChange}
            showBtnMax={false}
            token={selectedToken}
          />
        </InputWrapper>
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
