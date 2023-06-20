import { PaymentInterface } from 'interfaces/payment';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LoanInterface {
  id?: string;
  amount: number;
  customer_name: string;
  status: string;
  loan_officer_id: string;
  created_at?: any;
  updated_at?: any;
  payment?: PaymentInterface[];
  user?: UserInterface;
  _count?: {
    payment?: number;
  };
}

export interface LoanGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_name?: string;
  status?: string;
  loan_officer_id?: string;
}
