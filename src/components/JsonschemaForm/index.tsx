import { Button } from '@material-ui/core'
import { Validator } from 'jsonschema'
import { ReactElement, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Paragraph from '../layout/Paragraph'
import Field from './Field'
import FundForm, { IFund } from './FundForm'
import { makeSchemaInput } from './utils'
import { OutlinedButton } from '../Button'
import Plus from '../../assets/icons/Plus.svg'

const Wrap = styled.div`
  margin-top: 32px;
  .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .function-list {
    display: flex;
    flex-wrap: wrap;
    > .option {
      padding: 12px;
      background: #363843;
      border: 1px solid #494c58;
      border-radius: 8px;
      cursor: pointer;
      margin: 0px 16px 16px 0px;
      &.active {
        background: #5c606d;
        border: 1px solid #fcfcfd;
      }
    }
  }
  .field-list {
    > * {
      margin-top: 16px;
    }
  }
`

const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  margin-top: 16px;
`

let rowId = 0

function JsonschemaForm({
  schema,
  formData,
  setFormData,
  shouldCheck,
  setShouldCheck,
  activeFunction,
  setActiveFunction,
  funds,
  setFunds,
  setInvalidAmount,
}): ReactElement {
  const dispatch = useDispatch()
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const jsValidator = new Validator()
  if (!schema) return <></>
  jsValidator.addSchema(schema)
  const schemaInput = makeSchemaInput(jsValidator)

  const validateField = (field) => {
    if (field.isRequired && (typeof formData[field.fieldName] == 'undefined' || formData[field.fieldName] === '')) {
      return 'This field is required'
    }

    return ''
  }

  const handleAddFund = () => {
    const newFund = { id: rowId, denom: '', amount: '' }
    const newFunds = [...funds, newFund]
    setFunds(newFunds)
    rowId++
  }

  const handleDeleteFund = (id: number) => {
    const updatedFunds = funds.filter((fund) => fund.id !== id)
    setFunds(updatedFunds)
    const updatedSelectedTokens = selectedTokens.filter((token) => token !== getDenomById(id))
    setSelectedTokens(updatedSelectedTokens)
  }

  const getDenomById = (id: number) => {
    const fund = funds.find((fund: IFund) => fund.id === id)
    return fund ? fund.denom : ''
  }

  const handleSelectToken = (denom: string) => {
    const updatedSelectedTokens = [...selectedTokens]
    updatedSelectedTokens.push(denom)
    setSelectedTokens(updatedSelectedTokens)
  }

  const handleDeselectToken = (denom: string, preToken: string) => {
    const tokens = selectedTokens.filter((e) => e !== preToken)
    const updatedSelectedTokens = [...tokens]
    updatedSelectedTokens.push(denom)
    setSelectedTokens(updatedSelectedTokens)
  }

  const handleChangeAmount = (isError: boolean) => {
    setInvalidAmount(isError)
  }

  return (
    <Wrap>
      <div className="title">Function List</div>
      <div className="function-list">
        {schemaInput.map((schema, index) => (
          <div
            className={`option ${activeFunction == index ? 'active' : ''}`}
            onClick={() => {
              setShouldCheck(false)
              setFormData({})
              setActiveFunction(index)
            }}
            key={index}
          >
            {schema.fieldName}
          </div>
        ))}
      </div>
      <div className="field-list">
        {schemaInput.at(activeFunction)?.fieldList?.map((field, index) => (
          <Field
            key={index}
            fieldSchema={field}
            value={
              typeof formData[field.fieldName] == 'object'
                ? JSON.stringify(formData[field.fieldName])
                : formData[field.fieldName] || ''
            }
            errorMsg={shouldCheck ? validateField(field) : ''}
            onChange={(value) => {
              setFormData((prevState) => {
                try {
                  const parsedValue = JSON.parse(value)
                  if (typeof parsedValue == 'object') {
                    return {
                      ...prevState,
                      [field.fieldName]: JSON.parse(value),
                    }
                  }
                  return {
                    ...prevState,
                    [field.fieldName]: value,
                  }
                } catch (error) {
                  return {
                    ...prevState,
                    [field.fieldName]: value,
                  }
                }
              })
            }}
          />
        ))}
        <Title>Transaction funds</Title>
        {funds.map((fund: IFund) => (
          <div key={fund.id}>
            <FundForm
              fund={fund}
              selectedTokens={selectedTokens}
              onDelete={handleDeleteFund}
              onSelectToken={handleSelectToken}
              onChangeAmount={handleChangeAmount}
              onDeselectToken={handleDeselectToken}
            />
          </div>
        ))}
        <OutlinedButton className="small" onClick={handleAddFund}>
          <img src={Plus} alt="" />
          Add funds
        </OutlinedButton>
      </div>
    </Wrap>
  )
}

export default JsonschemaForm
