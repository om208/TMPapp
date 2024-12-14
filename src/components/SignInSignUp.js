'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { setUser } from '../redux/actions/userActions';
import { BASE_DIRECTORY } from '../constants';

export function SignInSignUp({ onClose, onSuccessfulLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const dispatch = useDispatch();
  const [user, setUserState] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignUp ? 'api/auth/signup/' : 'api/auth/login/';
    const body = isSignUp
      ? { email, password, confirm_password: confirmPassword }
      : { email, password };
    console.log("body param", body);
    console.log("API", BASE_DIRECTORY + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    try {
      const response = await fetch(BASE_DIRECTORY + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
        console.log('Response text:', data);
        throw new Error('Unexpected response format');
      }

      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!isSignUp) {
        dispatch(setUser(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));
        onSuccessfulLogin(data.user);
        setUserState(data.user);
        setShowProfile(true);
      } else {
        setIsSignUp(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleOAuth = async (provider) => {
    // Implement OAuth logic here
    console.log(`Signing in with ${provider}`);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
            <DialogDescription>
              {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4">
            <Button onClick={() => handleOAuth('Google')} className="w-full mb-2">
              Sign in with Google
            </Button>
            <Button onClick={() => handleOAuth('GitHub')} className="w-full">
              Sign in with GitHub
            </Button>
          </div>
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Create New Account'}
          </Button>
        </DialogContent>
      </Dialog>

      {showProfile && (
        <Dialog open={showProfile} onOpenChange={() => setShowProfile(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {user && <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

