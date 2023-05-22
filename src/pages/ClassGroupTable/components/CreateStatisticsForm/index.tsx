import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAsyncFn } from 'react-use';
import { getStatisticsByGroup } from '../../../../http/statistics';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

type Props = {
  studyPlan: Array<{
    id: string;
    topic: string;
    order: number;
  }>;
  classId: string;
};

const CreateStatisticsForm = ({ studyPlan, classId }: Props) => {
  const [checkedItem, setCheckedItem] = useState<string[]>([]);

  const [title, setTitle] = useState('Новая статистика');
  const [comment, setComment] = useState<string | null>(null);

  const navigate = useNavigate();

  const [state, run] = useAsyncFn(async (data) => {
    const res = await getStatisticsByGroup(data);

    if (res.status >= 200 && res.status < 400 && res.data.groupStatisticsId) {
      navigate(`/group-statistics/${res.data.groupStatisticsId}`);
    }

    return res.data;
  });

  const createSend = async () => {
    return run({ classId, studyPlanItemIds: checkedItem, title, comment });
  };

  return (
    <Stack spacing={2}>
      <TextField
        label={'Название'}
        size={'small'}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label={'Комментарий'}
        multiline
        size={'small'}
        onChange={(e) => setComment(e.target.value)}
      />
      <List>
        {studyPlan.map((sp) => {
          return (
            <ListItem disablePadding>
              <ListItemButton dense>
                <ListItemIcon>
                  <Checkbox
                    value={sp.id}
                    edge="start"
                    checked={checkedItem.indexOf(sp.id) !== -1}
                    tabIndex={-1}
                    onChange={(e) => {
                      if (checkedItem.indexOf(sp.id) === -1) {
                        setCheckedItem([...checkedItem, sp.id]);
                      } else {
                        setCheckedItem(checkedItem.filter((c) => c !== sp.id));
                      }

                      console.log({ checkedItem });
                    }}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText id={sp.id} primary={sp.topic} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <LoadingButton
        loading={state.loading}
        variant={'contained'}
        onClick={createSend}
      >
        Подсчитать
      </LoadingButton>
    </Stack>
  );
};

export default CreateStatisticsForm;
