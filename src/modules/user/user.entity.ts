import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn, OneToMany,
} from 'typeorm'

import { Event } from '../event/event.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  name: string

  @Column()
  password_hash: string

  @OneToMany(() => Event, (event) => event.user)
  events: Event[]

  @CreateDateColumn({
    name: 'createDateTime',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date
}
