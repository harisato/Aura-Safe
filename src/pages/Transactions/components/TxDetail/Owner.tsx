import { Text as AuraText } from '@aura/safe-react-components'
import { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import { AddressInfo } from 'src/routes/safe/components/Transactions/TxList/AddressInfo'
import DoneIcon from 'src/assets/icons/done-icon.svg'
import ExecuteIcon from 'src/assets/icons/excute-icon.svg'
import NotExecuteIcon from 'src/assets/icons/execute.svg'
import PlusIcon from 'src/assets/icons/plus-icon.svg'
import CircleRedIcon from 'src/assets/icons/rejected.svg'
import { OwnerList, OwnerListItem } from '../../styled'

const StyledImg = styled(Img)`
  background-color: transparent;
  border-radius: 50%;
`

const Text = styled(AuraText)`
  margin-bottom: 6px;
`

export const TxOwners = ({ txDetails }: { txDetails: any }): ReactElement | null => {
  const confirmationsNeeded = txDetails.confirmationsRequired - txDetails.confirmations.length

  const CreationNode = (
    <OwnerListItem>
      <span className="icon">
        <img src={PlusIcon} alt="Aura Safe" />
      </span>
      <div className="legend">
        <Text color="linkAura" size="lg" strong>
          Created
        </Text>
      </div>
    </OwnerListItem>
  )

  return (
    <OwnerList>
      {CreationNode}
      {txDetails.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer.value}>
          <span className="icon">
            <img src={DoneIcon} alt="Aura Safe" />
          </span>
          <div className="legend">
            <Text color="linkAura" size="lg" strong>
              <span style={{ fontWeight: 700 }}>Confirmed</span>
            </Text>
            <AddressInfo
              address={signer.value}
              name={signer?.name || undefined}
              avatarUrl={signer?.logoUri || undefined}
              // shortenHash={4}
            />
          </div>
        </OwnerListItem>
      ))}
      {txDetails.rejectors?.map(({ value, name, logoUri }) => (
        <OwnerListItem key={value}>
          <span className="icon">
            <img src={CircleRedIcon} alt="Aura Safe" />
          </span>
          <div className="legend">
            <Text color="failAura" size="lg" strong>
              <span style={{ fontWeight: 700 }}>Rejected</span>
            </Text>
            <AddressInfo address={value} name={name || undefined} avatarUrl={logoUri || undefined} />
          </div>
        </OwnerListItem>
      ))}
      {txDetails.executor && (
        <OwnerListItem>
          <span className="icon">
            <img src={DoneIcon} alt="Aura Safe" />
          </span>
          <div className="legend">
            <Text color="linkAura" size="lg" strong>
              Executed
            </Text>
            <AddressInfo
              address={txDetails.executor.value}
              name={txDetails.executor?.name || undefined}
              avatarUrl={txDetails.executor?.logoUri || undefined}
            />
          </div>
        </OwnerListItem>
      )}
      {!txDetails.executor && confirmationsNeeded <= 0 && (
        <OwnerListItem className="isPending">
          <span className="icon">
            <StyledImg alt="" src={ExecuteIcon} />
          </span>
          <div className="legend">
            <Text color="linkAura" size="lg" strong>
              Execute
            </Text>
          </div>
        </OwnerListItem>
      )}
      {confirmationsNeeded > 0 && (
        <OwnerListItem className="isPending">
          <span className="icon">
            <StyledImg alt="" src={NotExecuteIcon} />
          </span>
          <div className="legend">
            <Text color="disableAura" size="lg" strong>
              <span style={{ fontWeight: 700 }}>
                Execute ({confirmationsNeeded} more {confirmationsNeeded === 1 ? 'confirmation' : 'confirmations'}{' '}
                needed)
              </span>
            </Text>
          </div>
        </OwnerListItem>
      )}
    </OwnerList>
  )
}
