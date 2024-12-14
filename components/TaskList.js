import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Play, Clock } from 'lucide-react'

export function TaskList({ tasks, onSelectTask }) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
          <Checkbox
            checked={task.status === 'done'}
            onCheckedChange={() => {/* Implement status change logic */}}
          />
          <span className={task.status === 'done' ? 'line-through' : ''}>{task.title}</span>
          <span className="ml-auto flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(task.deadline).toLocaleDateString()}
          </span>
          <Button size="sm" variant="ghost" onClick={() => onSelectTask(task)}>
            <Play className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

