import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { addDecorator } from '@storybook/react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@aura/safe-react-components'

import { aNewStore } from 'src/store'

const GlobalStyles = createGlobalStyle`

`

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <GlobalStyles />
      <Provider store={aNewStore()}>
        {storyFn()}
      </Provider>
    </MemoryRouter>
  </ThemeProvider>
))
