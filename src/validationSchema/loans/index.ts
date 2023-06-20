import * as yup from 'yup';

export const loanValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  customer_name: yup.string().required(),
  status: yup.string().required(),
  loan_officer_id: yup.string().nullable().required(),
});
