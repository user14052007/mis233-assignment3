// STARTING POINT: the sample Task Manager (state in App with useReducer, passed down as props).
// Assignment 3: change the state shape, add actions, add a filter bar (see the handout).
import { useReducer, type Dispatch } from 'react'
import { taskReducer, initialState, type Task, type Action } from './taskReducer'
import { filterTasks, countByFilter, type Filter } from './filter'
import TaskRow from './TaskRow'

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

function FilterBar({
  activeFilter,
  counts,
  dispatch,
}: {
  activeFilter: Filter
  counts: Record<Filter, number>
  dispatch: Dispatch<Action>
}) {
  return (
    <div role="group" aria-label="Task filters">
      {FILTER_LABELS.map(({ value, label }) => {
        const isActive = activeFilter === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => dispatch({ type: 'setFilter', filter: value })}
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            }}
          >
            {label} ({counts[value]})
          </button>
        )
      })}
    </div>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) {
    return <p>No tasks here.</p>
  }
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const visibleTasks = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)

  return (
    <main>
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />
      <FilterBar activeFilter={state.filter} counts={counts} dispatch={dispatch} />
      <button type="button" onClick={() => dispatch({ type: 'clearDone' })}>
        Clear done
      </button>
      <button
        type="button"
        disabled={state.past.length === 0}
        onClick={() => dispatch({ type: 'undo' })}
      >
        Undo
      </button>
      <TaskList tasks={visibleTasks} dispatch={dispatch} />
    </main>
  )
}