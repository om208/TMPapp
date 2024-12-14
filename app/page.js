'use client'

import React, { useState } from 'react';
import { TopNavBar } from '../src/components/TopNavBar';
import { LeftSidePanel } from '../components/LeftSidePanel';
import { MainContentArea } from '../components/MainContentArea';
import { BottomBar } from '../components/BottomBar';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Today');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidePanel onCategorySelect={handleCategorySelect} />
        <MainContentArea selectedCategory={selectedCategory} />
      </div>
      <BottomBar />
    </div>
  );
}

