import IconButton from '@material-ui/core/IconButton'
import { Icon } from '@gnosis.pm/safe-react-components'
import { StyledParagraph, IconImg, TitleWrapper, StyledRow, StyledClose, GoBackWrapper } from './styles'

type Props = {
  title: string
  goBack?: () => void
  iconUrl?: string
  onClose?: () => void
}

const ModalTitle = ({ goBack, iconUrl, title, onClose }: Props): React.ReactElement => {
  return (
    <StyledRow align="center" grow>
      <TitleWrapper>
        {goBack && (
          <GoBackWrapper>
            <IconButton onClick={goBack}>
              <Icon type="arrowLeft" size="md" />
            </IconButton>
          </GoBackWrapper>
        )}
        {iconUrl && <IconImg alt={title} src={iconUrl} />}
        <StyledParagraph noMargin weight="bolder" title={title}>
          {title}
        </StyledParagraph>
      </TitleWrapper>
      <IconButton disableRipple onClick={onClose}>
        <StyledClose />
      </IconButton>
    </StyledRow>
  )
}

export default ModalTitle
