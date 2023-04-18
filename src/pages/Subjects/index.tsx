import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Container,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
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

const Groups = () => {
  const [subjects, setSubjects] = useState<Array<any>>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [showStudyPlan, setShowStudyPlan] = useState<boolean>(false);

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
          <Typography variant={"h3"}>Мои предметы</Typography>
          <Divider />
        </Box>
        <SettingsBar />
        <div>
          {!!subjects.length
            ? subjects.map((subject: any) => (
                <Accordion
                  onClick={() =>
                    getGroupsBySubjects(subject.id).then((res) =>
                      setClasses(res.data.list)
                    )
                  }
                  onChange={handleChange(subject.name)}
                  expanded={expanded === subject.name}
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
                        spacing={1}
                        direction={"row"}
                        alignItems={"center"}
                      >
                        <Link
                          href={"#"}
                          onClick={() => setShowStudyPlan(!showStudyPlan)}
                        >
                          <Typography>Учебный план</Typography>
                        </Link>
                        <IconButton
                          onClick={() =>
                            navigate(`/subjects/${subject.id}/study-plan`)
                          }
                        >
                          <OpenInNewIcon />
                        </IconButton>
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
