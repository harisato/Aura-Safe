import React, { ReactElement, useEffect, useState } from 'react'

import { OutlinedButton } from 'src/components/Button'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import Tabs from 'src/components/Tabs/FilterTab'
import Tab from 'src/components/Tabs/FilterTab/Tab'
import TabPanel, { a11yProps } from 'src/components/Tabs/FilterTab/TabPanel'
import sreachIcon from '../assets/Shape.svg'
import { ContainSearch, HeaderValidator, ImgRow, StyleSearch, TitleStyled, Wrap } from './styles'

const ValidatorTable = (props) => {
  const { data, handleManageDelegate, value, disabledButton } = props
  const obj1 = new Intl.NumberFormat('en-US')

  return (
    <DenseTable headers={['Rank', 'Validator', 'Voting Power', 'Commision', 'Uptime', ' ']}>
      {data?.map((row, index) => (
        <StyledTableRow key={index}>
          <StyledTableCell component="th" scope="row">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell align="left">
            <ImgRow>
              <img src={row.description.picture} />
              <p className="validator-name">{row.validator}</p>
            </ImgRow>
          </StyledTableCell>
          <StyledTableCell align="left">
            <div>{obj1.format(parseInt(row.votingPower.number))}</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.votingPower.percentage} %</div>
          </StyledTableCell>
          <StyledTableCell align="left">
            {parseFloat(String(row.commission.commission_rates.rate * 100)).toFixed(2)} %
          </StyledTableCell>

          <StyledTableCell align="left">{+parseFloat(row.uptime).toFixed(2)} %</StyledTableCell>
          {value === 0 && !disabledButton ? (
            <StyledTableCell align="right">
              <OutlinedButton className="small" onClick={() => handleManageDelegate(row)}>
                Delegate
              </OutlinedButton>
            </StyledTableCell>
          ) : (
            <StyledTableCell></StyledTableCell>
          )}
        </StyledTableRow>
      ))}
    </DenseTable>
  )
}

function Validators(props): ReactElement {
  const { allValidator, handleManageDelegate, disabledButton } = props
  const [value, setValue] = React.useState(0)

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
    <Wrap>
      <HeaderValidator>
        <TitleStyled>Validators</TitleStyled>
        <div>
          {!disabledButton && (
            <>
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
              <span className="div-bar" />
            </>
          )}
          {dataActive && (
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Active" {...a11yProps(0)} disabled={dataActive?.length > 0 ? false : true} />
              <Tab label="Inactive" {...a11yProps(1)} disabled={dataInActive?.length > 0 ? false : true} />
            </Tabs>
          )}
        </div>
      </HeaderValidator>

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
    </Wrap>
  )
}

export default Validators
