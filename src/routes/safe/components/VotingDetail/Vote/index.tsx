import React, { ReactElement } from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import TabPanel, { a11yProps } from 'src/components/TabPanel'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import TableVoting from 'src/components/TableVoting'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const useStyles = makeStyles({
  root: {
    backgroundColor: 'transparent',
    marginTop: 10,
    boxShadow: 'none',
  },
})

const RowHead = [{ name: 'VOTER' }, { name: 'TxHASH' }, { name: 'ANSWER' }, { name: 'TIME' }]

const RowData = [
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
]

const TableVotingDetailInside = () => {
  return (
    <TableVoting RowHead={RowHead} ShowPaginate>
      {RowData.map((row) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {row.id}
          </StyledTableCell>
          <StyledTableCell align="left">
            <Text size="lg" color="linkAura">
              {row.title}
            </Text>
          </StyledTableCell>
          <StyledTableCell align="left">{row.status}</StyledTableCell>
          <StyledTableCell align="left">
            <div>2 months ago</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.voting}</div>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableVoting>
  )
}

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
          variant="fullWidth"
          aria-label="scrollable auto tabs example"
          centered
        >
          <Tab label="ALL (6805)" {...a11yProps(0)} />
          <Tab label="YES (6689)" {...a11yProps(1)} />
          <Tab label="NO (26)" {...a11yProps(2)} />
          <Tab label="NOWITHVETO (31)" {...a11yProps(3)} />
          <Tab label="ABSTAIN (59)" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TableVotingDetailInside />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TableVotingDetailInside />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TableVotingDetailInside />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TableVotingDetailInside />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <TableVotingDetailInside />
      </TabPanel>
    </>
  )
}

export default Vote
