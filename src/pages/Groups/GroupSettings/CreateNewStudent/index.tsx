import React, { useEffect } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { addNewStudent } from '../../../../http/students';

type Props = {
  groupId: string;
  callBack: () => void;
};

const CreateNewStudent = ({ groupId, callBack }: Props) => {
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    register('firstName');
    register('middleName');
    register('lastName');
  });

  const submitRequest = async (data: any) => {
    const req = { ...data, groupId };
    await addNewStudent(req);
    await callBack();
  };

  return (
    <Stack spacing={1}>
      <TextField
        label={'Фамилия'}
        size={'small'}
        onChange={(e) => setValue('firstName', e.target.value)}
      />
      <TextField
        label={'Имя'}
        size={'small'}
        onChange={(e) => setValue('middleName', e.target.value)}
      />
      <TextField
        label={'Отчество'}
        size={'small'}
        onChange={(e) => setValue('lastName', e.target.value)}
      />
      <Button variant={'contained'} onClick={handleSubmit(submitRequest)}>
        Добавить
      </Button>
    </Stack>
  );
};

export default CreateNewStudent;
