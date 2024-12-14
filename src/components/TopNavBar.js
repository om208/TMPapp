'use client'

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Settings, BarChart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInSignUp } from './SignInSignUp';
import { SettingsModal } from './SettingsModal';
import { NotificationsModal } from './NotificationsModal';
import { AnalyticsModal } from './AnalyticsModal';
import { setUser, clearUser } from '../redux/actions/userActions';
import { BASE_DIRECTORY } from '../constants'

export function TopNavBar() {
  const [showSignInSignUp, setShowSignInSignUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
      fetchUserData();
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(clearUser());
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_DIRECTORY}api/user/${user.id}`);
      const userData = await response.json();
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
      {user ? (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setShowSignUp(true)}>
            <User className="h-6 w-6 mr-2" />
            <span>{user.name}</span>
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowSignUp(true)}>Sign In / Sign Up</Button>
      )}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowAnalytics(true)}>
          <BarChart className="h-5 w-5" />
        </Button>
      </div>
      {showSignInSignUp && <SignInSignUp onClose={() => setShowSignInSignUp(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
      {showSignUp && (
        <SignInSignUp
          onClose={() => setShowSignUp(false)}
          onSuccessfulLogin={(userData) => {
            dispatch(setUser(userData));
            setShowSignUp(false);
            fetchUserData();
          }}
        />
      )}
    </header>
  );
}

