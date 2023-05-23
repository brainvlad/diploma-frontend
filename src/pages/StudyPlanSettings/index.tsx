import React, { useEffect, useState } from "react";
import { getStudyPlan } from "../../http/subjects";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useAsyncFn } from "react-use";
import CriteriaCreateForm from "./CriteriaCreateForm";
import { removeItem } from "../../http/study-plan";

const StudyPlanSettings = () => {
  const isDesktop = useMediaQuery("(min-width: 900px");
  const { subjectId } = useParams();
  const [plan, setPlan] = useState<any[]>([]);
  const [openCriteriaId, setOpenCriteriaId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [createNewItem, setCreateNewItem] = useState(false);

  const [state, run] = useAsyncFn(async (sId) => {
    const res = await getStudyPlan(sId);

    return {
      items: res.data.plan.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      ),
      subject: res.data.subject,
    };
  });

  useEffect(() => {
    if (subjectId) {
      run(subjectId);
    }
  }, [subjectId]);

  if (!state.loading && !state.error)
    return (
      <Container>
        <Stack spacing={2}>
          <Stack
            direction={isDesktop ? "row" : "column"}
            {...(isDesktop ? {} : { spacing: 1.5 })}
            justifyContent={isDesktop ? "space-between" : "start"}
          >
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href={"/subjects"}>
                <Typography>Мои предметы</Typography>
              </Link>
              <Typography color={"text.primary"}>
                {state.value?.subject?.name}
              </Typography>
            </Breadcrumbs>

            <Dialog
              open={createNewItem}
              handleClose={() => setCreateNewItem(false)}
              title={"Добавить тему"}
              contentText={"Заполните данные новой темы"}
              handleSubmit={() => setCreateNewItem(false)}
              showAction={false}
            >
              <CriteriaCreateForm
                planItemId={null}
                open={createNewItem}
                callback={() => {
                  run(subjectId);
                  setCreateNewItem(false);
                }}
                subjectId={subjectId}
              />
            </Dialog>
            <Button
              variant={"contained"}
              onClick={() => setCreateNewItem(true)}
              fullWidth={!isDesktop}
            >
              Добавить
            </Button>
          </Stack>

          {state.value?.items?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size={"small"}>
                <TableBody>
                  {state.value?.items?.map((p: any) => (
                    <TableRow>
                      <TableCell>
                        {p.order} {p.topic}
                      </TableCell>
                      <TableCell sx={{ width: 150 }}>
                        <Stack direction={"row"}>
                          <Dialog
                            open={openCriteriaId === p.id}
                            handleClose={() => setOpenCriteriaId(null)}
                            title={`Тема: ${p.topic}`}
                            contentText={
                              "Настройка критерив оценки выполнения задания"
                            }
                            handleSubmit={() => {
                              setCreateNewItem(false);
                            }}
                            showAction={false}
                          >
                            <CriteriaCreateForm
                              planItemId={p.id}
                              open={openCriteriaId === p.id}
                              callback={() => {
                                setOpenCriteriaId(null);
                                run(subjectId);
                              }}
                            />
                          </Dialog>
                          <ConfirmationDialog
                            handleClose={() => setDeleteConfirm(p.id)}
                            handleAgree={() =>
                              removeItem(p.id).then(() => run(subjectId))
                            }
                            open={deleteConfirm === p.id}
                            content={`Вы удалите информацию о теме ${p.order} - ${p.topic}. Данные оценок студентов по данной теме также будут удалены.`}
                            title={"Вы уверены?"}
                          />
                          <IconButton
                            color={"primary"}
                            onClick={() => {
                              setOpenCriteriaId(p.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color={"error"}
                            onClick={() => setDeleteConfirm(p.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              <Alert severity={"info"} sx={{ border: "1px solid #1893D5" }}>
                Предмет с названием{" "}
                <u>
                  <b>"{state.value?.subject?.name}"</b>
                </u>{" "}
                уже добавлен и Вы можете с ним работать. На этой странице Вы
                должны заполнить учебный план предмета. Под учебным планом
                иммется ввиду список тем, также в каждой теме Вы можете
                объявиться критерии и коэффициенты, по которым будет ставиться
                итоговая оценка студенту за выполнение работы
              </Alert>
            </Box>
          )}
        </Stack>
      </Container>
    );

  return <h1>no data</h1>;
};

export default StudyPlanSettings;
