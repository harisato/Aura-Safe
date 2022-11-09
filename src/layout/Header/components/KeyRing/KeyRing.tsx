import { makeStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import KeyIcon from '../../assets/key.svg'
import TriangleIcon from '../../assets/triangle.svg'
import { styles, buildKeyStyleFrom, buildDotStyleFrom } from './styles'

const useStyles = makeStyles(styles)

type Props = {
  center?: boolean
  circleSize?: number
  dotRight?: number
  dotSize?: number
  dotTop?: number
  hideDot?: boolean
  keySize: number
  mode?: string
}

export const KeyRing = ({
  center = false,
  circleSize,
  dotRight,
  dotSize,
  dotTop,
  hideDot = false,
  keySize,
  mode,
}: Props): ReactElement => {
  const classes = useStyles(styles)
  const keyStyle = buildKeyStyleFrom(circleSize, center, dotSize)
  const dotStyle = buildDotStyleFrom(dotSize, dotTop, dotRight, mode)
  const isWarning = mode === 'warning'
  const img = isWarning ? TriangleIcon : KeyIcon

  return (
    <>
      <Block className={classes.root}>
        <Block className={classes.key} style={keyStyle}>
          <Img
            alt="Status connection"
            className={isWarning ? classes.warning : undefined}
            height={keySize}
            src={img}
            width={isWarning ? keySize + 2 : keySize}
          />
        </Block>
        {!hideDot && <Dot className={classes.dot} style={dotStyle} />}
      </Block>
    </>
  )
}
