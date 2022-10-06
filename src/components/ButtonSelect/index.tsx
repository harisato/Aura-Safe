import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import { borderLinear } from 'src/theme/variables'
import CaretDown from './CaretDown.svg'

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& .MuiInput-underline': {
      '&::after': {
        borderBottomColor: 'transparent',
        padding: 20,
      },
    },
    '& .MuiSelect-select': {
      border: 'none',
      textAlign: 'center',
      '& option': {},
    },
    '& .MuiSelect-select:not([multiple]) option, .MuiSelect-select:not([multiple]) optgroup': {
      backgroundColor: '#131419',
      borderRadius: 10,
      fontSize: 16,
      border: 'none',
      outline: 'none',
    },
  },
  boxSelect: {
    backgroundColor: 'transparent',
    color: 'white !important',
    height: 27,
    '&. Mui-focused': {
      border: 'none',
    },
  },
  selectMenu: {
    marginLeft: 10,
    border: '2px solid transparent',
    borderRadius: '20px',
    backgroundImage: borderLinear,
    transition: '0.3s',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
  },
  optionSelect: {
    backgroundColor: 'red',
  },
}))

const CaretDownIcon = (props) => <img src={CaretDown} />

export default function CustomizedSelects(props) {
  const { handlValueDelegate, setHandleValueDelegate } = props
  const classes = useStyles()

  const handleChange = (event) => {
    setHandleValueDelegate(event.target.value)
  }

  return (
    <div className={classes.selectMenu}>
      <FormControl className={classes.formControl}>
        <Select
          IconComponent={CaretDownIcon}
          native
          value={handlValueDelegate}
          onChange={handleChange}
          variant="standard"
          className={classes.boxSelect}
          input={<Input id="demo-dialog-native" />}
        >
          <option value={2}>Undelegate</option>
          <option value={3}>Redelegate</option>
        </Select>
      </FormControl>
    </div>
  )
}
