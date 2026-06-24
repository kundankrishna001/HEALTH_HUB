import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { buildNotifications } from '../../utils/notifications';

export default function NotificationsPanel() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const notifications = useMemo(() => buildNotifications(state), [state]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="notifications-wrap" ref={rootRef}>
      <button
        className="icon-pill"
        aria-label="Notifications"
        style={{ flexShrink: 0, position: 'relative' }}
        onClick={() => setOpen((value) => !value)}
      >
        <FiBell />
        {notifications.some((item) => item.tone === 'warning') ? <span className="notification-dot" /> : null}
      </button>
      {open ? (
        <div className="notifications-panel">
          <div className="notifications-panel-head">
            <strong>Reminders</strong>
            <span className="muted">{notifications.length} active</span>
          </div>
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`notification-item tone-${item.tone}`}
              onClick={() => {
                navigate(item.to);
                setOpen(false);
              }}
            >
              <strong>{item.title}</strong>
              <span className="muted">{item.message}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
