'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, CheckSquare, Clock, List, PlusCircle } from 'lucide-react'
import { AddTaskForm } from './AddTaskForm'

const categories = [
  { name: 'Today', icon: <Clock className="h-5 w-5" /> },
  { name: 'Tomorrow', icon: <Calendar className="h-5 w-5" /> },
  { name: 'This Week', icon: <List className="h-5 w-5" /> },
  { name: 'This Month', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Completed', icon: <CheckSquare className="h-5 w-5" /> },
  { name: 'All Tasks', icon: <List className="h-5 w-5" /> },
]

export function LeftSidePanel({ onCategorySelect = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('Today')
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    onCategorySelect(category)
  }

  return (
    <nav className="w-64 bg-background border-r p-4 space-y-4">
      <Button className="w-full" variant="outline" onClick={() => setShowAddTaskForm(true)}>
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Task
      </Button>
      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </Button>
        ))}
      </div>
      {showAddTaskForm && (
        <AddTaskForm onClose={() => setShowAddTaskForm(false)} />
      )}
    </nav>
  )
}

