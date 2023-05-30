import { Validator } from 'jsonschema'
import { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Field from './Field'
import { makeSchemaInput } from './utils'
import TextField from '../Input/TextField'
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
}): ReactElement {
  const dispatch = useDispatch()
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
        <TextField label="fund" value={funds} onChange={setFunds} placeholder="json" />
      </div>
    </Wrap>
  )
}

export default JsonschemaForm
