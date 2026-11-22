// Duru Purcu - 2024502150
import { describe, it, expect } from 'vitest'
import { taskReducer, initialState, type State, type Task } from './taskReducer'
import { filterTasks, countByFilter } from './filter'

describe('taskReducer and filter helpers', () => {
  it('adds a new task with todo status and records previous tasks in past', () => {
    const next = taskReducer(initialState, { type: 'add', id: '1', title: 'Read chapter' })

    expect(next.tasks).toEqual([{ id: '1', title: 'Read chapter', status: 'todo' }])
    expect(next.past).toEqual([[]])
    expect(initialState.tasks).toEqual([])
  })

  it('advances status from todo -> in-progress -> done -> todo without mutating original state', () => {
    const start: State = {
      tasks: [{ id: '1', title: 'Task A', status: 'todo' }],
      filter: 'all',
      past: [],
    }

    const s1 = taskReducer(start, { type: 'advance', id: '1' })
    expect(s1.tasks[0].status).toBe('in-progress')
    expect(start.tasks[0].status).toBe('todo')

    const s2 = taskReducer(s1, { type: 'advance', id: '1' })
    expect(s2.tasks[0].status).toBe('done')

    const s3 = taskReducer(s2, { type: 'advance', id: '1' })
    expect(s3.tasks[0].status).toBe('todo')
  })

  it('removes a task by id and updates filter state', () => {
    const start: State = {
      tasks: [
        { id: '1', title: 'First', status: 'todo' },
        { id: '2', title: 'Second', status: 'done' },
      ],
      filter: 'all',
      past: [],
    }

    const afterRemove = taskReducer(start, { type: 'remove', id: '1' })
    expect(afterRemove.tasks).toEqual([{ id: '2', title: 'Second', status: 'done' }])

    const afterFilter = taskReducer(afterRemove, { type: 'setFilter', filter: 'done' })
    expect(afterFilter.filter).toBe('done')
    expect(afterFilter.tasks).toHaveLength(1)
  })

  it('clears completed tasks and supports undo without undoing filter changes', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Todo task', status: 'todo' },
      { id: '2', title: 'Done task', status: 'done' },
    ]
    const start: State = { tasks, filter: 'all', past: [] }

    const cleared = taskReducer(start, { type: 'clearDone' })
    expect(cleared.tasks).toEqual([{ id: '1', title: 'Todo task', status: 'todo' }])

    const undoneClear = taskReducer(cleared, { type: 'undo' })
    expect(undoneClear.tasks).toEqual(tasks)

    const filtered = taskReducer(undoneClear, { type: 'setFilter', filter: 'todo' })
    const undoneFilter = taskReducer(filtered, { type: 'undo' })
    expect(undoneFilter.filter).toBe('todo')
  })

  it('filters tasks and computes accurate counts across statuses', () => {
    const sample: Task[] = [
      { id: '1', title: 'A', status: 'todo' },
      { id: '2', title: 'B', status: 'in-progress' },
      { id: '3', title: 'C', status: 'done' },
      { id: '4', title: 'D', status: 'done' },
    ]

    expect(filterTasks(sample, 'all')).toHaveLength(4)
    expect(filterTasks(sample, 'todo')).toEqual([{ id: '1', title: 'A', status: 'todo' }])
    expect(filterTasks(sample, 'in-progress')).toEqual([
      { id: '2', title: 'B', status: 'in-progress' },
    ])
    expect(filterTasks(sample, 'done')).toHaveLength(2)

    expect(countByFilter(sample)).toEqual({
      all: 4,
      todo: 1,
      'in-progress': 1,
      done: 2,
    })
  })
})