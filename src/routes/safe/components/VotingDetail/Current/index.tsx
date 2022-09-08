import React, { ReactElement } from 'react'
import Col from 'src/components/layout/Col'
import StatusCard from 'src/components/StatusCard'
import Vote from 'src/components/Vote'
import {
  ContainTextVote,
  DotNot,
  DotNo,
  DotYes,
  TextVoteWhite,
  TextHover,
  ContainVote,
  ContainerTextVote,
  TextVote,
  QuorumStyled,
  ContentCurrent,
  TitleCurrent,
  DividerStyle,
  BorderCurrent,
  ContainerCurrent,
} from './styles'

function Current(props): ReactElement {
  return (
    <>
      <Col sm={6} xs={12}>
        <BorderCurrent>
          <ContainerCurrent>
            <TitleCurrent>Current Turnout</TitleCurrent>
            <div style={{ alignSelf: 'center' }}>
              44.38% <span style={{ fontWeight: 510, fontSize: 14, color: '#868A97' }}>(44M of 100M voted)</span>
            </div>
          </ContainerCurrent>

          <ContentCurrent>
            The result of governance will only be applied when quorum is more than 33% of the total votes.
          </ContentCurrent>

          <Col end="sm" sm={10} xs={12}>
            <ContainerTextVote>
              <QuorumStyled>Quorum: </QuorumStyled>
              <TextVote>
                33% <span style={{ color: '#67C091' }}>(Reached)</span>
              </TextVote>
            </ContainerTextVote>
          </Col>
          <Vote perNo="40%" perYes="60%" notVote vote={{ yes: '100', no: '0', abstain: '0', no_with_veto: '0' }} />
          <Col end="sm" sm={12} xs={12}>
            <ContainVote>
              <Col start="sm" sm={4} xs={12} layout="column">
                <TextHover>Voted</TextHover>
                <TextHover>Voted abstain</TextHover>
                <TextHover>Did not vote</TextHover>
              </Col>
              <Col sm={4} xs={12} layout="column">
                <TextVoteWhite>44.76%</TextVoteWhite>
                <TextVoteWhite>0.38%</TextVoteWhite>
                <TextVoteWhite>55.62%</TextVoteWhite>
              </Col>
              <Col sm={4} xs={12} layout="column">
                <TextHover>132.392000</TextHover>
                <TextHover>132.392000</TextHover>
                <TextHover>132.392000</TextHover>
              </Col>
            </ContainVote>
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
          <Col end="sm" sm={10} xs={12}>
            <ContainerTextVote>
              <QuorumStyled>Threshold</QuorumStyled>
              <TextVote>50%</TextVote>
            </ContainerTextVote>
          </Col>
          <Vote perNo="40%" perYes="60%" vote={{ yes: '100', no: '0', abstain: '0', no_with_veto: '0' }} />
          <Col end="sm" sm={12} xs={12}>
            <ContainVote>
              <Col start="sm" sm={4} xs={12} layout="column">
                <ContainTextVote>
                  <DotYes />
                  <TextVoteWhite>Yes</TextVoteWhite>
                </ContainTextVote>
                <ContainTextVote>
                  <DotNo />
                  <TextVoteWhite>No</TextVoteWhite>
                </ContainTextVote>
                <ContainTextVote>
                  <DotNot />
                  <TextVoteWhite>No with Veto</TextVoteWhite>
                </ContainTextVote>
              </Col>
              <Col sm={4} xs={12} layout="column">
                <TextVoteWhite>44.76%</TextVoteWhite>
                <TextVoteWhite>0.38%</TextVoteWhite>
                <TextVoteWhite>55.62%</TextVoteWhite>
              </Col>
              <Col sm={4} xs={12} layout="column">
                <TextHover>132.392000</TextHover>
                <TextHover>132.392000</TextHover>
                <TextHover>132.392000</TextHover>
              </Col>
            </ContainVote>
          </Col>
        </BorderCurrent>
      </Col>
    </>
  )
}

export default Current
