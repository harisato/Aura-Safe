import { ReactElement } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import CardVoting from 'src/components/CardVoting'
import Block from 'src/components/layout/Block'
import BoxCard from 'src/components/BoxCard'
import TableVoting from 'src/components/TableVoting'
import { StyleCard, TitleNumberStyled } from './styles'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'

const RowHead = [
  { name: '#ID' },
  { name: 'TITLE' },
  { name: 'STATUS' },
  { name: 'VOTING START' },
  { name: 'SUBMIT TIME' },
  { name: 'TOTAL DEPOSIT' },
]

const RowData = [
  {
    id: '#60',
    title: 'Signal proposal',
    status: 'deposit',
    voting: '2022-01-09 | 07:55:02',
    submitTime: '2022-01-09 | 07:55:02',
    total: '64.000000 AURA',
  },
  {
    id: '#60',
    title: 'Signal proposal',
    status: 'deposit',
    voting: '2022-01-09 | 07:55:02',
    submitTime: '2022-01-09 | 07:55:02',
    total: '64.000000 AURA',
  },
]

function Voting(props): ReactElement {
  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement color="white" iconType="votingAura" text="Voting" />
          </Breadcrumb>
        </Col>
      </Menu>
      <Block>
        {' '}
        <Col
          sm={12}
          xs={12}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginLeft: -10,
          }}
        >
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
          <Col sm={6} xs={12}>
            <CardVoting />
          </Col>
        </Col>
      </Block>
      <StyleCard>
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <BoxCard justify="flex-start" column>
            <TitleNumberStyled>Proposals</TitleNumberStyled>
            <TableVoting RowHead={RowHead} RowData={RowData}>
              {RowData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.title}</StyledTableCell>
                  <StyledTableCell align="left">{row.status}</StyledTableCell>
                  <StyledTableCell align="left">{row.voting}</StyledTableCell>
                  <StyledTableCell align="left">{row.submitTime}</StyledTableCell>
                  <StyledTableCell align="left">{row.total}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableVoting>
          </BoxCard>
        </Col>
      </StyleCard>
    </>
  )
}

export default Voting
