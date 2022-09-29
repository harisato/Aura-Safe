import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import { borderLinear } from 'src/theme/variables'

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white !important',
    '&:after': {
      borderRadius: '10px important',
    },

    '&:before': {
      borderRadius: '10px important',
    },

    '& .MuiInput-underline': {
      '&:after': {
        borderBottomColor: 'transparent',
        padding: 20,
      },
    },

    '& .MuiInput-input': {
      color: 'white !important',
    },

    '& .MuiSelect-select': {
      textAlign: 'center',
      '&:focus': {
        backgroundColor: 'transparent !important',
      },
    },
  },
  boxSelect: {
    backgroundColor: 'transparent',
    height: 60,
    borderRadius: '10px !important',
  },

  selectMenu: {
    border: '2px solid transparent',
    color: 'white',
    marginTop: 10,
    backgroundColor: '#363843',
  },

  optionSelect: {
    backgroundColor: 'red',
  },

  selectStyled: {
    // backgroundColor: 'white !important',
    backgroundColor: '#131419 !important',
    outline: 'none',
    borderRadius: '10px important',
    fontSize: 16,
  },
}))

export default function SelectValidator(props) {
  const {} = props
  const classes = useStyles()
  const [age, setAge] = React.useState(1)

  const handleChange = (event) => {
    setAge(event.target.value)
    // handleButtonDelegate(event.target.value)
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
          <option className={classes.selectStyled} value={1}>
            Delegate
          </option>
          <option className={classes.selectStyled} value={2}>
            Redelegate
          </option>
        </Select>
      </FormControl>
    </div>
  )
}
