import React from 'react'
import Radio, { RadioProps } from '@material-ui/core/Radio'
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 14,
    height: 14,
    border: '3px solid #363843',
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#363843',
    border: '5px solid #363843',
    width: 10,
    height: 10,
    '&:before': {
      display: 'block',
      width: 10,
      height: 10,
      backgroundColor: '#5EE6D0',
      content: '""',
      borderRadius: '50%',
    },
  },
})

function StyledRadio(props: RadioProps) {
  const classes = useStyles()

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

type Props = {
  name: string
  value: any
  onRadioChange: (value: string) => void
  options: Array<{
    label: string
    value: any
  }>
} & RadioGroupProps

const MuiRadioButtons = ({ name, value, onRadioChange, options, ...rest }: Props): React.ReactElement => {
  const onChangeInternal = (event: React.ChangeEvent<HTMLInputElement>) =>
    onRadioChange((event.target as HTMLInputElement).value)

  return (
    <RadioGroup aria-label={name} name={name} value={value} onChange={onChangeInternal} {...rest}>
      {options.map((o) => (
        <FormControlLabel key={o.value} label={o.label} value={o.value} control={<StyledRadio />} />
      ))}
    </RadioGroup>
  )
}

const RadioButtons = styled(MuiRadioButtons)``
export default RadioButtons
