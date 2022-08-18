import TableContainer from '@material-ui/core/TableContainer'
import { Fragment, ReactElement } from 'react'
import { useForm } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { border, lg, sm } from 'src/theme/variables'
import { AllowSafeFormValues, FIELD_SAFE_OWNER_LIST, FIELD_SAFE_THRESHOLD } from '../fields/allowFields'
import { getLoadSafeName } from '../fields/utils'

export const reviewLoadStepLabel = 'Review'

const ReviewAllowStep = (): ReactElement => {
  const userAddress = useSelector(userAccountSelector)
  const addressBook = useSelector(currentNetworkAddressBookAsMap)

  const loadSafeForm = useForm()
  const formValues = loadSafeForm.getState().values as AllowSafeFormValues

  const safeName = getLoadSafeName(formValues, addressBook)
  // const safeAddress = formValues.
  const threshold = formValues[FIELD_SAFE_THRESHOLD]
  const ownerList = formValues[FIELD_SAFE_OWNER_LIST]

  const ownerListWithNames = ownerList?.map((owner) => {
    const ownerFieldName = `owner-address-${owner.address}`
    const ownerNameValue = formValues[ownerFieldName]
    return {
      ...owner,
      name: ownerNameValue,
    }
  })

  const isUserConnectedWalletASAfeOwner = checkIfUserAddressIsAnOwner(ownerList, userAddress)

  return (
    <Row data-testid={'load-safe-review-step'}>
      <Col layout="column" xs={4}>
        <DetailsContainer>
          <Block margin="lg">
            <Paragraph color="primary" noMargin size="lg" data-testid="load-safe-step-three">
              Review details
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Network
            </Paragraph>
            <StyledParagraph color="disabled" noMargin size="sm" data-testid="load-form-review-safe-network">
              <NetworkLabel />
            </StyledParagraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Name of the Safe
            </Paragraph>
            <Paragraph color="primary" noMargin size="lg" weight="bolder" data-testid="load-form-review-safe-name">
              {safeName}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Connected wallet client is owner?
            </Paragraph>
            <Paragraph data-testid={'connected-wallet-is-owner'} color="primary" noMargin size="lg" weight="bolder">
              {isUserConnectedWalletASAfeOwner ? 'Yes' : 'No (read-only)'}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Any transaction requires the confirmation of:
            </Paragraph>
            <Paragraph color="primary" noMargin size="lg" weight="bolder">
              {`${threshold} out of ${ownerList.length} owners`}
            </Paragraph>
          </Block>
        </DetailsContainer>
      </Col>
      <Col layout="column" xs={8}>
        <TableContainer>
          <OwnersContainer>
            <Paragraph color="primary" noMargin size="lg">
              {`${ownerList.length} Safe owners`}
            </Paragraph>
          </OwnersContainer>
          <Hairline />
          {ownerListWithNames.map((owner, index) => (
            <Fragment key={owner.address}>
              <OwnerItemContainer testId={'load-safe-review-owner-name-' + index}>
                <Col align="center" xs={12}>
                  <PrefixedEthHashInfo
                    hash={owner.address}
                    name={owner.name}
                    showAvatar
                    showCopyBtn
                    explorerUrl={getExplorerInfo(owner.address)}
                  />
                </Col>
              </OwnerItemContainer>
              {index !== ownerList.length - 1 && <Hairline />}
            </Fragment>
          ))}
        </TableContainer>
      </Col>
    </Row>
  )
}

export default ReviewAllowStep

function checkIfUserAddressIsAnOwner(owners, userAddress) {
  return owners.some((owner) => owner.address === userAddress)
}

const DetailsContainer = styled(Block)`
  padding: ${lg};
  border-right: solid 1px ${border};
  height: 100%;
`

const OwnersContainer = styled(Block)`
  padding: ${lg};
`

const OwnerItemContainer = styled(Row)`
  align-items: center;
  min-width: fit-content;
  padding: ${sm};
  padding-left: ${lg};
`

const StyledParagraph = styled(Paragraph)`
  margin-top: 4px;
`
