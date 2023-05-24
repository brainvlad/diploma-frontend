import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { getStudentProfile } from "../../../http/students";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const StudentProfile = () => {
  const { studentId } = useParams();

  const [state, run] = useAsyncFn(async (id: string) => {
    const res = await getStudentProfile(id);

    return res.data;
  });

  useEffect(() => {
    if (studentId) {
      run(studentId);
    }
  }, [studentId, run]);

  if (!state.loading && !state.error && state.value)
    // return <Typography>{JSON.stringify(state.value, null, 2)}</Typography>;
    return (
      <Container>
        <Stack spacing={2}>
          <Paper sx={{ padding: 1 }}>
            <Stack spacing={0.5}>
              <Typography variant={"h5"}>
                Профиль студента:{" "}
                <u>
                  {state.value?.firstName} {state.value?.middleName}{" "}
                  {state.value?.lastName}
                </u>
              </Typography>
              <Divider />
              <Typography variant={"caption"}>
                Факультет: <b>{state.value.group?.faculty?.name || "-"}</b>
              </Typography>
              <Typography variant={"caption"}>
                Курс: <b>{state.value.group?.course}</b>
              </Typography>
              <Typography variant={"caption"}>
                Группа:{" "}
                <b>
                  {state.value.group.group} - {state.value.group.subGroup}
                </b>
              </Typography>
            </Stack>
          </Paper>

          {/* Classes List START*/}

          {state.value.group?.Classes?.length > 0 ? (
            state.value.group?.Classes?.map((c: any) => {
              return (
                <Accordion>
                  <AccordionSummary>
                    <Typography>{c?.subject?.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {(function () {
                        return state.value?.StudentGrades?.filter(
                          (sg: any) =>
                            sg?.criteria?.studyPlanItem?.subjectId ===
                            c?.subject?.id
                        ).length > 1
                          ? [
                              ...state.value?.StudentGrades?.filter(
                                (sg: any) =>
                                  sg?.criteria?.studyPlanItem?.subjectId ===
                                  c?.subject?.id
                              ),
                            ]
                          : state.value?.StudentGrades?.filter(
                              (sg: any) =>
                                sg?.criteria?.studyPlanItem?.subjectId ===
                                c?.subject?.id
                            );
                      })()
                        .sort(
                          (a: any, b: any) =>
                            a?.criteria?.studyPlanItem?.order -
                            b?.criteria?.studyPlanItem?.order
                        )
                        .map((sg: any) => (
                          <ListItem>
                            <Stack>
                              <Typography variant={"h6"}>
                                №{sg?.criteria?.studyPlanItem?.order}{" "}
                                {sg?.criteria?.studyPlanItem?.topic}
                              </Typography>
                              <Table
                                component={Paper}
                                sx={{ width: "100%", marginTop: 1 }}
                                size={"small"}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Название критерия</TableCell>
                                    <TableCell>Коэффициент</TableCell>
                                    <TableCell>Значение</TableCell>
                                    {/*<TableCell>Комментарий</TableCell>*/}
                                    {/*<TableCell>Сдано</TableCell>*/}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {state.value?.StudentGrades?.filter(
                                    (innerSg: any) =>
                                      innerSg?.criteria?.studyPlanItem?.id ===
                                      sg?.criteria?.studyPlanItem?.id
                                  ).map((sg: any) => (
                                    <TableRow>
                                      <TableCell>
                                        {sg?.criteria?.name}
                                      </TableCell>
                                      <TableCell>
                                        {sg?.criteria?.coefficient}
                                      </TableCell>
                                      <TableCell>{sg?.value}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              {state.value?.StudentGrades?.filter(
                                (innerSg: any) =>
                                  innerSg?.criteria?.studyPlanItem?.id ===
                                  sg?.criteria?.studyPlanItem?.id
                              )[0].comment ? (
                                <Alert
                                  severity={
                                    state.value?.StudentGrades?.filter(
                                      (innerSg: any) =>
                                        innerSg?.criteria?.studyPlanItem?.id ===
                                        sg?.criteria?.studyPlanItem?.id
                                    )[0].done
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  <AlertTitle>Комментарий</AlertTitle>
                                  <Typography>
                                    {state.value?.StudentGrades?.filter(
                                      (innerSg: any) =>
                                        innerSg?.criteria?.studyPlanItem?.id ===
                                        sg?.criteria?.studyPlanItem?.id
                                    )[0].comment || "-"}
                                  </Typography>
                                </Alert>
                              ) : null}
                            </Stack>
                            {/*{JSON.stringify(sg, null, 2)}*/}
                          </ListItem>
                        ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Alert severity={"info"}>
              Данный студент пока не был добавлен в классы преподаватлем
            </Alert>
          )}

          {/* Classes List END */}
        </Stack>
      </Container>
    );

  if (state.loading) {
    return (
      <Container>
        <Box sx={{ position: "absolute", top: "50%", left: "50%" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return <h1>no data</h1>;
};

export default StudentProfile;
