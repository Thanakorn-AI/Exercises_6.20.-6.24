// src/components/Notification.jsx
import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null
  return <div style={{ border: '1px solid black', padding: '10px', color: 'green' }}>{notification}</div>
}

export default Notification