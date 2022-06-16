import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import { borderLinear } from 'src/theme/variables'

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& .MuiInput-underline': {
      '&::after': {
        borderBottomColor: 'transparent',
      },
    },
    '& .MuiSelect-select': {
      border: 'none',
    },
    '& .MuiSelect-select:not([multiple]) option, .MuiSelect-select:not([multiple]) optgroup': {
      backgroundColor: '#131419',
      borderRadius: 10,
      fontSize: 16,
      border: 'none',
    },
  },
  boxSelect: {
    backgroundColor: 'transparent',
    color: 'white !important',
    height: 27,
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

export default function CustomizedSelects(props) {
  const { handleButtonDelegate } = props
  const classes = useStyles()
  const [age, setAge] = React.useState(1)

  const handleChange = (event) => {
    setAge(event.target.value)
    handleButtonDelegate(event.target.value)
  }

  return (
    <div className={classes.selectMenu}>
      <FormControl className={classes.formControl}>
        <Select
          native
          value={age}
          onChange={handleChange}
          variant="standard"
          className={classes.boxSelect}
          input={<Input id="demo-dialog-native" />}
        >
          <option value={1}>Delegate</option>
          <option value={2}>Redelegate</option>
        </Select>
      </FormControl>
    </div>
  )
}
