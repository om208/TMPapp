'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BASE_DIRECTORY } from '../constants';

export function AnalyticsModal({ onClose }) {
  const [analyticsData, setAnalyticsData] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${BASE_DIRECTORY}api/analytics/?userId=${user.id}`);
        const data = await response.json();
        setAnalyticsData(data.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Analytics</DialogTitle>
          <DialogDescription>
            View your task completion analytics and progress
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <LineChart width={700} height={300} data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completionRate" stroke="#8884d8" name="Completion Rate" />
            <Line type="monotone" dataKey="idealRate" stroke="#82ca9d" name="Ideal Rate" />
          </LineChart>
        </div>
      </DialogContent>
    </Dialog>
  );
}

