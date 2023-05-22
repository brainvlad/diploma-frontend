import React, { useEffect, useState } from 'react';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { getStudyPlan } from '../../../../http/subjects';
import { addNewItemStudyPlan } from '../../../../http/study-plan';

type Props = {
  subjectId: string;
  open: boolean;
};

const StudyPlanList = ({ subjectId, open }: Props) => {
  const [plan, setPlan] = useState<Array<any>>([]);
  const [openToCreate, setOpenToCreate] = useState(false);

  const [topic, setTopic] = useState<string>('');
  const [order, setOrder] = useState<number>(+plan?.length + 1);

  useEffect(() => {
    if (open) {
      getStudyPlan(subjectId).then((res) => setPlan(res.data.plan));
    }
    setOrder(+plan?.length + 1);
  }, [open, plan.length]);

  const handleAddStudyPlanItem = () =>
    addNewItemStudyPlan({ subjectId, topic, order });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Тема</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!plan && plan?.length
            ? plan.map((p) => (
                <TableRow>
                  <TableCell>{p.order}</TableCell>
                  <TableCell>{p.topic}</TableCell>
                </TableRow>
            ))
            : null}
          {openToCreate ? (
            <TableRow>
              <TableCell>
                <TextField
                  size={'small'}
                  label={'Очередь (номер)'}
                  type={'number'}
                  inputProps={{
                    min: 1,
                    defaultValue: +plan?.length + 1,
                  }}
                  onChange={(e) => setOrder(+e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size={'small'}
                  label={'Название темы'}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </TableCell>
            </TableRow>
          ) : null}
          <TableRow>
            <TableCell>
              <Stack direction={'row'} spacing={1}>
                <Button
                  variant={'text'}
                  size={'small'}
                  onClick={() => setOpenToCreate(!openToCreate)}
                >
                  Добавить новую тему
                </Button>
                {openToCreate ? (
                  <Button
                    variant={'contained'}
                    size={'small'}
                    onClick={async () => {
                      await handleAddStudyPlanItem();
                      getStudyPlan(subjectId).then((res) => {
                        setPlan(res.data.plan);
                        setOrder(res.data.plan.length + 1);
                        setOpenToCreate(!openToCreate);
                      });
                    }}
                  >
                    Сохранить
                  </Button>
                ) : null}
              </Stack>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudyPlanList;
