import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, ShoppingCart } from 'lucide-react';
import styles from './notification.module.css';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: 'IN_APP' | 'EMAIL';
  status: 'PENDING' | 'SENT' | 'READ' | 'FAILED';
  created_at: string;
  metadata_?: Record<string, any>;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('bes_token');
    if (!token) return;

    try {
      const res = await fetch('/api/v1/notifications?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        const items = json.data || [];
        setNotifications(items);
        
        // Count unread
        const unread = items.filter((n: NotificationItem) => n.status !== 'READ').length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // Connect to SSE stream
  const connectSSE = useCallback(() => {
    const token = localStorage.getItem('bes_token');
    if (!token) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Pass token via query param (backend get_current_user parses oauth2)
    // Wait, let's verify if oauth2_scheme handles query parameter.
    // If backend only reads Authorization header, we can use our robust fetch stream
    // but wait! Since we want to ensure full compatibility with the backend's get_current_user,
    // let's check if the backend get_current_user fails on EventSource query parameter.
    // Let's use the query parameter path first. Wait, does oauth2_scheme support query parameter?
    // FastAPI's standard OAuth2PasswordBearer does NOT support query parameter token by default.
    // Let's implement the robust fetch-based EventSource consumer instead to guarantee
    // it will pass authorization header and won't get 401 on standard OAuth2 endpoints.
    // Let's write an async function that reads using fetch/ReadableStream.
    
    let isMounted = true;
    const controller = new AbortController();

    async function startStream() {
      while (isMounted) {
        try {
          const currentToken = localStorage.getItem('bes_token');
          if (!currentToken) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }

          const res = await fetch('/api/v1/notifications/stream', {
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${currentToken}`
            }
          });

          if (!res.ok) {
            throw new Error(`SSE HTTP error: ${res.status}`);
          }

          setIsConnected(true);
          const reader = res.body?.getReader();
          if (!reader) {
            throw new Error('ReadableStream not supported on response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (isMounted) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const dataStr = line.substring(6).trim();
                  if (dataStr) {
                    const eventData = JSON.parse(dataStr);
                    
                    // Skip keepalives and connections
                    if (eventData.status === 'connected') continue;

                    // It's a new notification!
                    const newNotif: NotificationItem = eventData;
                    
                    setNotifications(prev => {
                      // Prevent duplicate entries
                      if (prev.some(n => n.id === newNotif.id)) return prev;
                      return [newNotif, ...prev].slice(0, 50);
                    });

                    if (newNotif.status !== 'READ') {
                      setUnreadCount(c => c + 1);
                      // Trigger shake animation
                      setShake(true);
                    }
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        } catch (err: any) {
          if (err.name === 'AbortError') break;
          setIsConnected(false);
          // Wait 5 seconds before reconnecting
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    startStream();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    const disconnect = connectSSE();

    return () => {
      if (disconnect) disconnect();
    };
  }, [fetchNotifications, connectSSE]);

  // Turn off shake animation after it completes
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shake]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Re-fetch notifications when opening to ensure synced state
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('bes_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, status: 'READ' as const } : n))
        );
        setUnreadCount(c => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('bes_token');
    if (!token) return;

    try {
      const res = await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, status: 'READ' as const }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 6000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('order') || t.includes('sales')) {
      return <ShoppingCart size={16} color="var(--ui-primary)" />;
    }
    if (t.includes('alert') || t.includes('warning') || t.includes('error')) {
      return <AlertTriangle size={16} color="var(--ui-error)" />;
    }
    if (t.includes('success') || t.includes('approve')) {
      return <Check size={16} color="var(--ui-success)" />;
    }
    return <Info size={16} color="var(--ui-info)" />;
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    if (item.status !== 'READ') {
      const fakeEvent = { stopPropagation: () => { /* no-op */ } } as React.MouseEvent;
      handleMarkAsRead(item.id, fakeEvent);
    }

    // Redirect if there is a target URL in metadata
    if (item.metadata_?.url) {
      window.location.href = item.metadata_.url;
    }
  };

  return (
    <div className={styles.bellContainer} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`${styles.bellButton} ${isOpen ? styles.bellButtonActive : ''} ${shake ? styles.shake : ''}`}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className={styles.markAllBtn}>
                Mark all as read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <Bell size={32} />
                <p>All caught up!</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--ui-gray-400)' }}>
                  No new notifications.
                </span>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`${styles.item} ${item.status !== 'READ' ? styles.unreadItem : ''}`}
                >
                  {item.status !== 'READ' && <div className={styles.unreadDot} />}
                  <div className={styles.iconWrapper}>
                    {getIcon(item.title)}
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <p className={styles.itemBody}>{item.body}</p>
                    <span className={styles.itemTime}>{formatTime(item.created_at)}</span>
                  </div>
                  {item.status !== 'READ' && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ui-gray-400)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: 'var(--ui-radius-sm)',
                        alignSelf: 'flex-start'
                      }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className={styles.footer}>
            <span 
              onClick={() => {
                setIsOpen(false);
                // Trigger navigation to settings or general notifications view
                window.location.hash = '#/settings?tab=Notifications';
              }} 
              className={styles.footerLink}
            >
              Configure Notification Rules
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
