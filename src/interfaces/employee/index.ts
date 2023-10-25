import { PayrollInterface } from 'interfaces/payroll';
import { VacationInterface } from 'interfaces/vacation';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface EmployeeInterface {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  position: string;
  salary: number;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  payroll?: PayrollInterface[];
  vacation?: VacationInterface[];
  company?: CompanyInterface;
  _count?: {
    payroll?: number;
    vacation?: number;
  };
}

export interface EmployeeGetQueryInterface extends GetQueryInterface {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  phone?: string;
  position?: string;
  company_id?: string;
}
