import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Stack,
  Link,
  Breadcrumbs,
  Typography,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Grid,
  FormControl,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getAllStudentsByGroup } from "../../../http/students";
import { activateGroup, getGroupById, shareGroup } from "../../../http/groups";
import { useAsyncFn } from "react-use";
import Dialog from "../../../components/Dialog";
import CreateNewStudent from "./CreateNewStudent";
import EditStudentForm from "./EditStudentForm";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const GroupSettings = () => {
  const { groupId } = useParams();

  const [groupName, setGroupName] = useState("");
  const [createStudentForm, setCreateStudentForm] = useState(false);
  const [editStudent, setEditStudent] = useState("");

  const [activeFlag, setActiveFlag] = useState(false);
  const [shareFlag, setShareFlag] = useState(false);

  const [state, run] = useAsyncFn(async (gId) => {
    const studentList = await getAllStudentsByGroup(gId).then(
      (res) => res.data
    );
    const groupInfo = await getGroupById(groupId!).then((res) => res.data);

    setGroupName(`${groupInfo.group} - ${groupInfo.subGroup}`);

    return {
      studentList,
      groupInfo,
    };
  });

  useEffect(() => {
    if (groupId) {
      run(groupId);
    }
  }, [run, groupId]);

  if (!state.loading && !state.error)
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/groups">
                  Мои группы
                </Link>
                <Typography color="text.primary">{groupName}</Typography>
              </Breadcrumbs>

              <Dialog
                open={createStudentForm}
                handleClose={() => setCreateStudentForm(!createStudentForm)}
                title={"Добавить студента"}
                contentText={"Заполните данные студента"}
                handleSubmit={() => setCreateStudentForm(!createStudentForm)}
                showAction={false}
              >
                <CreateNewStudent
                  groupId={groupId!}
                  callBack={() => {
                    run(groupId).then(() =>
                      setCreateStudentForm(!createStudentForm)
                    );
                  }}
                />
              </Dialog>
              <Button
                variant={"contained"}
                onClick={() => setCreateStudentForm(!createStudentForm)}
              >
                Добавить
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <Stack spacing={2}>
              {state.value?.studentList?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Студент</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.value?.studentList?.length > 0
                        ? state.value?.studentList
                            .sort(
                              (
                                a: { firstName: string },
                                b: { firstName: string }
                              ) =>
                                a?.firstName[0]?.codePointAt(0)! -
                                b?.firstName[0]?.codePointAt(0)!
                            )
                            .map((st: any, index: number) => (
                              <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {st.firstName} {st.middleName[0]}.{" "}
                                  {st.lastName[0]}.
                                </TableCell>
                                <TableCell>
                                  <Stack
                                    direction={"row"}
                                    spacing={1}
                                    alignContent={"end"}
                                    alignItems={"end"}
                                    justifyContent={"end"}
                                    justifyItems={"end"}
                                  >
                                    <Dialog
                                      open={editStudent === st.id}
                                      handleClose={() => setEditStudent("")}
                                      title={"Изменить данные студента"}
                                      contentText={
                                        "Заполните сведения студента"
                                      }
                                      handleSubmit={() => setEditStudent("")}
                                      showAction={false}
                                    >
                                      <EditStudentForm
                                        studentId={editStudent}
                                        callBack={() => {
                                          run(groupId).then(() =>
                                            setEditStudent("")
                                          );
                                        }}
                                      />
                                    </Dialog>
                                    <IconButton
                                      color={"primary"}
                                      onClick={() => setEditStudent(st.id)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton color={"error"}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity={"info"} sx={{ border: "1px solid #1893D5" }}>
                  Вы создали группу {groupName}. Чтобы работать с ней, Вам
                  необходимо записать студентов. После этого Вы можете создавать
                  классы и отслеживать успеваемость студентов. Также Вы можете
                  поделиться списком студентов группы с другими пользователям,
                  использя флажки "Активна" и "Открытый доступ".
                </Alert>
              )}
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ padding: 1 }}>
              <Stack spacing={1}>
                <Typography color={"text.color.primary"}>
                  Дополнительные параметры
                </Typography>
                <Divider />
                <FormControlLabel
                  label={"Активна"}
                  control={
                    <Checkbox
                      defaultChecked={state.value?.groupInfo?.isActive || false}
                      onChange={() => setActiveFlag(!activeFlag)}
                    />
                  }
                />
                <FormControlLabel
                  label={"Открытый доступ"}
                  control={
                    <Checkbox
                      onChange={() => setShareFlag(!shareFlag)}
                      defaultChecked={state.value?.groupInfo?.isShared || false}
                    />
                  }
                />

                <ConfirmationDialog
                  handleClose={() => setActiveFlag(!activeFlag)}
                  handleAgree={() => {
                    activateGroup(groupId!).then(() => run(groupId!));
                  }}
                  open={activeFlag}
                  content={
                    'Подтверждая, Вы изменяете статус группы на "Активная". Продолжить?'
                  }
                  title={"Статус группы"}
                />

                <ConfirmationDialog
                  handleClose={() => setShareFlag(!shareFlag)}
                  handleAgree={() => {
                    shareGroup(groupId!).then(() => run(groupId!));
                  }}
                  open={shareFlag}
                  content={
                    "Подтверждая, Вы изменяете доступ к группе для её использования другими пользователями. Продолжить?"
                  }
                  title={"Открыть доступ группы"}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );

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
};

export default GroupSettings;
