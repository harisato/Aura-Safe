import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'

export default function WalletPopup(props) {
  const { anchorEl, providerDetails, classes, open, onClose } = props
  return (
    <Popper
      anchorEl={anchorEl}
      className={classes.popper}
      open={open}
      placement="bottom"
      popperOptions={{ positionFixed: true }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <>
            <ClickAwayListener mouseEvent="onClick" onClickAway={onClose} touchEvent={false}>
              <List className={classes.root} component="div">
                {providerDetails}
              </List>
            </ClickAwayListener>
          </>
        </Grow>
      )}
    </Popper>
  )
}
