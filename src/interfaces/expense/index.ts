import { PersonInterface } from 'interfaces/person';
import { GetQueryInterface } from 'interfaces';

export interface ExpenseInterface {
  id?: string;
  amount: number;
  category: string;
  person_id?: string;
  created_at?: any;
  updated_at?: any;

  person?: PersonInterface;
  _count?: {};
}

export interface ExpenseGetQueryInterface extends GetQueryInterface {
  id?: string;
  category?: string;
  person_id?: string;
}
