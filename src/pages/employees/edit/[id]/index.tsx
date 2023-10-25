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
  Center,
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
import { FunctionComponent, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { useRoqClient, useEmployeeFindFirst } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';
import { convertQueryToPrismaUtil } from 'lib/utils';
import { employeeValidationSchema } from 'validationSchema/employees';
import { EmployeeInterface } from 'interfaces/employee';
import { CompanyInterface } from 'interfaces/company';

function EmployeeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const roqClient = useRoqClient();
  const queryParams = useMemo(
    () =>
      convertQueryToPrismaUtil(
        {
          id,
        },
        'employee',
      ),
    [id],
  );
  const { data, error, isLoading, mutate } = useEmployeeFindFirst(queryParams, {}, { disabled: !id });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmployeeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await roqClient.employee.update({
        data: values as RoqTypes.employee,
        where: {
          id,
        },
      });
      mutate(updated);
      resetForm();
      router.push('/employees');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<EmployeeInterface>({
    initialValues: data,
    validationSchema: employeeValidationSchema,
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
              label: 'Employees',
              link: '/employees',
            },
            {
              label: 'Update Employee',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Employee
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.first_name}
            label={'First Name'}
            props={{
              name: 'first_name',
              placeholder: 'First Name',
              value: formik.values?.first_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.last_name}
            label={'Last Name'}
            props={{
              name: 'last_name',
              placeholder: 'Last Name',
              value: formik.values?.last_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.email}
            label={'Email'}
            props={{
              name: 'email',
              placeholder: 'Email',
              value: formik.values?.email,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.address}
            label={'Address'}
            props={{
              name: 'address',
              placeholder: 'Address',
              value: formik.values?.address,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.phone}
            label={'Phone'}
            props={{
              name: 'phone',
              placeholder: 'Phone',
              value: formik.values?.phone,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.position}
            label={'Position'}
            props={{
              name: 'position',
              placeholder: 'Position',
              value: formik.values?.position,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Salary"
            formControlProps={{
              id: 'salary',
              isInvalid: !!formik.errors?.salary,
            }}
            name="salary"
            error={formik.errors?.salary}
            value={formik.values?.salary}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('salary', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={() => roqClient.company.findManyWithCount({})}
            labelField={'name'}
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
              onClick={() => router.push('/employees')}
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
    entity: 'employee',
    operation: AccessOperationEnum.UPDATE,
  }),
)(EmployeeEditPage);
