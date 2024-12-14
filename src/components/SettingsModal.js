'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { BASE_DIRECTORY } from '../constants';

const ALARM_TUNES = ['Bell1', 'Bell2', 'Bell3', 'relax-tune'];

export function SettingsModal({ onClose }) {
  const [goal, setGoal] = useState('');
  const [alarmTune, setAlarmTune] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${BASE_DIRECTORY}api/settings/?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setGoal(data.goal);
        setAlarmTune(data.alarm_tune);
        setProgressStatus(data.progress_status);
        setSuggestion(data.suggestion);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Set default values or show an error message to the user
        setGoal('');
        setAlarmTune('Bell1');
        setProgressStatus('Unable to fetch progress');
        setSuggestion('Unable to fetch suggestion');
      }
    };

    if (user && user.id) {
      fetchSettings();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(BASE_DIRECTORY + 'api/settings/update/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          goal,
          alarm_tune: alarmTune,
        }),
      });
      if (response.ok) {
        onClose();
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your app settings and preferences
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goal">Ultimate Goal (optional)</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div>
            <Label>Alarm Tune</Label>
            <RadioGroup value={alarmTune} onValueChange={setAlarmTune}>
              {ALARM_TUNES.map((tune) => (
                <div key={tune} className="flex items-center space-x-2">
                  <RadioGroupItem value={tune} id={tune} />
                  <Label htmlFor={tune}>{tune}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Progress Status</Label>
            <p>{progressStatus}</p>
          </div>
          <div>
            <Label>Suggestion</Label>
            <p>{suggestion}</p>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

