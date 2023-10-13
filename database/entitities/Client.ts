import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { Person } from "./utils/Person";
import { Transaction } from "./Transaction";
import { Banker } from "./Banker";

@Entity("clients")
export class Client extends Person {
  @Column({ type: "numeric" })
  balance: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: "simple-json", nullable: true })
  additional_info: {
    age: number;
    hair_color: string;
  };

  @Column({ type: "simple-array", default: [] })
  family_members: string[];

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[];

  @ManyToMany(() => Banker)
  bankers: Banker[];
}
