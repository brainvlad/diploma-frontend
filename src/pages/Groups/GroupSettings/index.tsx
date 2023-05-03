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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getAllStudentsByGroup } from "../../../http/students";
import { getGroupById } from "../../../http/groups";
import { useAsyncFn } from "react-use";
import Dialog from "../../../components/Dialog";
import CreateNewStudent from "./CreateNewStudent";
import EditStudentForm from "./EditStudentForm";

const GroupSettings = () => {
  const { groupId } = useParams();

  const [groupName, setGroupName] = useState("");
  const [createStudentForm, setCreateStudentForm] = useState(false);
  const [editStudent, setEditStudent] = useState("");

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

  return (
    <Container>
      <Stack spacing={2}>
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
                      (a: { firstName: string }, b: { firstName: string }) =>
                        a?.firstName[0]?.codePointAt(0)! -
                        b?.firstName[0]?.codePointAt(0)!
                    )
                    .map((st: any, index: number) => (
                      <TableRow>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {st.firstName} {st.middleName[0]}. {st.lastName[0]}.
                        </TableCell>
                        <TableCell>
                          <Stack direction={"row"} spacing={1}>
                            <Dialog
                              open={editStudent === st.id}
                              handleClose={() => setEditStudent("")}
                              title={"Изменить данные студента"}
                              contentText={"Заполните сведения студента"}
                              handleSubmit={() => setEditStudent("")}
                              showAction={false}
                            >
                              <EditStudentForm
                                studentId={editStudent}
                                callBack={() => {
                                  run(groupId).then(() => setEditStudent(""));
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
      </Stack>
    </Container>
  );
};

export default GroupSettings;
