import { useSelector } from 'react-redux'
import UserIcon from 'src/assets/icons/user.svg'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
export default function TxExecutionInfo({ required, submitted, rejected }) {
  const userWalletAddress = useSelector(userAccountSelector)

  return (
    <div className="tx-exe">
      <img src={UserIcon} alt="user-icon" />
      <p>{`${submitted.length} out of ${required} ${
        submitted.length >= required
          ? ''
          : submitted?.includes(userWalletAddress)
          ? '(Already confirmed)'
          : rejected?.includes(userWalletAddress)
          ? '(Already rejected)'
          : ''
      }`}</p>
    </div>
  )
}
