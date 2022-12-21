import { Text } from '@aura/safe-react-components'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React, { ReactElement } from 'react'
import Col from 'src/components/layout/Col'
import DenseTable from 'src/components/Table/DenseTable'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import TabPanel, { a11yProps } from 'src/components/Tabs/FilterTab/TabPanel'
import styled from 'styled-components'

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const StyledTank = styled.div<{ rank: boolean }>`
  background-color: ${({ rank }) => (rank ? '#363843' : 'transparent')};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: ${({ rank }) => (rank ? '#5ee6d0' : 'white')};
  display: flex;
  justify-content: center;
  align-items: center;
`

const useStyles = makeStyles({
  root: {
    backgroundColor: 'transparent',
    marginTop: 10,
    boxShadow: 'none',
  },
})


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
    <DenseTable headers={['RANK', 'VALIDATOR', 'TxHASH', 'ANSWER', 'TIME']} showPagination>
      {RowData.map((row, index) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {index <= 2 ? (
              <StyledTank rank={true}> {index + 1}</StyledTank>
            ) : (
              <StyledTank rank={false}> {index + 1}</StyledTank>
            )}
          </StyledTableCell>
          <StyledTableCell align="left">{row.id}</StyledTableCell>
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
    </DenseTable>
  )
}

function ValidatorVote(props): ReactElement {
  const [value, setValue] = React.useState(0)
  const classes = useStyles()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <>
      <Col start="sm" sm={12} xs={12}>
        <TitleStyled>Validators Votes</TitleStyled>
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
          <Tab label="DID NOT VOTE (0)" {...a11yProps(4)} />
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
      <TabPanel value={value} index={5}>
        <TableVotingDetailInside />
      </TabPanel>
    </>
  )
}

export default ValidatorVote
