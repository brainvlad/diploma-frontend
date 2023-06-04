import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Alert,
  Button,
  Container,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getUserSubjects } from "../../http/subjects";
import GroupsItem from "./components/GroupItem";
import { getGroupsBySubjects } from "../../http/classes";
import SettingsBar from "./components/SettingsBar";
import StudyPlanList from "./components/StudyPlanList";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import NewClassForm from "./components/NewClassForm";
import Dialog from "../../components/Dialog";

const Groups = () => {
  const isDesktop = useMediaQuery("(min-width:550px)");
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [showStudyPlan, setShowStudyPlan] = useState<boolean>(false);
  const [createNewClassOpen, setCreateNewClassOpen] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    getUserSubjects().then((res) => setSubjects(res.data.list));
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Container>
      <Stack spacing={3}>
        <Box sx={{ padding: 1 }}>
          <Stack
            direction={isDesktop ? "row" : "column"}
            justifyContent={"space-between"}
            alignItems={isDesktop ? "center" : "start"}
            spacing={1}
          >
            <Typography variant={"h3"}>Мои предметы</Typography>

            <SettingsBar
              getSubjectsAgain={() =>
                getUserSubjects().then((res) => setSubjects(res.data.list))
              }
            />
          </Stack>
          <Divider />
        </Box>
        <div>
          {subjects.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
                justifyContent: "center",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <Alert
                severity={"info"}
                sx={{
                  width: "550px",
                  border: "1px solid #1893D5",
                }}
              >
                Вы наверное тут в первый раз, поэтому тут ничего нет. Вы можете
                создать новый предмет вызвав окно с формой кликом по кнопке
                "Создать". Заполните данные о предмете: название, короткое
                название (алиас). Это несложно.
              </Alert>
            </Box>
          ) : null}
          {!!subjects.length
            ? subjects.map((subject: any) => (
                <Accordion
                  onClick={() =>
                    getGroupsBySubjects(subject.id).then((res) =>
                      setClasses(res.data.list)
                    )
                  }
                  onChange={handleChange(subject.id)}
                  expanded={expanded === subject.id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{subject.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Stack
                        spacing={2}
                        direction={isDesktop ? "row" : "column"}
                        alignItems={isDesktop ? "center" : "start"}
                        justifyContent={"space-between"}
                      >
                        <Button
                          onClick={() =>
                            navigate(`/subjects/${subject.id}/study-plan`)
                          }
                          endIcon={<OpenInNewIcon />}
                          fullWidth={!isDesktop}
                        >
                          Учебный план
                        </Button>
                        <Dialog
                          open={createNewClassOpen === subject.id}
                          handleClose={() => setCreateNewClassOpen(null)}
                          showAction={false}
                          title={"Создать новый класс"}
                          contentText={
                            "Выберите группу, с которой будет создан класс"
                          }
                          handleSubmit={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                        >
                          <NewClassForm
                            subjectId={subject.id}
                            subjectName={subject.name}
                            open={createNewClassOpen === subject.id}
                            callBack={() => {
                              setCreateNewClassOpen(null);
                              getGroupsBySubjects(subject.id).then((res) =>
                                setClasses(res.data.list)
                              );
                            }}
                          />
                        </Dialog>
                        <Button
                          variant={"contained"}
                          onClick={() => setCreateNewClassOpen(subject.id)}
                          fullWidth={!isDesktop}
                        >
                          Создать новый класс
                        </Button>
                      </Stack>
                      <div style={{ margin: "10px 0" }}>
                        {showStudyPlan ? (
                          <StudyPlanList
                            open={showStudyPlan && expanded === subject.name}
                            subjectId={subject.id}
                          />
                        ) : null}
                      </div>
                    </Stack>
                    {!!classes && classes.length
                      ? classes.map((c) => {
                          return (
                            <GroupsItem
                              classId={c.id}
                              id={c.group.id}
                              name={c.group.name}
                              description={c.group.description}
                            />
                          );
                        })
                      : null}
                  </AccordionDetails>
                </Accordion>
              ))
            : null}
        </div>
      </Stack>
    </Container>
  );
};

export default Groups;
