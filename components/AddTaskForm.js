import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BASE_DIRECTORY } from '../src/constants'

export function AddTaskForm({ onClose }) {
  const user = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    initial_deadline: '',
    deadline: 'today',
    estimated_time: '',
    priority: 'medium',
    Reminder_duration: '30',
    remainder_sound: 'bell1',
    status: 'pending',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const currentDate = new Date()
    let initialDeadline = new Date(currentDate)

    switch (formData.deadline) {
      case 'today':
        break
      case 'tomorrow':
        initialDeadline.setDate(currentDate.getDate() + 1)
        break
      case 'day_after_tomorrow':
        initialDeadline.setDate(currentDate.getDate() + 2)
        break
      case 'week':
        initialDeadline.setDate(currentDate.getDate() + 7)
        break
      default:
        break
    }

    const payload = {
      ...formData,
      user: user.id,
      initial_deadline: initialDeadline.toISOString(),
      deadline: initialDeadline.toISOString(),
      estimated_time: parseInt(formData.estimated_time),
      Reminder_duration: parseInt(formData.Reminder_duration),
      completed_on: null,
    }

    try {
      const response = await fetch(`${BASE_DIRECTORY}api/tasks/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const data = await response.json()
      console.log('Task added successfully:', data)
      onClose()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="deadline">Task Deadline</Label>
            <Select name="deadline" onValueChange={(value) => handleSelectChange('deadline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="day_after_tomorrow">Day After Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="estimated_time">Estimated Time (minutes)</Label>
            <Input
              id="estimated_time"
              name="estimated_time"
              type="number"
              value={formData.estimated_time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" onValueChange={(value) => handleSelectChange('priority', value)}>
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
              value={formData.Reminder_duration}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Reminder Sound</Label>
            <RadioGroup
              name="remainder_sound"
              value={formData.remainder_sound}
              onValueChange={(value) => handleSelectChange('remainder_sound', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bell1" id="bell1" />
                <Label htmlFor="bell1">Bell 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bell2" id="bell2" />
                <Label htmlFor="bell2">Bell 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bell3" id="bell3" />
                <Label htmlFor="bell3">Bell 3</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relax-tune" id="relax-tune" />
                <Label htmlFor="relax-tune">Relax Tune</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit">Save Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

