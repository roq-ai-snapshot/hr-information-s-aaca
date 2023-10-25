import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { payrollValidationSchema } from 'validationSchema/payrolls';
import { EmployeeInterface } from 'interfaces/employee';
import { PayrollInterface } from 'interfaces/payroll';

function PayrollCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: PayrollInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.payroll.create({ data: values as RoqTypes.payroll });
      resetForm();
      router.push('/payrolls');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PayrollInterface>({
    initialValues: {
      gross_pay: 0,
      net_pay: 0,
      tax: 0,
      insurance: 0,
      other_deductions: 0,
      pay_date: new Date(new Date().toDateString()),
      employee_id: (router.query.employee_id as string) ?? null,
    },
    validationSchema: payrollValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Payrolls',
              link: '/payrolls',
            },
            {
              label: 'Create Payroll',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Payroll
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Gross Pay"
            formControlProps={{
              id: 'gross_pay',
              isInvalid: !!formik.errors?.gross_pay,
            }}
            name="gross_pay"
            error={formik.errors?.gross_pay}
            value={formik.values?.gross_pay}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('gross_pay', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Net Pay"
            formControlProps={{
              id: 'net_pay',
              isInvalid: !!formik.errors?.net_pay,
            }}
            name="net_pay"
            error={formik.errors?.net_pay}
            value={formik.values?.net_pay}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('net_pay', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Tax"
            formControlProps={{
              id: 'tax',
              isInvalid: !!formik.errors?.tax,
            }}
            name="tax"
            error={formik.errors?.tax}
            value={formik.values?.tax}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('tax', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Insurance"
            formControlProps={{
              id: 'insurance',
              isInvalid: !!formik.errors?.insurance,
            }}
            name="insurance"
            error={formik.errors?.insurance}
            value={formik.values?.insurance}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('insurance', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Other Deductions"
            formControlProps={{
              id: 'other_deductions',
              isInvalid: !!formik.errors?.other_deductions,
            }}
            name="other_deductions"
            error={formik.errors?.other_deductions}
            value={formik.values?.other_deductions}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('other_deductions', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="pay_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Pay Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.pay_date ? new Date(formik.values?.pay_date) : null}
              onChange={(value: Date) => formik.setFieldValue('pay_date', value)}
            />
          </FormControl>
          <AsyncSelect<EmployeeInterface>
            formik={formik}
            name={'employee_id'}
            label={'Select Employee'}
            placeholder={'Select Employee'}
            fetcher={() => roqClient.employee.findManyWithCount({})}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/payrolls')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'payroll',
    operation: AccessOperationEnum.CREATE,
  }),
)(PayrollCreatePage);
