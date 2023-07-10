import { Tooltip } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Token } from 'src/logic/tokens/store/model/token'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import styled from 'styled-components'
import ic_trash from '../../assets/icons/ic_trash.svg'
import ButtonHelper from '../ButtonHelper'
import AmountInput from '../Input/AmountInput'

const TokenWrapper = styled.div`
  background: #24262e;
  border: 1px solid #494c58;
  border-radius: 8px;
  padding: 14px 16px;
  align-items: center;
  display: flex;
  min-width: 220px;
  margin-right: 20px;
  > div {
    text-transform: uppercase;
  }
`

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const InputWrapper = styled.div`
  margin-right: 23px;
  width: 30%;
`

const ErrorMsg = styled.div`
  color: #d5625e;
  font-size: 12px;
  position: absolute;
  left: 274px;
`
const Wrap = styled.div`
  position: relative;
  width: 100%;
`
export type IFund = {
  id: string
  denom: string
  amount: string
  tokenDecimal: string | number
  logoUri: string | null
  type: string
  symbol: string
  name: string
  balance: string
  address: string
  enabled?: boolean
}

type IFundFormProps = {
  fund: IFund
  onDelete: (id: string) => void
  onChangeAmount: (isError: boolean) => void
}

const FundForm = ({ fund, onDelete, onChangeAmount }: IFundFormProps) => {
  const tokenList = useSelector(extendedSafeTokensSelector) as unknown as Token[]
  const token = tokenList.find((token) => token.denom === fund.denom)
  const [amount, setAmount] = useState<string>('')
  const [amountValidateMsg, setAmountValidateMsg] = useState<string>('')

  useEffect(() => {
    setAmountValidateMsg('')
    const tokenbalance = fund.balance
    if (tokenbalance && +amount > +tokenbalance) {
      setAmountValidateMsg('Insufficient funds.')
    }
  }, [amount])

  useEffect(() => {
    onChangeAmount(amountValidateMsg !== '')
  }, [amountValidateMsg])

  const handleAmountChange = (value: string) => {
    fund.amount = value
    setAmount(value)
  }

  return (
    <>
      <FormWrapper>
        <TokenWrapper>
          <img style={{ width: '24px', height: '24px', marginRight: '8px' }} src={fund.logoUri || ''} alt={fund.name} />
          <div>{`${fund.balance} ${fund.symbol}`}</div>
        </TokenWrapper>
        <InputWrapper>
          <AmountInput
            invalid={(!!amountValidateMsg).toString()}
            value={amount}
            onChange={handleAmountChange}
            showBtnMax={false}
            token={token}
          />
        </InputWrapper>
        <ButtonHelper onClick={() => onDelete(fund.id)}>
          <Tooltip placement="top" arrow title="Delete">
            <img src={ic_trash} alt="Trash Icon" />
          </Tooltip>
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
