import { useState, useMemo } from 'react'

type ConnectWalletState = {
  showConnect: boolean
}

const INITIAL_STATE: ConnectWalletState = {
  showConnect: false,
}

type Response = {
  onConnectWalletShow: () => void
  onConnectWalletHide: () => void
  connectWalletState: ConnectWalletState
}

const useConnectWallet = (): Response => {
  const [connectWalletState, setConnectWalletState] = useState(INITIAL_STATE)

  const onConnectWalletShow = useMemo(
    () => () => {
      setConnectWalletState((prevState) => ({
        ...prevState,
        showConnect: true,
      }))
    },
    [],
  )

  const onConnectWalletHide = useMemo(
    () => () => {
      setConnectWalletState((prevState) => ({
        ...prevState,
        showConnect: false,
      }))
    },
    [],
  )

  return { connectWalletState, onConnectWalletShow, onConnectWalletHide }
}

export default useConnectWallet
