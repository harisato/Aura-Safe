import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'

import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, mustBeFloat } from 'src/components/forms/validator'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { isPayable } from 'src/logic/contractInteraction/sources/ABIService'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { currentSafeNativeBalance } from 'src/logic/safe/store/selectors'
import { getNativeCurrency } from 'src/config'

const useStyles = makeStyles(styles)

interface NativeCoinValueProps {
  onSetMax: (nativeCoinBalance: string) => void
}

export const NativeCoinValue = ({ onSetMax }: NativeCoinValueProps): React.ReactElement | null => {
  const classes = useStyles()
  const nativeCurrency = getNativeCurrency()
  const nativeBalance = useSelector(currentSafeNativeBalance)

  const {
    input: { value: method },
  } = useField('selectedMethod', { subscription: { value: true } })
  const disabled = !isPayable(method)

  if (!nativeBalance) {
    return null
  }

  return disabled ? null : (
    <>
      <Row className={classes.fullWidth} margin="xs">
        <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
          Value
        </Paragraph>
        <ButtonLink
          color={disabled ? 'disabled' : 'secondary'}
          onClick={() => !disabled && onSetMax(nativeBalance)}
          weight="bold"
        >
          Send max
        </ButtonLink>
      </Row>
      <Row margin="md">
        <Col>
          <Field
            component={TextField}
            disabled={disabled}
            inputAdornment={{
              endAdornment: <InputAdornment position="end">{nativeCurrency.symbol}</InputAdornment>,
              disabled,
            }}
            name="value"
            placeholder="Value"
            text="Value"
            type="text"
            validate={!disabled && composeValidators(mustBeFloat, maxValue(nativeBalance))}
          />
        </Col>
      </Row>
    </>
  )
}
