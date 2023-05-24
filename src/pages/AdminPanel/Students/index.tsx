import React, { useEffect, useState } from "react";
import {
  Container,
  Divider,
  Stack,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Autocomplete,
  TableRow,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import Box from "@mui/material/Box";
import { useAsyncFn } from "react-use";
import { getAllFaculties } from "../../../http/faculty";
import { useForm } from "react-hook-form";
import { getAllStudents } from "../../../http/students";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const { handleSubmit, setValue, register, watch } = useForm();
  const [studentsList, setStudentsList] = useState([]);
  const watched = watch();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [faculties, getFaculties] = useAsyncFn(async () => {
    const res = await getAllFaculties();
    return res.data;
  });
  const [students, getStudents] = useAsyncFn(async (params: any) => {
    const res = await getAllStudents(params);
    setStudentsList(res.data.list || []);
    return res.data;
  });

  const navigate = useNavigate();

  useEffect(() => {
    getStudents(watched);
    getFaculties();

    register("fullName");
    register("facultyId");
    register("course");
    register("group");
    register("subGroup");
  }, [getFaculties, register]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!students.loading && !students.error)
    return (
      <Container>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant={"h5"}>Студенты</Typography>
            <Divider />
          </Stack>
          <Box>
            <Paper sx={{ padding: 1 }}>
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent={"space-between"}
              >
                <TextField
                  label={"ФИО студента"}
                  defaultValue={watched.fullName}
                  onChange={(e) => setValue("fullName", e.target.value || "")}
                  size={"small"}
                />
                {!faculties.loading &&
                !faculties.error &&
                faculties.value?.list?.length > 0 ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={faculties.value?.list.map((item: any) => ({
                      id: item.id,
                      label: item.name,
                    }))}
                    onChange={(e, newValue) => {
                      setValue("facultyId", (newValue as any)?.id || null);
                      // getStudents(watched);
                    }}
                    sx={{ width: 300 }}
                    defaultValue={{
                      id: watched.facultyId,
                      label:
                        faculties.value?.list?.filter(
                          (f: any) => f.id === watched.facultyId
                        )[0]?.name || "",
                    }}
                    renderInput={(params: any) => (
                      <TextField {...params} label="Факультет" size={"small"} />
                    )}
                  />
                ) : null}

                <TextField
                  type={"number"}
                  inputProps={{ max: 6, min: 1 }}
                  label={"Курс"}
                  size={"small"}
                  defaultValue={watched.course || ""}
                  onChange={(e) => {
                    setValue("course", +e.target.value || null);
                    // getStudents(watched);
                  }}
                />
                <TextField
                  type={"number"}
                  inputProps={{ min: 1 }}
                  label={"Группа"}
                  size={"small"}
                  sx={{ minWidth: "100px" }}
                  defaultValue={watched.group || ""}
                  onChange={(e) => {
                    setValue("group", +e.target.value || null);
                    // getStudents(watched);
                  }}
                />
                <TextField
                  type={"number"}
                  inputProps={{ min: 1, max: 3 }}
                  sx={{ minWidth: "120px" }}
                  label={"Подгруппа"}
                  size={"small"}
                  defaultValue={watched.subGroup || ""}
                  onChange={(e) => {
                    setValue("subGroup", +e.target.value || null);
                    // getStudents(watched);
                  }}
                />
                <IconButton
                  color={"primary"}
                  disabled={Object.values(watched).length === 0}
                  onClick={handleSubmit(getStudents)}
                >
                  <SearchIcon />
                </IconButton>
              </Stack>
            </Paper>
          </Box>
          <Box>
            <TableContainer>
              <Table
                component={Paper}
                sx={{ maxHeight: "450px" }}
                size={"small"}
              >
                <TableHead>
                  <TableCell>ID</TableCell>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Факультет</TableCell>
                  <TableCell>Курс</TableCell>
                  <TableCell>Группа</TableCell>
                  <TableCell>Статистика</TableCell>
                </TableHead>
                <TableBody>
                  {!students.loading &&
                  !students.error &&
                  studentsList.length > 0
                    ? studentsList
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((st: any) => (
                          <TableRow>
                            <TableCell>{st.id}</TableCell>
                            <TableCell>
                              {st.firstName} {st.middleName} {st.lastName}
                            </TableCell>
                            <TableCell>
                              {st.group.facuty?.name || "-"}
                            </TableCell>
                            <TableCell>{st.group.course}</TableCell>
                            <TableCell>
                              {st.group.group} - {st.group.subGroup}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color={"primary"}
                                onClick={() =>
                                  navigate(
                                    `/admin-panel/students/profile/${st.id}`
                                  )
                                }
                              >
                                <OpenInNewIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
            <Paper>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                labelRowsPerPage={"Количество студентов на странице"}
                count={students.value?.list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Stack>
      </Container>
    );

  if (students.loading) {
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

export default Students;
