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
import { createPayment } from 'apiSdk/payments';
import { Error } from 'components/error';
import { paymentValidationSchema } from 'validationSchema/payments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LoanInterface } from 'interfaces/loan';
import { getLoans } from 'apiSdk/loans';
import { PaymentInterface } from 'interfaces/payment';

function PaymentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PaymentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPayment(values);
      resetForm();
      router.push('/payments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PaymentInterface>({
    initialValues: {
      amount: 0,
      payment_date: new Date(new Date().toDateString()),
      loan_id: (router.query.loan_id as string) ?? null,
    },
    validationSchema: paymentValidationSchema,
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
            Create Payment
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
          <FormControl id="payment_date" mb="4">
            <FormLabel>Payment Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.payment_date ? new Date(formik.values?.payment_date) : null}
                onChange={(value: Date) => formik.setFieldValue('payment_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<LoanInterface>
            formik={formik}
            name={'loan_id'}
            label={'Select Loan'}
            placeholder={'Select Loan'}
            fetcher={getLoans}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.customer_name}
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

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'payment',
  operation: AccessOperationEnum.CREATE,
})(PaymentCreatePage);
