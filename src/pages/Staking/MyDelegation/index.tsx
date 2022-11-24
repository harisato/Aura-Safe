import { Text } from '@aura/safe-react-components'
import BigNumber from 'bignumber.js'
import { ReactElement, useEffect, useState } from 'react'
import { FilledButton, OutlinedButton } from 'src/components/Button'
import Gap from 'src/components/Gap'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import { formatBigNumber } from 'src/utils'
import { Wrapper } from './style'

export default function MyDelegation(props): ReactElement {
  const {
    handleModal,
    availableBalance,
    totalStake,
    rewardAmount,
    validatorOfUser,
    allValidator,
    claimReward,
    nativeCurrency,
    disabledButton,
  } = props
  const [data, setData] = useState<any[]>()

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
  }, [validatorOfUser?.length])

  return (
    <Wrapper>
      <div className="stake-management">
        <div className="balance">
          <div>
            <p className="label">Available Balance:</p>
            <p className="amount">
              {availableBalance?.amount ? formatBigNumber(availableBalance?.amount) : 0}{' '}
              <span style={{ color: '#5EE6D0' }}>{nativeCurrency.symbol}</span>
            </p>
          </div>
          <Gap height={8} />
          <div>
            <p className="label">Total Staked:</p>
            <p className="amount">
              {totalStake?.amount ? formatBigNumber(totalStake?.amount) : 0}{' '}
              <span style={{ color: '#5EE6D0' }}>{nativeCurrency.symbol}</span>
            </p>
          </div>
        </div>
        {rewardAmount[0]?.amount >= 1 && !disabledButton ? (
          <FilledButton size="md" onClick={claimReward}>
            <span style={{ fontSize: 14, fontWeight: 590 }}>
              Claim Reward: {rewardAmount[0] ? formatBigNumber(rewardAmount[0]?.amount) : 0} {nativeCurrency.symbol}
            </span>
          </FilledButton>
        ) : (
          <div></div>
        )}
      </div>
      {validatorOfUser && validatorOfUser?.length > 0 && (
        <div className="staked-validator">
          <DenseTable headers={['NAME', 'AMOUNT STAKED', 'PENDING REWARD', '']}>
            {data?.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  <div className="validator-cell">
                    <img style={{ marginRight: 5 }} src={row?.description?.picture} />
                    <Text size="lg" color="linkAura">
                      {row.validator}
                    </Text>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Text size="lg" color="linkAura">
                    {formatBigNumber(row?.balance?.amount)}
                  </Text>
                </StyledTableCell>
                <StyledTableCell align="left">{row?.reward?.length > 0 ? 'Yes' : 'No'}</StyledTableCell>
                <StyledTableCell align="right">
                  {!disabledButton && (
                    <OutlinedButton size="md" onClick={() => handleModal(row)}>
                      Manage
                    </OutlinedButton>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </DenseTable>
        </div>
      )}
    </Wrapper>
  )
}
