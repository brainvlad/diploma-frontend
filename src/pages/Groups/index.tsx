import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Button,
  Container,
  Divider,
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
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { createNewGroup, getAllGroups, getUserGroups } from "../../http/groups";
import AccordionDetails from "@mui/material/AccordionDetails";
import Dialog from "../../components/Dialog";
import * as _ from "lodash";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import GroupSettings from "./GroupSettings";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [expanded, setExpanded] = useState(0);

  const navigate = useNavigate();

  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (groups.length === 0) {
      getAllGroups().then((res) => setGroups(res.data.list));
    }

    if (myGroups.length === 0) {
      getUserGroups()
        .then((res) => {
          console.log(res.data);
          return res;
        })
        .then((res) => setMyGroups(res.data.list));
    }

    register("name");
    register("group");
    register("course");
    register("subGroup");
  }, [register]);

  const sendRequestForCreateNewGroup = (data: any) =>
    createNewGroup(data).then((res) => {
      if (res.status >= 200 && res.status < 400) {
        getAllGroups().then((res) => setGroups(res.data.list));
      }
    });

  return (
    <Container>
      <Stack spacing={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
          spacing={2}
        >
          <Typography variant={"h3"}>Группы</Typography>
          <Button
            variant={"outlined"}
            onClick={() => setCreateOpen(!createOpen)}
          >
            Новая группа
          </Button>
        </Stack>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Box>
              {groups.length > 0
                ? Object.keys(_.groupBy(groups, "course")).map((key, index) => (
                    <Accordion
                      expanded={index === expanded}
                      onChange={() => setExpanded(index)}
                    >
                      <AccordionSummary>
                        <Typography>{key} курс</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table size={"small"}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Имя</TableCell>
                                <TableCell>Курс</TableCell>
                                <TableCell>Группа</TableCell>
                                <TableCell>Подгруппа</TableCell>
                                <TableCell>Создал</TableCell>
                                <TableCell>Доступ</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {_.groupBy(groups, "course")[key].map((g) => (
                                <TableRow>
                                  <TableCell>{g.name}</TableCell>
                                  <TableCell>{g.course}</TableCell>
                                  <TableCell>{g.group}</TableCell>
                                  <TableCell>{g.subGroup}</TableCell>
                                  <TableCell>{g.createdName}</TableCell>
                                  <TableCell>
                                    {g.isShared ? (
                                      <CheckCircleIcon color={"success"} />
                                    ) : (
                                      <CancelIcon color={"error"} />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))
                : null}
            </Box>
          </Grid>

          <Grid item xs={5}>
            <Paper sx={{ padding: 1 }}>
              <Typography variant={"h6"} sx={{ margin: 1 }}>
                Мои группы
              </Typography>
              <Divider />
              <TableContainer>
                <Table size={"small"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Имя</TableCell>
                      <TableCell>Курс/Группа/Подгруппа</TableCell>
                      <TableCell>Настройка</TableCell>
                      <TableCell>Разрешить</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myGroups.map((g) => (
                      <TableRow>
                        <TableCell>{g.name}</TableCell>
                        <TableCell>
                          {g.course} / {g.group} / {g.subGroup}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color={"primary"}
                            onClick={() => navigate(g.id)}
                          >
                            <OpenInNewIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton color={"primary"}>
                            <ShareIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
      <Dialog
        open={createOpen}
        handleClose={() => setCreateOpen(!createOpen)}
        title={"Добавить группу"}
        contentText={""}
        handleSubmit={() => setCreateOpen(!createOpen)}
        showAction={false}
      >
        <Stack spacing={2}>
          <TextField
            label={"Имя (подпись) группы"}
            fullWidth
            size={"small"}
            onChange={(e) => setValue("name", e.target.value)}
          />
          <TextField
            label={"Курс"}
            fullWidth
            size={"small"}
            onChange={(e) => setValue("course", +e.target.value)}
          />
          <TextField
            label={"Группа"}
            fullWidth
            size={"small"}
            onChange={(e) => setValue("group", +e.target.value)}
          />
          <TextField
            label={"Подгруппа"}
            fullWidth
            size={"small"}
            onChange={(e) => setValue("subGroup", +e.target.value)}
          />
          <Button
            variant={"contained"}
            onClick={handleSubmit(sendRequestForCreateNewGroup)}
          >
            Сохранить
          </Button>
        </Stack>
      </Dialog>
    </Container>
  );
};

export default Groups;
