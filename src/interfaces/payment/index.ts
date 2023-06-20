import { LoanInterface } from 'interfaces/loan';
import { GetQueryInterface } from 'interfaces';

export interface PaymentInterface {
  id?: string;
  amount: number;
  loan_id: string;
  payment_date: any;
  created_at?: any;
  updated_at?: any;

  loan?: LoanInterface;
  _count?: {};
}

export interface PaymentGetQueryInterface extends GetQueryInterface {
  id?: string;
  loan_id?: string;
}
