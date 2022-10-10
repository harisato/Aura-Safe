import React, { ReactElement } from 'react'

import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import TableVoting from 'src/components/TableVoting'
import { Text, Button } from '@aura/safe-react-components'
import AppBar from '@material-ui/core/AppBar'
import TabPanel, { a11yProps } from 'src/components/TabPanel'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'
import { borderLinear } from 'src/theme/variables'

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

const RowHead = [
  { name: 'RANK' },
  { name: 'VALIDATOR' },
  { name: 'VOTING POWER' },
  { name: 'COMMISION' },
  { name: 'UPTIME' },
  { name: ' ' },
]

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
]

const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
`

const TableVotingDetailInside = (props) => {
  const { data, dandleManageDelegate } = props

  return (
    <TableVoting RowHead={RowHead}>
      {data &&
        data.map((row, index) => (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {index + 1}
            </StyledTableCell>
            <StyledTableCell align="left">
              <Text size="lg" color="linkAura">
                {row.validator}
              </Text>
            </StyledTableCell>
            <StyledTableCell align="left">
              <div>{row.votingPower.number}</div>
              <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.votingPower.percentage} %</div>
            </StyledTableCell>
            <StyledTableCell align="left">
              {parseFloat(row.commission.commission_rates.rate).toFixed(2)} %
            </StyledTableCell>

            <StyledTableCell align="left">{row.uptime} %</StyledTableCell>
            <StyledTableCell align="right">
              <StyledButton size="md" onClick={() => dandleManageDelegate(row)}>
                <Text size="lg" color="white">
                  Manage
                </Text>
              </StyledButton>
            </StyledTableCell>
          </StyledTableRow>
        ))}
    </TableVoting>
  )
}

function Validators(props): ReactElement {
  const { allValidator, dandleManageDelegate } = props
  const [value, setValue] = React.useState(0)
  const classes = useStyles()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [dataActive, setDataActive] = React.useState([])
  const [dataInActive, setDataInActive] = React.useState([])

  React.useEffect(() => {
    const dataTempActive: any = []
    const dataTempInActive: any = []
    allValidator.map((item) => {
      if (item.status === 'BOND_STATUS_BONDED') {
        dataTempActive.push(item)
      } else {
        dataTempInActive.push(item)
      }
    })
    setDataActive(dataTempActive)
    setDataInActive(dataTempInActive)
  }, [allValidator])

  return (
    <>
      <Col start="sm" sm={12} xs={12}>
        <TitleStyled>Validators</TitleStyled>
      </Col>

      {dataActive && (
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
            <Tab label="ACTIVE" {...a11yProps(0)} disabled={dataActive?.length > 0 ? false : true} />
            <Tab label="INACTIVE" {...a11yProps(1)} disabled={dataInActive?.length > 0 ? false : true} />
          </Tabs>
        </AppBar>
      )}

      {allValidator && allValidator.length > 1 && (
        <>
          <TabPanel value={value} index={0}>
            <TableVotingDetailInside data={dataActive} dandleManageDelegate={dandleManageDelegate} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableVotingDetailInside data={dataInActive} dandleManageDelegate={dandleManageDelegate} />
          </TabPanel>
        </>
      )}
    </>
  )
}

export default Validators
