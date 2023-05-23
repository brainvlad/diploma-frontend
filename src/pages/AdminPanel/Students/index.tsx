import React, { useEffect } from "react";
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
import Box from "@mui/material/Box";
import { useAsyncFn } from "react-use";
import { getAllFaculties } from "../../../http/faculty";
import { useForm } from "react-hook-form";
import { getAllStudents } from "../../../http/students";

const Students = () => {
  const { handleSubmit, setValue, register, watch } = useForm();
  const watched = watch();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [faculties, getFaculties] = useAsyncFn(async () => {
    const res = await getAllFaculties();
    return res.data;
  });
  const [students, getStudents] = useAsyncFn(async (params: any = {}) => {
    const res = await getAllStudents(params);
    return res.data;
  });

  useEffect(() => {
    getStudents(watched);
  }, [getStudents]);

  useEffect(() => {
    getFaculties();

    register("facultyId");
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
              <Stack direction={"row"} spacing={1}>
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
                      getStudents(watched);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params: any) => (
                      <TextField {...params} label="Факультет" size={"small"} />
                    )}
                  />
                ) : null}
              </Stack>
            </Paper>
          </Box>
          <Box>
            <TableContainer>
              <Table component={Paper} sx={{ height: "300px" }}>
                <TableHead>
                  <TableCell>ID</TableCell>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Факультет</TableCell>
                  <TableCell>Курс</TableCell>
                  <TableCell>Группа</TableCell>
                </TableHead>
                <TableBody>
                  {students.value?.list?.length > 0
                    ? students.value.list
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
