import { Loader } from '@aura/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement, Suspense, useEffect, useState } from 'react'

const useStyles = makeStyles({
  loaderStyle: {
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type Props = {
  children: ReactElement
}

const SuspenseContainer = ({ children }: Props): React.ReactElement => {
  const classes = useStyles()

  return (
    <Suspense
      fallback={
        <div className={classes.loaderStyle}>
          <Loader size="md" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default SuspenseContainer
