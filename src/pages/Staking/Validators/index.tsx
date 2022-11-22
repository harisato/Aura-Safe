import React, { ReactElement, useEffect, useState } from 'react'

import { Button, Text } from '@aura/safe-react-components'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Col from 'src/components/layout/Col'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import TabPanel, { a11yProps } from 'src/components/TabPanel'
import { borderLinear } from 'src/theme/variables'
import styled from 'styled-components'
import sreachIcon from '../assets/Shape.svg'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { useSelector } from 'react-redux'

const TitleStyled = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const useStyles = makeStyles({
  root: {
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 30,
    boxShadow: 'none',
    width: 330,
  },
})

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
  padding: 12px 24px;
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

const ValidatorTable = (props) => {
  const { data, handleManageDelegate, value, disabledButton } = props
  const obj1 = new Intl.NumberFormat('en-US')

  return (
    <DenseTable headers={['RANK', 'VALIDATOR', 'VOTING POWER', 'COMMISION', 'UPTIME', ' ']}>
      {data?.map((row, index) => (
        <StyledTableRow key={index}>
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
          {value === 0 && !disabledButton && (
            <StyledTableCell align="right">
              <StyledButton size="md" onClick={() => handleManageDelegate(row)}>
                <Text size="lg" color="white">
                  Delegate
                </Text>
              </StyledButton>
            </StyledTableCell>
          )}
        </StyledTableRow>
      ))}
    </DenseTable>
  )
}

function Validators(props): ReactElement {
  const { allValidator, handleManageDelegate, disabledButton } = props
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
          {!disabledButton && (
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
          )}
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
            <ValidatorTable
              data={dataActive}
              handleManageDelegate={handleManageDelegate}
              value={value}
              disabledButton={disabledButton}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ValidatorTable data={dataInActive} handleManageDelegate={handleManageDelegate} />
          </TabPanel>
        </>
      )}
    </>
  )
}

export default Validators
