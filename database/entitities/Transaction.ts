import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./Client";

export enum TransactionTypes {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

@Entity("transactions")
export class Transaction {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "enum", enum: TransactionTypes })
  type: string;

  @Column({ type: "numeric" })
  amount: number;

  @ManyToOne(() => Client, (client) => client.transactions)
  @JoinColumn({ name: "client_id" }) // untuk membuat foreignkey
  client: Client;
}
