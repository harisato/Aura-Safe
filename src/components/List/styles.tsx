import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'

import ListMui, { ListProps } from '@material-ui/core/List'
import { FixedIcon } from '@gnosis.pm/safe-react-components'

import { semiBoldFont, mediumFontSize} from 'src/theme/variables'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 320,
      backgroundColor: 'transparent',
      overflowX: 'auto',
      margin: '8px 0 -4px 0',
      '&::-webkit-scrollbar': {
        width: '0.5em',
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        borderRadius: '20px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'darkgrey',
        outline: '1px solid #dadada',
        borderRadius: '20px',
      },
    },
    nested: {
      paddingLeft: theme.spacing(3),
    },
  }),
)

const StyledListItem = styled(ListItem)<ListItemProps>`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0;
    /* background-color: #3e3f40 !important; */
    border-radius: 8px;
    span {
      color: white;
    }

    &.Mui-selected {
      background-color: #252529 !important;
    }
    .icon-color {
      fill: white;
    }
  }

  &.MuiListItem-button:hover {
    border-radius: 8px;
  }

  &.MuiListItem-root.Mui-selected {
    border-radius: 8px;
    color: #5ee6d0;
    span {
      color: #5ee6d0;
    }
    .icon-color {
      fill: #5ee6d0;
    }
  }
`

const StyledListSubItem = styled(ListItem)<ListItemProps>`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0;
    margin-left: auto;
    width: 85%;
    span {
      color: white !important;
    }
    .icon-color {
      fill: white !important;
    }
  }

  &.MuiListItem-button:hover {
    border-radius: 8px;
  }

  &.MuiButtonBase-root.MuiListItem-root.Mui-selected {
    background-color: #252529;
    border-radius: 8px;
    /* width: 85%; */
    color: ${({ theme }) => theme.colors.primary};
    span {
      color: #5ee6d0 !important;
    }
    .icon-color {
      fill: #5ee6d0 !important;
    }
  }
`

const StyledListItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: ${mediumFontSize};
    font-weight: ${semiBoldFont};
    line-height: 1.5;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: capitalize;
  }
`

const StyledListSubItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: ${mediumFontSize};
    font-weight: ${semiBoldFont};
    letter-spacing: 0px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: none;
  }
`

const TextAndBadgeWrapper = styled.div`
  flex: 1 1 auto;
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    top: 50%;
    right: -1rem;
  }
`

const StyledSubListMui = styled(ListMui)<ListProps<any>>`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: calc(100% - 25.859px);
    width: 2px;
    background-color: #404047;

    top: 0;
    left: calc(15% - 18px);
  }

  a {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -18px;

      height: 50%;
      width: 16px;
      background-color: transparent;

      border-left: 2px solid #404047;
      border-bottom: 2px solid #404047;
      border-bottom-left-radius: 8px;
    }
  }
`

const StyledFixedIcon = styled(FixedIcon)`
  color: 'blue';
`

export {
  useStyles,
  StyledListItem,
  StyledListSubItem,
  StyledListItemText,
  StyledListSubItemText,
  TextAndBadgeWrapper,
  StyledBadge,
  StyledSubListMui,
  StyledFixedIcon,
}
