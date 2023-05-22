import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAsyncFn } from 'react-use';
import { getStudentById, updateStudentInfo } from '../../../../http/students';
import { Button, Stack, TextField } from '@mui/material';

type Props = {
  studentId: string;
  callBack: () => void;
};

const EditStudentForm = ({ studentId, callBack }: Props) => {
  const { register, setValue, handleSubmit, watch } = useForm();

  const [state, run] = useAsyncFn(
    async (sId: string) => {
      const res = await getStudentById(sId);

      const data = res.data;
      setValue('firstName', data.firstName);
      setValue('middleName', data.middleName);
      setValue('lastName', data.lastName);

      return data;
    },
    [studentId],
  );

  useEffect(() => {
    register('firstName');
    register('middleName');
    register('lastName');
    run(studentId);
  }, [register, run]);

  const sendUpdateRequest = async (data: any) => {
    if (studentId !== '') {
      await updateStudentInfo(studentId, data);
      await callBack();
    }
  };

  if (!state.error && !state.loading)
    return (
      <Stack spacing={2}>
        <TextField
          label={'Фамилия'}
          defaultValue={state.value?.firstName}
          size={'small'}
          onChange={(e) => setValue('firstName', e.target.value)}
        />
        <TextField
          label={'Имя'}
          defaultValue={state.value?.middleName}
          size={'small'}
          onChange={(e) => setValue('middleName', e.target.value)}
        />
        <TextField
          label={'Отчество'}
          defaultValue={state.value?.lastName}
          size={'small'}
          onChange={(e) => setValue('lastName', e.target.value)}
        />
        <Button variant={'contained'} onClick={handleSubmit(sendUpdateRequest)}>
          Сохранить
        </Button>
      </Stack>
    );

  return <div>Not</div>;
};

export default EditStudentForm;
