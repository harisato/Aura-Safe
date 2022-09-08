import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import styled from 'styled-components'
import { styles } from './style'
import { makeStyles } from '@material-ui/core'
import TableVoting from 'src/components/TableVoting'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'

const StyledButton = styled.div`
  display: flex;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  gap: 6px;
  background: linear-gradient(108.46deg, #5ee6d0 12.51%, #bfc6ff 51.13%, #ffba69 87.49%);
  cursor: pointer;
  color: rgba(19, 20, 25, 1);
`
const BoxCardStakingOverview = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-self: stretch;
  align-items: center;
  padding: 24px;
  background: #363843;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
`
const BoxCardStaking = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  background: #363843;
  align-items: flex-start;
`
const BoxCardStakingList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: flex-start;
  padding: 24px;
  background: #24262e;
  border-radius: 25px;
`

const RowHead = [{ name: 'NAME' }, { name: 'AMOUNT STAKED' }, { name: 'PENDING REWARD' }, { name: 'TIME' }]

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

const useStyles = makeStyles(styles)

function CardStaking(props): ReactElement {
  const { handleModal } = props
  const classes = useStyles()
  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <div className={classes.stakingOverview}>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Available Balance:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              64.000000 AURA
            </Text>
          </div>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Total Staked:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              123.092822 AURA
            </Text>
          </div>
        </div>
        <StyledButton>
          <span style={{ fontSize: 14, fontWeight: 590 }} onClick={handleModal}>
            Claim Reward: 0.012672 AURA
          </span>
        </StyledButton>
      </BoxCardStakingOverview>
      <BoxCardStakingList>
        <TableVotingDetailInside />
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default CardStaking
