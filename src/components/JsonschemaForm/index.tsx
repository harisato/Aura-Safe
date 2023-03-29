import { Validator } from 'jsonschema'
import { ReactElement, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import styled from 'styled-components'
import { FilledButton } from '../Button'
import Field from './Field'
import { makeSchemaInput } from './utils'
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
  .preview-button {
    padding: 24px;
    margin: 24px -24px -24px;
    border-top: 1px solid #363843;
    display: flex;
    justify-content: end;
  }
`
function JsonschemaForm({ contractData, schema, onPreview }): ReactElement {
  const dispatch = useDispatch()
  const jsValidator = new Validator()
  jsValidator.addSchema(schema)
  const schemaInput = makeSchemaInput(jsValidator)

  const [formData, setFormData] = useState({})
  const [activeFunction, setActiveFunction] = useState(0)
  const [shouldCheck, setShouldCheck] = useState(false)

  useEffect(() => {
    setFormData({})
    setActiveFunction(0)
    setShouldCheck(false)
  }, [contractData.contractAddress])
  const preview = async () => {
    try {
      setShouldCheck(true)
      onPreview(schemaInput.at(activeFunction).fieldList, formData, schemaInput.at(activeFunction).fieldName)
    } catch (error) {
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Failed to execute message',
            options: { variant: 'error', persist: true, preventDuplicate: true },
          }),
        ),
      )
      console.log('eevv', error)
    }
  }

  const validateField = (field) => {
    if (field.isRequired && !formData[field.fieldName]) {
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
            value={formData[field.fieldName]}
            errorMsg={shouldCheck ? validateField(field) : ''}
            onChange={(value) => {
              setFormData((prevState) => {
                return {
                  ...prevState,
                  [field.fieldName]: value,
                }
              })
            }}
          />
        ))}
      </div>
      <div className="preview-button">
        <FilledButton onClick={preview}>Preview</FilledButton>
      </div>
    </Wrap>
  )
}

export default JsonschemaForm
