import React, { ReactElement } from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    width: '100%',
    color: 'white',
    '&:MuiTab-root': {
      color: 'white !important',
    },
  },
})

function Vote(props): ReactElement {
  const [value, setValue] = React.useState(0)
  const classes = useStyles()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <>
      <Col start="sm" sm={12} xs={12}>
        <TitleStyled>Votes</TitleStyled>
      </Col>
      <AppBar position="static" className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          centered
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
          <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
    </>
  )
}

export default Vote
