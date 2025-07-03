import type { Snowflake } from '@sapphire/snowflake'
import type User from './User'

export default interface Card {
  id: Snowflake
  assignees: User[]
  dateCreated: EpochTimeStamp
  dateDeadline: EpochTimeStamp
  taskName: string
  taskDescription: string
}
