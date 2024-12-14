'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BASE_DIRECTORY } from '../constants';

export function NotificationsModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASE_DIRECTORY}api/notifications/?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
        // Optionally, show an error message to the user
      }
    };

    if (user && user.id) {
      fetchNotifications();
    }
  }, [user]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            View your recent notifications and updates
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="p-2 bg-secondary rounded">
              {notification.message}
            </div>
          ))}
          {notifications.length === 0 && <p>No notifications</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

