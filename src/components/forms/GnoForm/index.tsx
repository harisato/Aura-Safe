import { ReactElement } from 'react'
import { Form } from 'react-final-form'
import { stylesBasedOn } from './styles'
const GnoForm = ({
  children,
  decorators,
  formMutators,
  initialValues,
  onSubmit,
  padding = 0,
  subscription,
  testId = '',
  validation,
}: any): ReactElement => (
  <Form
    decorators={decorators}
    initialValues={initialValues}
    mutators={formMutators}
    onSubmit={onSubmit}
    render={({ handleSubmit, ...rest }) => (
      <form data-testid={testId} onSubmit={handleSubmit} style={stylesBasedOn(padding) as any}>
        {children(rest.submitting, rest.validating, rest, rest.form.mutators)}
      </form>
    )}
    subscription={subscription}
    validate={validation}
  />
)

export default GnoForm
