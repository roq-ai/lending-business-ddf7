import axios from 'axios';
import queryString from 'query-string';
import { LoanInterface, LoanGetQueryInterface } from 'interfaces/loan';
import { GetQueryInterface } from '../../interfaces';

export const getLoans = async (query?: LoanGetQueryInterface) => {
  const response = await axios.get(`/api/loans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLoan = async (loan: LoanInterface) => {
  const response = await axios.post('/api/loans', loan);
  return response.data;
};

export const updateLoanById = async (id: string, loan: LoanInterface) => {
  const response = await axios.put(`/api/loans/${id}`, loan);
  return response.data;
};

export const getLoanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/loans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLoanById = async (id: string) => {
  const response = await axios.delete(`/api/loans/${id}`);
  return response.data;
};
