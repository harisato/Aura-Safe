import { Text } from '@aura/safe-react-components'
import { makeStyles } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import TableVoting, { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'
import {
  BoxCardStaking,
  BoxCardStakingList,
  BoxCardStakingOverview,
  ImgRow,
  StyledButton,
  StyledButtonManage,
  styles,
} from './style'

const RowHead = [
  { name: 'NAME' },
  { name: 'AMOUNT STAKED' },
  { name: 'PENDING REWARD' },
  // { name: 'TIME' },
  { name: '' },
]

const TableVotingDetailInside = (props) => {
  const { handleModal, data, nativeCurrency } = props

  return (
    <TableVoting RowHead={RowHead}>
      {data?.map((row, index) => (
        <StyledTableRow key={index}>
          <StyledTableCell component="th" scope="row">
            <ImgRow>
              <img style={{ marginRight: 5 }} src={row?.description?.picture} />
              <Text size="lg" color="linkAura">
                {row.validator}
              </Text>
            </ImgRow>
          </StyledTableCell>
          <StyledTableCell align="left">
            <Text size="lg" color="linkAura">
              {row?.balance?.amount / 10 ** nativeCurrency.decimals}
            </Text>
          </StyledTableCell>
          <StyledTableCell align="left">{row?.reward?.length > 0 ? 'Yes' : 'No'}</StyledTableCell>
          {/* <StyledTableCell align="left">
            <div>2 months ago</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.voting}</div>
          </StyledTableCell> */}
          <StyledTableCell align="right">
            <StyledButtonManage size="md" onClick={() => handleModal(row)}>
              <Text size="lg" color="white">
                Manage
              </Text>
            </StyledButtonManage>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableVoting>
  )
}

const useStyles = makeStyles(styles)

function CardStaking(props): ReactElement {
  const {
    handleModal,
    availableBalance,
    totalStake,
    rewardAmount,
    validatorOfUser,
    allValidator,
    ClaimReward,
    nativeCurrency,
  } = props
  const classes = useStyles()
  const [data, setData] = useState()

  useEffect(() => {
    const dataTemp: any = []
    allValidator?.map((item) => {
      validatorOfUser?.map((i) => {
        if (item.operatorAddress === i.operatorAddress) {
          dataTemp.push({
            ...item,
            balance: i.balance,
            reward: i.reward,
          })
        }
      })
    })
    setData(dataTemp)
  }, [validatorOfUser])

  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <div className={classes.stakingOverview}>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Available Balance:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              {availableBalance?.amount ? availableBalance?.amount / 10 ** nativeCurrency.decimals : 0}{' '}
              <span style={{ color: '#5EE6D0' }}>{nativeCurrency.symbol}</span>
            </Text>
          </div>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Total Staked:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              {totalStake?.amount ? totalStake?.amount / 10 ** nativeCurrency.decimals : 0}{' '}
              <span style={{ color: '#5EE6D0' }}>{nativeCurrency.symbol}</span>
            </Text>
          </div>
        </div>
        {rewardAmount[0]?.amount / 10 ** nativeCurrency.decimals > 0 && (
          <StyledButton onClick={ClaimReward}>
            <span style={{ fontSize: 14, fontWeight: 590 }}>
              Claim Reward: {rewardAmount[0] ? (rewardAmount[0]?.amount / 10 ** nativeCurrency.decimals).toFixed(6) : 0}{' '}
              {nativeCurrency.symbol}
            </span>
          </StyledButton>
        )}
      </BoxCardStakingOverview>
      {validatorOfUser && validatorOfUser?.length > 0 && (
        <BoxCardStakingList>
          <TableVotingDetailInside nativeCurrency={nativeCurrency} handleModal={handleModal} data={data} />
        </BoxCardStakingList>
      )}
    </BoxCardStaking>
  )
}

export default CardStaking
