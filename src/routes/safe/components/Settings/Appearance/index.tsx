import FormGroup from '@material-ui/core/FormGroup/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import { ChangeEvent, ReactElement, useEffect } from 'react'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { setShowShortName } from 'src/logic/appearance/actions/setShowShortName'
import { setCopyShortName } from 'src/logic/appearance/actions/setCopyShortName'
import { extractSafeAddress } from 'src/routes/routes'
import { useAnalytics, SETTINGS_EVENTS } from 'src/utils/googleAnalytics'
import { Container, StyledPrefixedEthHashInfo } from './styles'
import { makeStyles } from '@material-ui/core'
import { styles } from './../style'
import { Checkbox } from '@aura/safe-react-components'
// Other settings sections use MUI createStyles .container
// will adjust that during dark mode implementation

const useStyles = makeStyles(styles)

const Appearance = (): ReactElement => {
  const dispatch = useDispatch()
  const copyShortName = useSelector(copyShortNameSelector)
  const showShortName = useSelector(showShortNameSelector)
  const safeAddress = extractSafeAddress()

  const classes = useStyles()

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent(SETTINGS_EVENTS.APPEARANCE)
  }, [trackEvent])

  const handleShowChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setShowShortName({ showShortName: checked }))

    const label = `${SETTINGS_EVENTS.APPEARANCE.label} (${checked ? 'Enable' : 'Disable'} EIP-3770 prefixes)`
    trackEvent({ ...SETTINGS_EVENTS.APPEARANCE, label })
  }
  const handleCopyChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    dispatch(setCopyShortName({ copyShortName: checked }))

  return (
    <Container>
      <Heading tag="h2">Use Chain-Specific Addresses</Heading>
      <Paragraph>You can choose whether to prepend EIP-3770 short chain names accross Safes.</Paragraph>
      <StyledPrefixedEthHashInfo hash={safeAddress} />
      <FormGroup>
        <FormControlLabel
          control={<Checkbox label checked={showShortName} onChange={handleShowChange} name="showShortName" />}
          label="Prepend addresses with chain prefix."
        />
        <FormControlLabel
          label="Copy addresses with chain prefix."
          control={<Checkbox label checked={copyShortName} onChange={handleCopyChange} name="copyShortName" />}
        />
      </FormGroup>
    </Container>
  )
}

export default Appearance
