import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
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
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createExpense } from 'apiSdk/expenses';
import { Error } from 'components/error';
import { expenseValidationSchema } from 'validationSchema/expenses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PersonInterface } from 'interfaces/person';
import { getPeople } from 'apiSdk/people';
import { ExpenseInterface } from 'interfaces/expense';

function ExpenseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ExpenseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createExpense(values);
      resetForm();
      router.push('/expenses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ExpenseInterface>({
    initialValues: {
      amount: 0,
      category: '',
      person_id: (router.query.person_id as string) ?? null,
    },
    validationSchema: expenseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Expense
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="category" mb="4" isInvalid={!!formik.errors?.category}>
            <FormLabel>Category</FormLabel>
            <Input type="text" name="category" value={formik.values?.category} onChange={formik.handleChange} />
            {formik.errors.category && <FormErrorMessage>{formik.errors?.category}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PersonInterface>
            formik={formik}
            name={'person_id'}
            label={'Select Person'}
            placeholder={'Select Person'}
            fetcher={getPeople}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
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
    entity: 'expense',
    operation: AccessOperationEnum.CREATE,
  }),
)(ExpenseCreatePage);
