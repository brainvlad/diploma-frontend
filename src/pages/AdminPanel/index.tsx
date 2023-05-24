import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUserData } from "../../http/auth";
import { useAsyncFn } from "react-use";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import Dialog from "../../components/Dialog";
import {
  Accordion,
  AccordionSummary,
  Container,
  Divider,
  Stack,
  AccordionDetails,
  CircularProgress,
  TableContainer,
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { createFaculty, getAllFaculties } from "../../http/faculty";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import UpdateFacultyForm from "./components/UpdateFacultyForm";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [facultiesExpanded, setFacultiesExpanded] = useState(false);

  const [createFacultyOpen, setCreateFacultyOpen] = useState(false);
  const [updateFacultyOpenId, setUpdateFacultyOpenId] = useState<string | null>(
    null
  );

  const { register, handleSubmit, setValue } = useForm();

  const [state, run] = useAsyncFn(async () => {
    try {
      const res = await getAuthUserData();

      if (res.data.type !== "ADMIN" && res.status >= 200 && res.status < 400) {
        navigate("/groups");
      }
      if (!(res.status >= 200 && res.status < 400)) {
        navigate("/auth/login");
      }

      return res.data;
    } catch (e) {
      throw e;
    }
  });

  const [faculties, getFaculties] = useAsyncFn(async () => {
    const res = await getAllFaculties();
    return res.data;
  });

  React.useEffect(() => {
    register("name");
    register("shortName");
    run();
  }, [run]);

  React.useEffect(() => {
    if (facultiesExpanded) {
      getFaculties();
    }
  }, [facultiesExpanded]);

  const [createState, sendCreateFaculty] = useAsyncFn(async (data: any) => {
    const res = await createFaculty(data);

    if (res.status >= 200 && res.status < 400) {
      getFaculties();
      setCreateFacultyOpen(false);
      toast.success(
        `${res.data.name} (${res.data.shortName}) был успешно добавлен в систему!`,
        { duration: 3000 }
      );
    }

    return res.data;
  });

  return (
    <Container>
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography variant={"h6"}>Панель Администратора</Typography>
          <Divider />
        </Stack>

        <Stack>
          <Accordion onChange={() => setFacultiesExpanded(!facultiesExpanded)}>
            <AccordionSummary>
              <Typography variant={"h6"}>Факультеты</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction={"row"}
                alignItems={"end"}
                justifyContent={"end"}
                sx={{ margin: 0.5 }}
              >
                <Dialog
                  open={createFacultyOpen}
                  handleClose={() => setCreateFacultyOpen(!createFacultyOpen)}
                  title={"Создать новую запись в списке факультетов"}
                  contentText={'Заполните формы и нажмите кнопку "Сохранить"'}
                  handleSubmit={() => setCreateFacultyOpen(!createFacultyOpen)}
                  showAction={false}
                >
                  <Stack spacing={1}>
                    <TextField
                      label={"Название"}
                      size={"small"}
                      onChange={(e) => setValue("name", e.target.value)}
                    />
                    <TextField
                      label={"Короткое название"}
                      size={"small"}
                      onChange={(e) => setValue("shortName", e.target.value)}
                    />
                    <LoadingButton
                      variant={"contained"}
                      size={"small"}
                      onClick={handleSubmit(sendCreateFaculty)}
                      loading={createState.loading}
                    >
                      Сохранить
                    </LoadingButton>
                  </Stack>
                </Dialog>
                <Button
                  variant={"contained"}
                  onClick={() => setCreateFacultyOpen(!createFacultyOpen)}
                >
                  Создать новый факультет
                </Button>
              </Stack>
              {faculties.loading ? (
                <CircularProgress />
              ) : !faculties.error ? (
                <TableContainer>
                  <Table component={Paper}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Сокращение</TableCell>
                        <TableCell>Изменить</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {faculties.value?.list?.length > 0
                        ? faculties.value?.list?.map((f: any) => (
                            <TableRow>
                              <TableCell>{f.id}</TableCell>
                              <TableCell>{f.name}</TableCell>
                              <TableCell>{f.shortName}</TableCell>
                              <TableCell>
                                <Dialog
                                  open={updateFacultyOpenId === f.id}
                                  handleClose={() =>
                                    setUpdateFacultyOpenId(null)
                                  }
                                  title={"Редактирование"}
                                  contentText={
                                    'Заполните форму и нажмите кнопку "Сохранить"'
                                  }
                                  handleSubmit={() =>
                                    setUpdateFacultyOpenId(null)
                                  }
                                  showAction={false}
                                >
                                  <UpdateFacultyForm
                                    name={f.name}
                                    shortName={f.shortName}
                                    id={f.id}
                                    callback={() => {
                                      setUpdateFacultyOpenId(null);
                                      getFaculties();
                                    }}
                                  />
                                </Dialog>
                                <IconButton
                                  color={"primary"}
                                  onClick={() => setUpdateFacultyOpenId(f.id)}
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
              ) : null}
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AdminPanel;
