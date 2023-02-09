import styled from 'styled-components'
import CheckCircle from 'src/assets/icons/CheckCircle.svg'
import { useState } from 'react'
import { setChainId } from 'src/logic/config/utils'
import { getChainById, getChainInfo, getExplorerUriTemplate, getShortName } from 'src/config'
import { THEME_DF } from 'src/services/constant/chainThemes'
import { OutlinedButton } from 'src/components/Button'
import { formatDateTime, formatTimeInWords } from 'src/utils/date'
import { getChains } from 'src/config/cache/chains'
import { shortAddress } from 'src/utils'
import {
  ALLOW_SPECIFIC_SAFE_ROUTE,
  extractSafeAddress,
  generatePrefixedAddressRoutes,
  generateSafeRoute,
  SafeRouteParams,
  SAFE_ROUTES,
} from 'src/routes/routes'
import { useHistory } from 'react-router-dom'
import { evalTemplate } from 'src/config/utils'
const Wrap = styled.div`
  padding: 16px 12px;
  border-bottom: 1px solid #363843;
  &:not(.readed) {
    background: #253b4c;
  }
  p {
    margin: 0;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .chain {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > p {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.01em;
      }
    }
    .time {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #868a97;
    }
  }
  .content {
    margin: 8px 0px;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #b4b8c0;
    > strong {
      overflow: hidden;
      max-width: 100%;
      display: inline-block;
      text-overflow: ellipsis;
    }
  }
  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
const StyledDotChainName = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 5px;
`
export default function Notification({ data, toggle, setMarkedNoti, isUnread }) {
  const chainInfo = getChains().find((chain) => (chain as any).internalChainId == data.internalChainId)
  const currentChainInfo = getChainInfo()
  const history = useHistory()
  const { backgroundColor } = chainInfo?.theme || THEME_DF

  const handleVotingDetail = (proposalId) => {
    const uri = getExplorerUriTemplate()['proposals']
    window.open(evalTemplate(uri, { ['proposalsId']: proposalId }))
  }

  const onActionClick = (event, data, action) => {
    setMarkedNoti((cur) => {
      if (!cur?.includes(data.id)) {
        return [...cur, data.id]
      }
      return cur
    })
    toggle && toggle()
    action && action()
    chainInfo?.chainId && chainInfo?.chainId != currentChainInfo?.chainId && setChainId(chainInfo?.chainId)
  }

  const routesSlug: SafeRouteParams = {
    shortName: getChainById(data.internalChainId).shortName,
    safeId: data.safeId,
    safeAddress: data.safeAddress,
  }

  return (
    <Wrap
      className={isUnread ? '' : 'readed'}
      onClick={() =>
        setMarkedNoti((cur) => {
          if (!cur?.includes(data.id)) {
            return [...cur, data.id]
          }
          return cur
        })
      }
    >
      <div className="header">
        <div className="chain">
          <StyledDotChainName color={backgroundColor} />
          <p>{chainInfo?.chainName || 'Unknown chain'}</p>
        </div>
        <p className="time">{formatTimeInWords(new Date(data.createdAt).getTime())}</p>
      </div>
      {(function () {
        switch (data.eventType) {
          case 'WAIT_CONFIRM_TX':
            return (
              <>
                <div className="content">
                  Transaction <strong>#{data.sequence}</strong> of <strong>{shortAddress(data.safeAddress)}</strong> was
                  created by <strong>{shortAddress(data.txCreatorAddress)}</strong> and require confirmation.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(
                          generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, routesSlug) + `?transactionId=${data.txId}`,
                        ),
                      )
                    }
                  >
                    See Transaction
                  </OutlinedButton>
                </div>
              </>
            )
          case 'WAIT_ALLOW_SAFE':
            return (
              <>
                <div className="content">
                  Owner <strong>{shortAddress(data.safeCreatorAddress)}</strong> has created a safe with you
                  {data.totalOwner > 2
                    ? ` and ${2 - data.totalOwner} other ${2 - data.totalOwner > 3 ? ' owners' : 'owner'}`
                    : ''}
                  .
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(generateSafeRoute(ALLOW_SPECIFIC_SAFE_ROUTE, routesSlug)),
                      )
                    }
                  >
                    Allow Safe
                  </OutlinedButton>
                </div>
              </>
            )
          case 'SAFE_CREATED':
            return (
              <>
                <div className="content">
                  <strong>{data.safeAddress}</strong> is now ready to use.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug)),
                      )
                    }
                  >
                    Go to Safe
                  </OutlinedButton>
                </div>
              </>
            )
          case 'WAIT_EXECUTE_TX':
            return (
              <>
                <div className="content">
                  Transaction <strong>#{data.sequence}</strong> of <strong>{shortAddress(data.safeAddress)}</strong> is
                  now ready for execution.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(
                          generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, routesSlug) + `?transactionId=${data.txId}`,
                        ),
                      )
                    }
                  >
                    See Transaction
                  </OutlinedButton>
                </div>
              </>
            )
          case 'TX_BROADCASTED':
            return (
              <>
                <div className="content">
                  Transaction <strong>#{data.sequence}</strong> of <strong>{shortAddress(data.safeAddress)}</strong> has
                  been successfully broadcasted.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(
                          generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, routesSlug) +
                            `?transactionId=${data.txId}`,
                        ),
                      )
                    }
                  >
                    See Transaction
                  </OutlinedButton>
                </div>
              </>
            )
          case 'TX_DELETED':
            return (
              <>
                <div className="content">
                  Transaction <strong>#{data.sequence}</strong> of <strong>{shortAddress(data.safeAddress)}</strong> has
                  been deleted by <strong>{shortAddress(data.txCreatorAddress)}</strong>.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () =>
                        history.push(
                          generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, routesSlug) +
                            `?transactionId=${data.txId}`,
                        ),
                      )
                    }
                  >
                    See Transaction
                  </OutlinedButton>
                </div>
              </>
            )
          case 'START_VOTING_PERIOD':
            return (
              <>
                <div className="content">
                  Proposal{' '}
                  <strong>
                    #{data.proposalNumber}:{data.proposalName}
                  </strong>{' '}
                  is now available for voting until{' '}
                  <strong>{formatDateTime(new Date(data.proposalEndDate).getTime())}</strong>.
                </div>
                <div className="action">
                  <OutlinedButton
                    className="small"
                    onClick={(event) =>
                      onActionClick(event, data, () => history.push(generateSafeRoute(SAFE_ROUTES.VOTING, routesSlug)))
                    }
                  >
                    Go to Voting
                  </OutlinedButton>
                </div>
              </>
            )

          default:
            return (
              <>
                <div className="content">{`Unknown Notification`}</div>
                <div className="action">
                  <OutlinedButton className="small">Call to action</OutlinedButton>
                </div>
              </>
            )
        }
      })()}
    </Wrap>
  )
}
