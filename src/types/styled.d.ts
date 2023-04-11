import { pyxisTheme } from 'src/theme/styledComponentsTheme'
import 'styled-components'

type CustomTheme = typeof pyxisTheme

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {}
}
