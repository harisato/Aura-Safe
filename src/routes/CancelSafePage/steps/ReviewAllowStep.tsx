import { Fragment, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-final-form'
import TableContainer from '@material-ui/core/TableContainer'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import { border, lg, sm, xs } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getExplorerInfo } from 'src/config'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import Hairline from 'src/components/layout/Hairline'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import {
  FIELD_ALLOW_SAFE_ADDRESS,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
  LoadSafeFormValues,
  OwnerFieldListItem,
} from '../fields/loadFields'
import { getLoadSafeName } from '../fields/utils'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'

export const reviewLoadStepLabel = 'Review'

function ReviewAllowStep(): ReactElement {
  const loadSafeForm = useForm()
  const userAddress = useSelector(userAccountSelector)
  const addressBook = useSelector(currentNetworkAddressBookAsMap)

  const formValues = loadSafeForm.getState().values as LoadSafeFormValues
  // const formValues: LoadSafeFormValues= JSON.parse(`{
  //   "suggestedSafeName": "astonishing-rinkeby-safe",
  //   "safeAddress": "0x7e2fE2302d6c02cc2d900cEc29B8f45F30a9369a",
  //   "isLoadingSafeAddress": false,
  //   "safeOwnerList": [
  //       {
  //           "address": "0x8Aaec6068610E46Ae770da1bb5E18F80d1701985",
  //           "name": "",
  //           "chainId": "4"
  //       },
  //       {
  //           "address": "0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212",
  //           "name": "",
  //           "chainId": "4"
  //       }
  //   ],
  //   "safeThreshold": 2,
  //   "owner-address-0x8Aaec6068610E46Ae770da1bb5E18F80d1701985": "",
  //   "owner-address-0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212": ""
  // }`)

  const safeName = getLoadSafeName(formValues, addressBook)

  console.log('formValues', formValues)

  const safeAddress = formValues[FIELD_ALLOW_SAFE_ADDRESS] || ''
  const threshold = formValues[FIELD_SAFE_THRESHOLD]
  const ownerList = formValues[FIELD_SAFE_OWNER_LIST] || []

  const ownerListWithNames = ownerList?.map((owner) => {
    const ownerFieldName = `owner-address-${owner.address}`
    const ownerNameValue = formValues[ownerFieldName]
    return {
      ...owner,
      name: ownerNameValue,
    }
  })

  const isUserConnectedWalletASAfeOwner =
    !!ownerList && !!userAddress ? checkIfUserAddressIsAnOwner(ownerList, userAddress) : null

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
          {safeAddress ? (
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Safe address
              </Paragraph>
              <SafeAddressContainer>
                <PrefixedEthHashInfo
                  hash={safeAddress}
                  shortenHash={4}
                  showAvatar
                  showCopyBtn
                  explorerUrl={getExplorerInfo(safeAddress)}
                />
              </SafeAddressContainer>
            </Block>
          ) : null}
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Connected wallet client is owner?
            </Paragraph>
            <Paragraph data-testid={'connected-wallet-is-owner'} color="primary" noMargin size="lg" weight="bolder">
              {isUserConnectedWalletASAfeOwner ? 'Yes' : 'No (read-only)'}
            </Paragraph>
          </Block>
          {ownerList ? (
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph color="primary" noMargin size="lg" weight="bolder">
                {`${threshold} out of ${ownerList.length} owners`}
              </Paragraph>
            </Block>
          ) : null}
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
          {ownerListWithNames
            ? ownerListWithNames.map((owner, index) => (
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
              ))
            : null}
        </TableContainer>
      </Col>
    </Row>
  )
}

export default ReviewAllowStep

function checkIfUserAddressIsAnOwner(owners: OwnerFieldListItem[], userAddress: string) {
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

const SafeAddressContainer = styled(Row)`
  margin-top: ${xs};
  align-items: center;
`
const StyledParagraph = styled(Paragraph)`
  margin-top: 4px;
`
