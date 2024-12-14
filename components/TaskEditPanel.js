'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X } from 'lucide-react'
import { BASE_DIRECTORY } from '../src/constants'

export function TaskEditPanel({ task, onClose, onUpdate }) {
  const [editedTask, setEditedTask] = useState(task)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedTask({ ...editedTask, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setEditedTask({ ...editedTask, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${BASE_DIRECTORY}api/tasks/edit/?userId=${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const data = await response.json()
      console.log('Task updated successfully:', data)
      onUpdate(editedTask)
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div className="w-96 bg-background border-l p-4 overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Edit Task</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={editedTask.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="deadline">Task Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="datetime-local"
            value={editedTask.deadline.slice(0, 16)}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="estimated_time">Estimated Time (minutes)</Label>
          <Input
            id="estimated_time"
            name="estimated_time"
            type="number"
            value={editedTask.estimated_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" value={editedTask.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="Reminder_duration">Reminder Interval (minutes)</Label>
          <Input
            id="Reminder_duration"
            name="Reminder_duration"
            type="number"
            value={editedTask.Reminder_duration}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Reminder Sound</Label>
          <RadioGroup
            name="remainder_sound"
            value={editedTask.remainder_sound}
            onValueChange={(value) => handleSelectChange('remainder_sound', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bell1" id="edit-bell1" />
              <Label htmlFor="edit-bell1">Bell 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bell2" id="edit-bell2" />
              <Label htmlFor="edit-bell2">Bell 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bell3" id="edit-bell3" />
              <Label htmlFor="edit-bell3">Bell 3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relax-tune" id="edit-relax-tune" />
              <Label htmlFor="edit-relax-tune">Relax Tune</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" value={editedTask.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" onClick={handleSubmit}>Save Changes</Button>
      </form>
    </div>
  )
}

