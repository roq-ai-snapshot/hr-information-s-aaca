import * as yup from 'yup';

export const payrollValidationSchema = yup.object().shape({
  gross_pay: yup.number().integer().required(),
  net_pay: yup.number().integer().required(),
  tax: yup.number().integer().required(),
  insurance: yup.number().integer().required(),
  other_deductions: yup.number().integer().required(),
  pay_date: yup.date().required(),
  employee_id: yup.string().nullable().required(),
});
