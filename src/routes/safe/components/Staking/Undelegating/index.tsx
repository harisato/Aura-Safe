import { ReactElement, useEffect, useState } from 'react'
import { Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import cryto from '../assets/cryto.svg'
import { Divider } from '@material-ui/core'
import { getDisplayAddress } from '../constant'
import { getUTCStartOfDate, formatTimeInWords } from 'src/utils/date'

const BoxCardStakingOverview = styled.div`
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
  max-height: 300px;
  overflow: auto;
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
        {data?.map((item: any, index) => {
          return (
            <div key={index}>
              <DelegateRow>
                <Col end="lg" sm={2} xs={12}>
                  <BoxImg>
                    <ImgStyled src={item?.description?.picture} alt="DokiaCapital" />
                    <TextImg size="lg" color="linkAura">
                      {item.validator}
                    </TextImg>
                  </BoxImg>
                </Col>
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
              </DelegateRow>

              {data.length > 1 && <StyleDivider />}
            </div>
          )
        })}
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default Undelegating
