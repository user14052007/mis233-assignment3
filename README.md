# Task Manager — MIS 233 Assignment 3

- **Student:** Duru Purcu (2024502150)

## Reducer & State Architecture Explanation

This application manages task state through a centralized `taskReducer` function paired with React's `useReducer` hook in TypeScript. The state holds a `tasks` array (`Task[]`), the active `filter` (`'all' | 'todo' | 'in-progress' | 'done'`), and a `past` history stack (`Task[][]`) used to support undo operations.

Actions are modeled as a discriminated union (`add`, `advance`, `remove`, `setFilter`, `clearDone`, and `undo`). Because each action has a distinct `type` literal and tailored payload, TypeScript narrows action fields safely inside the `switch` statement, while a `default` branch calling `assertNever` enforces exhaustive handling of every action variant at compile time.

Every state transition in `taskReducer` is pure and immutable. Rather than mutating existing arrays or task objects in place, updates return fresh state objects using array spread syntax, `.map()`, and `.filter()`. Status transitions (`todo` -> `in-progress` -> `done` -> `todo`) are driven by a lookup map (`NEXT`), keeping progression deterministic and easy to read.

Task filtering (`filterTasks`) and status counters (`countByFilter`) are kept separate as pure derived helpers so `App.tsx` computes visible items and tab counts cleanly from `state.tasks` without duplicating logic. For the Undo bonus feature, task-modifying actions (`add`, `advance`, `remove`, `clearDone`) push the prior `state.tasks` snapshot onto `state.past`, while `setFilter` only updates the view filter and is not pushed to history. Dispatching `undo` pops the latest snapshot back into `tasks` when `past` is non-empty, and the UI disables the Undo button whenever `state.past.length === 0`.
## Scripts & Verification

- Build & type-check: `npm run build`
- Unit tests: `npx vitest run`