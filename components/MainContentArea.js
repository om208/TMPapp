'use client'

import React, { useState, useEffect } from 'react'
import { TaskList } from './TaskList'
import { TaskEditPanel } from './TaskEditPanel'
import { BASE_DIRECTORY } from '../src/constants'
import { useSelector } from 'react-redux'

export function MainContentArea({ selectedCategory }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user && user.id) {
      fetchTasks()
    }
  }, [user, selectedCategory])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BASE_DIRECTORY}api/tasks/?userId=${user.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      console.log("Fetched tasks:", data.tasks)
      console.log("Selected category:", selectedCategory)
      const filteredTasks = filterTasks(data.tasks, selectedCategory)
      console.log("Filtered tasks:", filteredTasks)
      setTasks(filteredTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const filterTasks = (tasks, category) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const monthEnd = new Date(today)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    return tasks.filter(task => {
      const taskDate = new Date(task.deadline)
      switch (category) {
        case 'Today':
          return taskDate.toDateString() === today.toDateString()
        case 'Tomorrow':
          return taskDate.toDateString() === tomorrow.toDateString()
        case 'This Week':
          return taskDate >= today && taskDate <= weekEnd
        case 'This Month':
          return taskDate >= today && taskDate <= monthEnd
        case 'Completed':
          return task.status === 'done'
        case 'All Tasks':
          return true
        default:
          return true
      }
    })
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    setSelectedTask(null)
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
        <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
      </div>
      {selectedTask && (
        <TaskEditPanel task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={handleTaskUpdate} />
      )}
    </div>
  )
}

