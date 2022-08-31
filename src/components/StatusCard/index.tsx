import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StatusStyled = styled.div<{ bg: string; color: string }>`
  padding: 8px 16px;
  background-color: ${({ bg }) => bg};
  border-radius: 4px;
  color: ${({ color }) => color};
  font-size: 12px;
  display: flex;
`
const DotStyle = styled.div<{ bg: string }>`
  background-color: ${({ bg }) => bg};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  align-self: center;
  margin-right: 10px;
`

function StatusCard(props): ReactElement {
  const { status, showDot } = props

  const CheckShowDot = (bg) => {
    if (showDot) {
      return 'transparent'
    }
    return bg
  }

  const returnStatus = () => {
    if (status === 'deposit') {
      return (
        <StatusStyled bg={CheckShowDot('rgba(231, 187, 65, 0.2)')} color="#FFCD76">
          {showDot && <DotStyle bg="#FFCD76" />}
          Deposit Period
        </StatusStyled>
      )
    }
    if (status === 'rejected') {
      return (
        <StatusStyled bg={CheckShowDot('rgba(220, 56, 63, 0.2);')} color="#FA8684">
          {showDot && <DotStyle bg="#FA8684" />}
          Rejected
        </StatusStyled>
      )
    }
    if (status === 'voting') {
      return (
        <StatusStyled bg={CheckShowDot('rgba(91, 200, 255, 0.2);')} color="#7DC8FA">
          {showDot && <DotStyle bg="#7DC8FA" />}
          Voting Period
        </StatusStyled>
      )
    }
    if (status === 'passed') {
      return (
        <StatusStyled bg={CheckShowDot('rgba(84, 206, 140, 0.2);')} color="#67C091">
          {showDot && <DotStyle bg="#67C091" />}
          Passed
        </StatusStyled>
      )
    }
  }

  return <>{returnStatus()}</>
}

export default StatusCard
