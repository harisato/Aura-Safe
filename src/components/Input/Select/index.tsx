import { MenuProps } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import DefaultSelect from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import { ReactNode, useState } from 'react'
import CaretDown from 'src/assets/icons/CaretDown.svg'
import CaretUp from 'src/assets/icons/CaretUp.svg'
import { inputLinear } from 'src/theme/variables'
const useStyles = makeStyles(() => ({
  formControl: {
    '&': { width: '100%' },
    '& .MuiInputBase-root': {
      border: '1px solid #494C58',
      borderRadius: '8px',
      justifyContent: 'space-between',
      background: '#24262E',
      padding: 0,
      '& .select-icon': {
        position: 'absolute',
        right: 16,
        pointerEvents: 'none',
      },
    },
    '& .Mui-focused': {
      border: '1px solid transparent',
      backgroundImage: inputLinear,
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      width: '100%',
      padding: '14px 52px 14px 16px',
      fontSize: 14,
      lineHeight: '20px',
      color: '#fff',
    },
  },
  select: {
    width: 'auto',
    fontSize: '16px',
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },

  paper: {
    borderRadius: 8,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    background: '#363843',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    '& li': {
      fontWeight: 400,
      padding: '12px 24px',
      fontSize: '14px',
    },
    '& li.Mui-selected': {
      color: 'white',
      background: '#24262E',
    },
    '& li.Mui-selected:hover': {
      background: '#24262E',
    },
  },
}))
const CaretDownIcon = () => <img className="select-icon" src={CaretDown} />
const CaretUpIcon = () => <img className="select-icon" src={CaretUp} />

export interface IOption {
  value: string | number
  label: string
}
const Select = ({
  value,
  onChange,
  options,
  children,
  placeholder,
  customRenderer,
  disabled,
}: {
  value: string | number
  onChange: (value: unknown) => void
  options: IOption[]
  children?: ReactNode[]
  placeholder?: string
  customRenderer?: any
  disabled?: boolean
}) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const menuProps: Partial<MenuProps> = {
    classes: {
      list: classes.list,
      paper: classes.paper,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
  }

  return (
    <FormControl className={classes.formControl}>
      <DefaultSelect
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onClose={() => {
          setIsOpen(false)
        }}
        onOpen={() => {
          setIsOpen(true)
        }}
        disableUnderline
        IconComponent={!disabled ? (isOpen ? CaretUpIcon : CaretDownIcon) : () => null}
        MenuProps={menuProps}
        classes={{
          select: classes.select,
        }}
        disabled={disabled}
        placeholder={placeholder}
        displayEmpty
        renderValue={(value) => {
          if (value === '') {
            return <div style={{ color: '#98989B' }}>{placeholder ? placeholder : 'Select'}</div>
          }
          if (customRenderer) {
            return customRenderer(value)
          }
          return options.find((option) => option.value == value)?.label
        }}
      >
        {children
          ? children
          : options.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
      </DefaultSelect>
    </FormControl>
  )
}

export default Select
