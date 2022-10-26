import React, { ReactElement, useState, useEffect } from 'react'

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
import sreachIcon from '../assets/Shape.svg'
import * as _ from 'lodash'

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
    width: 330,
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

const ContainSearch = styled.div`
  border: 1px solid #363843;
  border-radius: 25px;
  width: 350px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #131419;
`
const StyleSearch = styled.input`
  background: transparent;
  height: 100%;
  width: 90%;
  outline: none;
  border: none;
  color: #868a97;
`
const HeaderValidator = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const ImgRow = styled.div`
  display: flex;
  > img {
    margin-right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`

const TableVotingDetailInside = (props) => {
  const { data, dandleManageDelegate, value } = props
  const obj1 = new Intl.NumberFormat('en-US')

  return (
    <TableVoting RowHead={RowHead}>
      {data?.map((row, index) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell align="left">
            <ImgRow>
              <img src={row.description.picture} />
              <Text size="lg" color="linkAura">
                {row.validator}
              </Text>
            </ImgRow>
          </StyledTableCell>
          <StyledTableCell align="left">
            <div>{obj1.format(row.votingPower.number)}</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.votingPower.percentage} %</div>
          </StyledTableCell>
          <StyledTableCell align="left">
            {parseFloat(row.commission.commission_rates.rate).toFixed(2)} %
          </StyledTableCell>

          <StyledTableCell align="left">{row.uptime} %</StyledTableCell>
          {value === 0 && (
            <StyledTableCell align="right">
              <StyledButton size="md" onClick={() => dandleManageDelegate(row)}>
                <Text size="lg" color="white">
                  Delegate
                </Text>
              </StyledButton>
            </StyledTableCell>
          )}
        </StyledTableRow>
      ))}
    </TableVoting>
  )
}

function Validators(props): ReactElement {
  const { allValidator, dandleManageDelegate } = props
  const [value, setValue] = React.useState(0)
  const classes = useStyles()

  const [search, setSearch] = useState('')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [dataActive, setDataActive] = React.useState([])
  const [dataInActive, setDataInActive] = React.useState([])

  const handleData = async () => {
    const dataTempActive: any = []
    const dataTempInActive: any = []

    await allValidator.map((item) => {
      if (item.status === 'BOND_STATUS_BONDED') {
        dataTempActive.push(item)
      } else {
        dataTempInActive.push(item)
      }
    })
    await setDataActive(dataTempActive)
    await setDataInActive(dataTempInActive)
  }

  React.useEffect(() => {
    handleData()
  }, [allValidator])

  useEffect(() => {
    if (value === 0) {
      setDataActive(allValidator.filter((item) => item.validator.toLowerCase().includes(search.toLowerCase())))
    }
    if (value === 1) {
      setDataInActive(allValidator.filter((item) => item.validator.toLowerCase().includes(search.toLowerCase())))
    }
    if (search === '') {
      handleData()
    }
  }, [search])

  return (
    <>
      <Col start="sm" sm={12} xs={12}>
        <HeaderValidator>
          <TitleStyled>Validators</TitleStyled>
          <ContainSearch>
            <StyleSearch
              type="text"
              placeholder="Search validators"
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <img src={sreachIcon} alt="icon-search" />
          </ContainSearch>
        </HeaderValidator>
      </Col>

      {dataActive && (
        <AppBar position="static" className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"
            // aria-label="scrollable auto tabs example"
          >
            <Tab label="ACTIVE" {...a11yProps(0)} disabled={dataActive?.length > 0 ? false : true} />
            <Tab label="INACTIVE" {...a11yProps(1)} disabled={dataInActive?.length > 0 ? false : true} />
          </Tabs>
        </AppBar>
      )}

      {allValidator && (
        <>
          <TabPanel value={value} index={0}>
            <TableVotingDetailInside data={dataActive} dandleManageDelegate={dandleManageDelegate} value={value} />
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
