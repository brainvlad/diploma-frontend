import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { getStatisticsViewById, removeStatistics } from "../../http/statistics";
import {
  Container,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Stack,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Box from "@mui/material/Box";
import { getAuthUserData } from "../../http/auth";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { toast } from "react-hot-toast";

const ViewStatistics = () => {
  const { id } = useParams();

  const [deleteDialog, setDeleteDialog] = useState(false);

  const navigate = useNavigate();

  const [state, run] = useAsyncFn(async (id: string) => {
    const res = await getStatisticsViewById(id);
    const authUser = await getAuthUserData();

    return { ...res.data, authUser };
  });

  useEffect(() => {
    if (id) {
      run(id);
    }
  }, [id]);

  if (!state.loading && !state.error)
    return (
      <Container sx={{ marginTop: 2 }}>
        <ConfirmationDialog
          handleClose={() => setDeleteDialog(!deleteDialog)}
          handleAgree={() => {
            removeStatistics(id!).then((res) => {
              if (res.status >= 200 && res.status < 400) {
                navigate(`/class/${state?.value?.classRoom?.id}`);
                toast.success(
                  `Статистика "${state.value?.title}" была успешно удалена!`
                );
              }
            });
          }}
          open={deleteDialog}
          content={`Вы действительно хотите удалить статистику "${state.value?.title}" по предмету ${state.value?.subject?.name} для группы ${state.value?.groupName}?`}
          title={"Удалить статистику"}
        />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Stack spacing={2}>
              <Typography variant={"h5"}>
                Статистика по группе: <u>{state.value?.title}</u>
              </Typography>

              <Divider />

              <Paper sx={{ padding: 1 }}>
                <Stack spacing={1}>
                  <Typography variant={"subtitle1"}>
                    {state.value?.subject?.name}
                  </Typography>
                  <Typography variant={"caption"}>
                    Преподаватель: {state.value?.subject?.teacher?.firstName}{" "}
                    {state.value?.subject?.teacher?.middleName}{" "}
                    {state.value?.subject?.teacher?.lastName}
                  </Typography>
                  <Typography variant={"caption"}>
                    Группа: {state.value?.groupName}
                  </Typography>
                  <br />
                  {state.value?.comment ? (
                    <Alert severity={"info"}>{state.value?.comment}</Alert>
                  ) : null}
                  {state.value?.authUser ? (
                    <Button
                      variant={"text"}
                      color={"error"}
                      size={"small"}
                      sx={{ width: "30%" }}
                      onClick={() => setDeleteDialog(!deleteDialog)}
                    >
                      Удалить статистику
                    </Button>
                  ) : null}
                </Stack>
              </Paper>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Студент</TableCell>
                      <TableCell>Оценка</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.value?.studentGrades?.length > 0
                      ? state.value?.studentGrades?.map(
                          (item: any, index: number) => {
                            return (
                              <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.grade}</TableCell>
                              </TableRow>
                            );
                          }
                        )
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={2}>
              <Typography variant={"h5"}>Список тем</Typography>
              <Divider />

              <Box>
                {state.value?.topics?.length > 0
                  ? state.value?.topics?.map((t: any) => {
                      return (
                        <Accordion>
                          <AccordionSummary>
                            <Typography>
                              №{t.order} - {t.topic}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Alert severity={"info"}>
                              <Typography>{t.description}</Typography>
                            </Alert>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                  : null}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );

  if (state.loading) {
    return (
      <Container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return <h1>no data</h1>;
};

export default ViewStatistics;
