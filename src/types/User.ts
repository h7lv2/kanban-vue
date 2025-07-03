import type { Snowflake } from '@sapphire/snowflake'

export default interface User {
  id: Snowflake
  userName: string
  displayName: string | null
}
