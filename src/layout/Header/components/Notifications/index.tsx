import styled from 'styled-components'
import Bell from 'src/assets/icons/Bell.svg'
import Checks from 'src/assets/icons/Checks.svg'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Notification from './Notification'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import { getAllNotifications, markNotificationAsRead } from 'src/services'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { OutlinedNeutralButton } from 'src/components/Button'

const Wrap = styled.div`
  height: 100%;
  padding: 0px 25px;
  display: flex;
  border-left: 1px solid #3e3f40;
  position: relative;
  justify-content: center;
  align-items: center;

  > img {
    cursor: pointer;
  }
`
const NotiWrap = styled.div`
  width: 320px;
  position: absolute;
  background: #24262e;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.9);
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  &.show-all > .noti-wrapper {
    max-height: 650px;
  }
  > .noti-wrapper {
    overflow: auto;
  }
  .no-noti {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }
`
const Header = styled.div`
  padding: 18px 16px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    margin: 0;
  }
  .mark-all {
    display: flex;
    cursor: pointer;
    > img {
      margin-left: 6px;
    }
  }
`
const SeeAll = styled.div`
  padding: 18px 16px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export default function Notifications() {
  const { clickAway, open, toggle } = useStateHandler()
  const userWalletAddress = useSelector(userAccountSelector)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [allNotification, setAllNotification] = useState([])
  const [markedNoti, setMarkedNoti] = useState([])

  const [seeAll, setSeeAll] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    toggle()
  }
  const loadNotification = async () => {
    const res = await getAllNotifications()
    if (res.Data) {
      setAllNotification(res.Data)
    }
  }

  const markNotiAsRead = async () => {
    try {
      if (markedNoti.length == 0) return
      const res = await markNotificationAsRead(markedNoti)
      if (res.Data) {
        await loadNotification()
        setMarkedNoti([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const markAllAsRead = async () => {
    const allNoti = allNotification.filter((n: any) => n.status == 'UNREAD').map((n: any) => n.id)
    try {
      if (allNoti.length == 0) return
      const res = await markNotificationAsRead(allNoti)
      if (res.Data) {
        await loadNotification()
        setMarkedNoti([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadNotification()
    const win: any = window
    if (win?.notificationIntervalId) {
      clearInterval(win?.notificationIntervalId)
    }
    win.notificationIntervalId = setInterval(loadNotification, 30000)
    return () => clearInterval(win?.notificationIntervalId)
  }, [userWalletAddress])

  useEffect(() => {
    if (!open) {
      markNotiAsRead()
    }
  }, [open])
  return (
    <>
      <Wrap onClick={handleClick}>
        <img src={Bell} alt="" />
      </Wrap>
      {open && (
        <Popper
          anchorEl={anchorEl}
          open={open}
          placement="bottom"
          popperOptions={{ positionFixed: true }}
          style={{ zIndex: 1999 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                <NotiWrap className={seeAll ? 'show-all' : ''}>
                  <Header>
                    <p className="title">Notification</p>
                    <div className="mark-all" onClick={markAllAsRead}>
                      <p>Mark all read</p>
                      <img src={Checks} alt="" />
                    </div>
                  </Header>
                  <div className="noti-wrapper">
                    {allNotification.length == 0 ? (
                      <div className="no-noti">No notifications yet</div>
                    ) : seeAll ? (
                      allNotification.map((notification: any, index) => {
                        return (
                          <Notification
                            isUnread={
                              markedNoti.includes(notification.id as never) ? false : notification.status == 'UNREAD'
                            }
                            key={index}
                            toggle={toggle}
                            data={notification}
                            setMarkedNoti={setMarkedNoti}
                          />
                        )
                      })
                    ) : (
                      allNotification.slice(0, 5).map((notification: any, index) => {
                        return (
                          <Notification
                            isUnread={
                              markedNoti.includes(notification.id as never) ? false : notification.status == 'UNREAD'
                            }
                            key={index}
                            toggle={toggle}
                            data={notification}
                            setMarkedNoti={setMarkedNoti}
                          />
                        )
                      })
                    )}
                  </div>
                  {!seeAll && allNotification.length > 5 && (
                    <SeeAll>
                      <OutlinedNeutralButton onClick={() => setSeeAll(true)} className="small">
                        See all
                      </OutlinedNeutralButton>
                    </SeeAll>
                  )}
                </NotiWrap>
              </ClickAwayListener>
            </Grow>
          )}
        </Popper>
      )}
    </>
  )
}
