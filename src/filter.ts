// Requirement R4: write these two pure functions. No React in this file.
import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status

export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

/** Return the tasks to show for the chosen filter. 'all' returns every task. */
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'all') return tasks
  return tasks.filter((task) => task.status === filter)
}

/** Return how many tasks each filter button would show, for example { all: 3, ... }. */
export function countByFilter(tasks: Task[]): Record<Filter, number> {
  return {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }
}