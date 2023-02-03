export type EventFields = {
  from: Date
  till: Date
  title: string
  description?: string
}

export type FindOneEventDto = { where: { user_id: number, id: number } }
export type CreateEventDto = { where: { user_id: number }; event: EventFields }
export type UpdateEventDto = { updateFields: EventFields; where: { user_id: number; id: number } }
export type DeleteEventDto = { where: { user_id: number; id: number } }
