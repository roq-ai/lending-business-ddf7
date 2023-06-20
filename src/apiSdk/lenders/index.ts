import axios from 'axios';
import queryString from 'query-string';
import { LenderInterface, LenderGetQueryInterface } from 'interfaces/lender';
import { GetQueryInterface } from '../../interfaces';

export const getLenders = async (query?: LenderGetQueryInterface) => {
  const response = await axios.get(`/api/lenders${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLender = async (lender: LenderInterface) => {
  const response = await axios.post('/api/lenders', lender);
  return response.data;
};

export const updateLenderById = async (id: string, lender: LenderInterface) => {
  const response = await axios.put(`/api/lenders/${id}`, lender);
  return response.data;
};

export const getLenderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/lenders/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLenderById = async (id: string) => {
  const response = await axios.delete(`/api/lenders/${id}`);
  return response.data;
};
