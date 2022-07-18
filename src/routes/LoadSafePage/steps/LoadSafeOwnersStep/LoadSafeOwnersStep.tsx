import { ReactElement } from 'react'
import { useForm } from 'react-final-form'
import TableContainer from '@material-ui/core/TableContainer'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import TextField from 'src/components/forms/TextField'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { minMaxLength } from 'src/components/forms/validator'
import { getExplorerInfo } from 'src/config'
import { FIELD_SAFE_OWNER_LIST } from '../../fields/loadFields'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { TitleContainer, HeaderContainer, OwnerContainer, OwnerAddressContainer, FieldContainer } from './styles'

export const loadSafeOwnersStepLabel = 'Owners'

function LoadSafeOwnersStep(): ReactElement {
  const loadSafeForm = useForm()
  const ownersWithName = loadSafeForm.getState().values[FIELD_SAFE_OWNER_LIST]

  return (
    <>
      <TitleContainer>
        <Paragraph color="primary" noMargin size="lg" data-testid="load-safe-owners-step">
          This Safe on <NetworkLabel /> has {ownersWithName.length} owners. Optional: Provide a name for each owner.
        </Paragraph>
      </TitleContainer>
      <Hairline />
      <TableContainer>
        <HeaderContainer>
          <Col xs={4}>NAME</Col>
          <Col xs={8}>ADDRESS</Col>
        </HeaderContainer>
        <Hairline />
        <Block margin="md" padding="md">
          {ownersWithName.map(({ address, name }, index) => {
            const ownerFieldName = `owner-address-${address}`
            return (
              <OwnerContainer key={address} data-testid="owner-row">
                <Col xs={4}>
                  <FieldContainer
                    component={TextField}
                    initialValue={name}
                    name={ownerFieldName}
                    placeholder="Owner Name"
                    text="Owner Name"
                    type="text"
                    validate={minMaxLength(0, 50)}
                    testId={`load-safe-owner-name-${index}`}
                  />
                </Col>
                <Col xs={8}>
                  <OwnerAddressContainer>
                    <PrefixedEthHashInfo hash={address} showAvatar showCopyBtn explorerUrl={getExplorerInfo(address)} />
                  </OwnerAddressContainer>
                </Col>
              </OwnerContainer>
            )
          })}
        </Block>
      </TableContainer>
    </>
  )
}

export default LoadSafeOwnersStep
