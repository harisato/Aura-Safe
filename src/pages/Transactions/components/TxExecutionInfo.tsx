import UserIcon from 'src/assets/icons/user.svg'
export default function TxExecutionInfo({ required = 0, submitted = 0 }) {
  return (
    <div className="tx-exe">
      <img src={UserIcon} alt="user-icon" />
      <p>{`${submitted} out of ${required}`}</p>
    </div>
  )
}
