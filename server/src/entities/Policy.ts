import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { ApplicationStatus } from "../common/enums/application-status.enum";
import { Product } from "./Product";
import { User } from "./User";

@Entity("policies")
@Unique(["policyNumber"]) // Ensures policy numbers are unique
export class Policy {
  @PrimaryGeneratedColumn()
  readonly policyId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  readonly productId!: number;

  @Column({
    type: "varchar",
    length: 50,
  })
  readonly policyNumber!: string;

  @Column({
    type: "date",
  })
  readonly startDate!: Date;

  @Column({
    type: "date",
  })
  readonly endDate!: Date;

  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @Column()
  readonly createdAt!: Date;

  @Column()
  readonly updatedAt!: Date;
}
