import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn, ManyToOne, Index, JoinColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  from: Date

  @Column()
  till: Date

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column()
  user_id: number

  // https://www.darraghoriordan.com/2022/06/13/persistence-4-typeorm-postgres-relational-data/#relations-one-to-many--many-to-one
  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date
}
