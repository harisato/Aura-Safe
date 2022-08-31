import React, { ReactElement } from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import { makeStyles } from '@material-ui/core/styles'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import TableVoting from 'src/components/TableVoting'
import { Text } from '@aura/safe-react-components'

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

const RowHead = [{ name: 'DEPOSITOR' }, { name: 'TxHASH' }, { name: 'ANSWER' }, { name: 'TIME' }]

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

const TableVotingDetailInside = () => {
  return (
    <TableVoting RowHead={RowHead}>
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

function Depositors(props): ReactElement {
  const [value, setValue] = React.useState(0)

  return (
    <>
      <Col start="sm" sm={12} xs={12}>
        <TitleStyled>Depositors</TitleStyled>
      </Col>

      <TableVotingDetailInside />
    </>
  )
}

export default Depositors
