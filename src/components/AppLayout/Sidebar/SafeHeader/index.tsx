import { useSelector } from 'react-redux'
import { Icon, FixedIcon, Text, Identicon, CopyToClipboardBtn, ExplorerButton } from '@gnosis.pm/safe-react-components'
import ButtonHelper from 'src/components/ButtonHelper'
import FlexSpacer from 'src/components/FlexSpacer'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { copyShortNameSelector } from 'src/logic/appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'
import { Props } from './type'
export const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'
import {
  Container,
  IdenticonContainer,
  StyledIcon,
  IconContainer,
  StyledButton,
  StyledTextLabel,
  StyledTextSafeName,
  StyledPrefixedEthHashInfo,
  StyledLabel,
  StyledText,
  StyledDotChainName,
} from './styles'

const SafeHeader = ({
  address,
  safeName,
  balance,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
}: Props): React.ReactElement => {
  const copyChainPrefix = useSelector(copyShortNameSelector)
  const chainInfoShortName = getChainInfo().shortName
  const shortName = extractShortChainName()

  if (!address) {
    return (
      <Container>
        <IdenticonContainer>
          <FlexSpacer />
          <FixedIcon type="notConnected" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <StyledIcon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>
      </Container>
    )
  }
  const chainInfo = getChainInfo()

  return (
    <>
      {/* Network */}
      <StyledTextLabel size="lg" chainInfo={chainInfo}>
        <StyledDotChainName />
        {chainInfo.chainName}
      </StyledTextLabel>
      <Container>
        {/* Identicon */}
        <IdenticonContainer>
          <FlexSpacer />
          <Identicon address={address} size="lg" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <StyledIcon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>

        {/* SafeInfo */}
        <StyledTextSafeName size="lg" center>
          {safeName}
        </StyledTextSafeName>
        <StyledPrefixedEthHashInfo hash={address} shortenHash={4} textSize="sm" />
        <IconContainer>
          <ButtonHelper onClick={onReceiveClick}>
            <Icon size="sm" type="qrCode" tooltip="Show QR" />
          </ButtonHelper>
          <CopyToClipboardBtn textToCopy={copyChainPrefix ? `${chainInfoShortName}:${address}` : `${address}`} />
          <ExplorerButton explorerUrl={getExplorerInfo(address)} />
        </IconContainer>

        {!granted && (
          <StyledLabel>
            <Text size="sm" color="white">
              READ ONLY
            </Text>
          </StyledLabel>
        )}

        <StyledText size="xl">{/* balance */}</StyledText>
        <StyledButton size="md" disabled={!granted} color="primary" onClick={onNewTransactionClick}>
          <FixedIcon type="arrowSentWhite" />
          <Text size="xl" color="white">
            Send funds
          </Text>
        </StyledButton>
      </Container>
    </>
  )
}

export default SafeHeader
