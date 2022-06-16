import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'
import { styles } from './styles'

class Provider extends React.Component<any> {
  myRef
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }
  render() {
    const { render, classes, info, open, toggle } = this.props

    return (
      <>
        <div className={classes.root} ref={this.myRef}>
          <Divider />
          <Col className={classes.provider} end="sm" middle="xs" onClick={toggle}>
            {info}
            <IconButton className={classes.expand} disableRipple>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
          <Divider />
        </div>
        {render(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles as any)(Provider)
