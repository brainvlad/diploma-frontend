import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '../../../../components/Dialog';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { createSubject } from '../../../../http/subjects';

type Props = {
  open: boolean;
  handleOpen: () => void;
  callback: () => void;
};

export default function CreateSubjectForm({ open, handleOpen, callback }: Props) {
  const [name, setName] = useState<string>();
  const [alias, setAlias] = useState<string>();

  const handleSubmit = () => {
    createSubject({ name, alias });
    callback();
  };

  return (
    <Dialog
      open={open}
      handleClose={() => handleOpen()}
      title={'Создать новый предмет'}
      contentText={'Введите название предмета и алиас (короткое название)'}
      handleSubmit={handleSubmit}
      showAction={true}
    >
      <Stack spacing={1}>
        <TextField
          label={'Название предмета'}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField label={'Алиас'} onChange={(e) => setAlias(e.target.value)} />
      </Stack>
    </Dialog>
  );
}
