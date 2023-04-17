import React, { useEffect, useState } from "react";
import { getStudyPlan } from "../../http/subjects";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import CriteriaSettingsForm from "./CriteriaSettingsForm";
import Dialog from "../../components/Dialog";

const StudyPlanSettings = () => {
  const { subjectId } = useParams();
  const [plan, setPlan] = useState<any[]>([]);
  const [openCriteria, setOpenCriteria] = useState("");

  useEffect(() => {
    if (subjectId) {
      getStudyPlan(subjectId).then((res) =>
        setPlan(
          res.data.plan.sort(
            (a: { order: number }, b: { order: number }) => a.order - b.order
          )
        )
      );
    }
  }, [subjectId]);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Тема</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plan.length
              ? plan.map((p) => (
                  <TableRow>
                    <TableCell sx={{ width: 20 }}>{p.order}</TableCell>
                    <TableCell>{p.topic}</TableCell>
                    <TableCell align={"right"} sx={{ width: 300 }}>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Button
                          variant={"outlined"}
                          onClick={() => setOpenCriteria(p.id)}
                        >
                          Критерии оценки
                        </Button>

                        <Dialog
                          open={openCriteria === p.id}
                          handleClose={() => setOpenCriteria("")}
                          title={"Критерии"}
                          contentText={"Текст"}
                          handleSubmit={() => setOpenCriteria("")}
                          showAction={false}
                        >
                          <CriteriaSettingsForm
                            planItemId={p.id}
                            open={openCriteria === p.id}
                          />
                        </Dialog>

                        <IconButton>
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
    </Container>
  );
};

export default StudyPlanSettings;
