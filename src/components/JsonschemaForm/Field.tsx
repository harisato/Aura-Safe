import styled from 'styled-components'
import TextField from '../Input/TextField'

const Wrap = styled.div``
export default function Field({ fieldSchema, value, onChange, errorMsg }) {
  if (
    fieldSchema.type == 'integer' ||
    fieldSchema.type.includes('integer') ||
    fieldSchema.type == 'number' ||
    fieldSchema.type.includes('number')
  ) {
    return (
      <TextField
        label={`${fieldSchema.fieldName} (${fieldSchema.type})`}
        type="number"
        value={value || ''}
        onChange={onChange}
        required={fieldSchema.isRequired}
        placeholder={`Input ${fieldSchema.fieldName.replace('_', ' ')}`}
        errorMsg={errorMsg}
      />
    )
  }
  return (
    <TextField
      label={`${fieldSchema.fieldName} (${fieldSchema.type})`}
      value={value || ''}
      onChange={onChange}
      required={fieldSchema.isRequired}
      placeholder={`Input ${fieldSchema.fieldName.replace('_', ' ')}`}
      errorMsg={errorMsg}
    />
  )
}
