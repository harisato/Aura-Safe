import { Text } from '@aura/safe-react-components'
import { Divider } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import Col from 'src/components/layout/Col'
import DenseTable, { StyledTableCell, StyledTableRow } from 'src/components/Table/DenseTable'
import { formatTimeInWords, getUTCStartOfDate } from 'src/utils/date'
import styled from 'styled-components'

const BoxCardStakingOverview = styled.div`
  padding: 24px;
  background: #363843;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
`
const BoxCardStaking = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #363843;
  align-items: flex-start;
`
const BoxCardStakingList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: flex-start;
  padding: 0px 24px 24px;
  background: #24262e;
  max-height: 200px;
  overflow: auto;
  margin-top: 30px;
  > div {
    width: 100%;
  }
`

const DelegateRow = styled.div`
  display: flex;
  width: 100%;
`

const TotalDelegate = styled.div`
  display: flex;
`

const ImgStyled = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

const BoxImg = styled.div`
  display: flex;
  align-self: center;
`

const TextImg = styled(Text)`
  margin-left: 10px;
  align-self: center;
`

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`

function Undelegating(props): ReactElement {
  const { unValidatorOfUser, allValidator } = props
  const [data, setData] = useState([])

  useEffect(() => {
    const dataTemp: any = []
    allValidator?.map((item) => {
      unValidatorOfUser?.map((i) => {
        if (item.operatorAddress === i.operatorAddress) {
          dataTemp.push({
            ...item,
            completionTime: i.completionTime,
            balance: i.balance,
          })
        }
      })
    })
    setData(dataTemp)
  }, [allValidator])

  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <Text size="lg" color="disableAura">
          Undelegating
        </Text>
      </BoxCardStakingOverview>
      <BoxCardStakingList>
        <DenseTable headers={[]}>
          {data?.map((item: any, index) => {
            return (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  <Col sm={2} xs={12}>
                    <BoxImg>
                      <ImgStyled src={item?.description?.picture} alt="DokiaCapital" />
                      <TextImg size="lg" color="linkAura">
                        {item.validator}
                      </TextImg>
                    </BoxImg>
                  </Col>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Col end="lg" sm={2} xs={12}>
                    <div>
                      <TotalDelegate>
                        <Text size="lg" color="white">
                          {item?.balance / 10 ** 6 || 0}
                        </Text>
                      </TotalDelegate>
                      <Text size="lg" color="disableAura">
                        {formatTimeInWords(getUTCStartOfDate(item?.completionTime))}
                      </Text>
                    </div>
                  </Col>
                </StyledTableCell>
              </StyledTableRow>
            )
          })}
        </DenseTable>
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default Undelegating
