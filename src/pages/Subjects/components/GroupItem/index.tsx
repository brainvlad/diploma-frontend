import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blueGrey } from '@mui/material/colors';

type Props = {
  id: string;
  classId: string;
  name: string;
  description: string;
};

const ClassItem = ({ id, name, description, classId }: Props) => {
  const navigate = useNavigate();
  const goToTable = (classGroupId: string) => {
    navigate(`/class/${classGroupId}`);
  };

  return (
    <Paper
      sx={{
        padding: '14px 24px',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: blueGrey[50],
        },
        backgroundColor: blueGrey[50],
      }}
      key={id}
    >
      <Grid container spacing={2} onClick={() => goToTable(classId)}>
        <Grid item xs={4}>
          <Typography fontSize={'15px'}>{name}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography fontSize={'15px'}>{description}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClassItem;
