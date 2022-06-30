import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'

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
    background-color: #3e3f40 !important;
    border-radius: 8px;
    span {
      color: white;
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
    background-color: #3e3f40;
    border-radius: 8px;
    width: 95%;
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
    font-size: 0.76em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: uppercase;
  }
`

const StyledListSubItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.85em;
    font-weight: 400;
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

export {
  useStyles,
  StyledListItem,
  StyledListSubItem,
  StyledListItemText,
  StyledListSubItemText,
  TextAndBadgeWrapper,
  StyledBadge,
}
