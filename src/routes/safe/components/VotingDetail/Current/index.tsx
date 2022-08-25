import React, { ReactElement } from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import { Divider } from '@material-ui/core'
import StatusCard from 'src/components/StatusCard'

const ContainerCurrent = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  width: 100%;
`

const BorderCurrent = styled.div`
  padding: 10px;
  width: 100%;
`

const DividerStyle = styled(Divider)`
  // margin: 10px;
`

const TitleCurrent = styled.div`
  font-weight: 590;
  font-size: 16px;
  line-height: 20px;
  color: white;
  align-self: center;
`

const ContentCurrent = styled.div`
  font-weight: 590;
  font-size: 12px;
  line-height: 16px;
  color: #5c606d;
  margin-top: 10px;
`

const QuorumStyled = styled.div`
  color: #9da2af;
  font-weight: 590;
  font-size: 12px;
`

const TextVote = styled.div`
  color: white;
  font-weight: 590;
  font-size: 12px;
  margin-left: 10px;
`

const ContainerTextVote = styled.div`
  display: flex;
  justify-content: flex-end;
`

function Current(props): ReactElement {
  return (
    <>
      <Col sm={6} xs={12}>
        <BorderCurrent>
          <ContainerCurrent>
            <TitleCurrent>Current Turnout</TitleCurrent>
            <div style={{ alignSelf: 'center' }}>
              44.38%
              <span>(44M of 100M voted)</span>
            </div>
          </ContainerCurrent>

          <ContentCurrent>
            The result of governance will only be applied when quorum is more than 33% of the total votes.
          </ContentCurrent>

          <Col end="sm" sm={8} xs={12}>
            <ContainerTextVote>
              <QuorumStyled>Quorum: </QuorumStyled>
              <TextVote>
                33% <span style={{ color: '#67C091' }}>(Reached)</span>
              </TextVote>
            </ContainerTextVote>
          </Col>
        </BorderCurrent>
      </Col>
      <DividerStyle orientation="vertical" flexItem />
      <Col sm={6} xs={12}>
        <BorderCurrent>
          <ContainerCurrent>
            <TitleCurrent>Current Status</TitleCurrent>
            <div style={{ alignSelf: 'center' }}>
              <StatusCard status="passed" />
            </div>
          </ContainerCurrent>

          <ContentCurrent>
            The result of governance will only be applied when quorum is more than 33% of the total votes.
          </ContentCurrent>
          <Col end="sm" sm={8} xs={12}>
            <ContainerTextVote>
              <QuorumStyled>Threshold</QuorumStyled>
              <TextVote>50%</TextVote>
            </ContainerTextVote>
          </Col>
        </BorderCurrent>
      </Col>
    </>
  )
}

export default Current
