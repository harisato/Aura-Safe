import { Divider } from '@material-ui/core'
import styled from 'styled-components'
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

const ContainVote = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const TextHover = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #9da1ac;
`
const TextVoteWhite = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`

const DotYes = styled.div`
  background: #5ee6d0;
  border-radius: 23px;
  width: 16px;
  height: 16px;
  align-self: center;
  margin-right: 10px;
`
const DotNo = styled.div`
  background: #e65e5e;
  border-radius: 23px;
  width: 16px;
  height: 16px;
  align-self: center;
  margin-right: 10px;
`
const DotNot = styled.div`
  background: #9da8ff;
  border-radius: 23px;
  width: 16px;
  height: 16px;
  align-self: center;
  margin-right: 10px;
`

const ContainTextVote = styled.div`
  display: flex;
`
export {
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
}
