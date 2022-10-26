import { ReactNode } from 'react'
import { Popup } from '.'
export default function WarningPopup({ children }: { children: ReactNode }) {
  return (
    <Popup title="warning-popup" open={true} handleClose={() => {}}>
      {children}
    </Popup>
  )
}
