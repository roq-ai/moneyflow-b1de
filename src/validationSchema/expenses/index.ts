import * as yup from 'yup';

export const expenseValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  category: yup.string().required(),
  person_id: yup.string().nullable(),
});
