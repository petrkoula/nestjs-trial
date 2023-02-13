import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn, ManyToOne, Index, JoinColumn, Unique,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity()
@Unique(['name'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  vote_count: number

  @Column()
  user_id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User

  @CreateDateColumn()
  created_at: Date
}
