// src/components/Notification.jsx
import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null

  const isError = notification.toLowerCase().includes('error')
  const style = {
    border: '1px solid',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: isError ? 'red' : 'green'
  }

  return <div style={style}>{notification}</div>
}

export default Notification