import type User from './User'

export default interface Card {
  id: number
  assignees: User[]
  dateCreated: number
  dateDeadline: number | null
  dateCompleted: number | null
  taskName: string
  taskDescription: string
}
