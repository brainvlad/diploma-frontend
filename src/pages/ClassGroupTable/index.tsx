import React, { useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import {
  Button,
  Divider,
  Link,
  List,
  ListItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AddCircle as AddIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getGradesTableByClass, shareClassTable } from "../../http/classes";
import CellWithGrade from "./components/CellWithGrade";
import Dialog from "../../components/Dialog";
import CreateStatisticsForm from "./components/CreateStatisticsForm";
import { useAsyncFn } from "react-use";
import { getListByClassId } from "../../http/statistics";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { toast } from "react-hot-toast";

const ClassGroupTable = () => {
  const isDesktop = useMediaQuery("(min-width:550px)");
  const { classId } = useParams();
  const [subjectName, setSubjectName] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [table, setTable] = useState<Array<any>>([]);
  const [plan, setPlan] = useState<Array<any>>([]);
  const [statistics, setStatistics] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [statisticsState, run] = useAsyncFn(
    async (classId: string) => {
      const res = await getListByClassId(classId);
      return res.data.list;
    },
    [classId]
  );

  const [shareTableState, shareTableRun] = useAsyncFn(
    async (classId: string) => {
      const res = await shareClassTable(classId);

      return res.data;
    },
    [classId]
  );

  useEffect(() => {
    if (classId) {
      getGradesTableByClass(classId)
        .then((res) => {
          setGroupName(res.data.groupName);
          setSubjectName(res.data.subjectName);
          setTable(res.data.table);
          setIsShared(res.data.isShared);
          setPlan(
            res.data.plan.sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order
            )
          );
        })
        .then(() => run(classId));
    }
  }, [classId]);

  return (
    <Container>
      <Stack spacing={3}>
        <Paper sx={{ padding: 1 }}>
          <Stack
            direction={isDesktop ? "row" : "column"}
            justifyContent={isDesktop ? "space-between" : "start"}
            alignItems={isDesktop ? "center" : "start"}
            {...(isDesktop ? {} : { spacing: 1.5 })}
          >
            <Stack spacing={1}>
              <Typography variant={"h5"}>{subjectName}</Typography>
              <Typography variant={"caption"}>Группа: {groupName}</Typography>
            </Stack>

            <Typography color={!!isShared ? "green" : "orangered"}>
              {isShared
                ? "Доступ открыт для чтения"
                : "Данные видны только Вам"}
            </Typography>
          </Stack>
        </Paper>

        <Stack
          direction={isDesktop ? "row" : "column"}
          justifyContent={isDesktop ? "space-between" : "start"}
        >
          <Button
            variant={"contained"}
            onClick={handleClick}
            fullWidth={!isDesktop}
          >
            Посмотреть статистику
          </Button>
          <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              <ListItem>
                <Button
                  variant={"text"}
                  startIcon={<AddIcon />}
                  onClick={() => setStatistics(!statistics)}
                >
                  Создать новую
                </Button>
              </ListItem>
              <Divider />
              {!statisticsState.loading &&
              !statisticsState.error &&
              statisticsState.value?.length > 0
                ? statisticsState.value?.map((s: any) => (
                    <ListItem>
                      <Link
                        href={`/group-statistics/${s.id}`}
                        target={"_blank"}
                      >
                        <Typography>{s.title}</Typography>
                      </Link>
                    </ListItem>
                  ))
                : null}
            </List>
          </Popover>
          <Dialog
            open={statistics}
            handleClose={() => setStatistics(!statistics)}
            title={"Посмотреть статистику"}
            contentText={""}
            handleSubmit={() => setStatistics(!statistics)}
            showAction={false}
          >
            <CreateStatisticsForm
              studyPlan={plan.map((p) => ({
                id: p.id,
                topic: p.topic,
                order: p.order,
              }))}
              classId={classId!}
            />
          </Dialog>

          <ConfirmationDialog
            handleClose={() => setShareOpen(!shareOpen)}
            handleAgree={() => {
              if (classId) {
                shareTableRun(classId).then(() => {
                  getGradesTableByClass(classId)
                    .then((res) => {
                      setGroupName(res.data.groupName);
                      setSubjectName(res.data.subjectName);
                      setTable(res.data.table);
                      setIsShared(res.data.isShared);
                      setPlan(
                        res.data.plan.sort(
                          (a: { order: number }, b: { order: number }) =>
                            a.order - b.order
                        )
                      );
                    })
                    .then(() => run(classId));
                });
              }
            }}
            open={shareOpen}
            content={
              statisticsState.value?.isShared
                ? "Вы соглашаетесь с тем, что сейчас данные в таблице больше не будут доступны всем пользователям для чтения"
                : "Вы соглашаетесь с тем, что сейчас данные в таблице станут доступны всем пользователям для чтения"
            }
            title={"Настройка доступа к таблице"}
          />
          <Button
            variant={"text"}
            startIcon={<ShareIcon />}
            onClick={() => setShareOpen(!shareOpen)}
            fullWidth={!isDesktop}
          >
            {isShared ? "Закрыть доступ" : "Открыть доступ"}
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table size={"small"}>
            <TableHead>
              {isShared ? (
                <TableRow>
                  <TableCell>
                    <Button
                      variant={"text"}
                      startIcon={<ContentCopyIcon />}
                      onClick={() => {
                        const link = `http://localhost:3000/shared/class-table/${classId}`;
                        navigator.clipboard.writeText(link);
                        toast.success(
                          `Ссылка на таблицу скопирована в буфер обмена: ${link}`,
                          { duration: 3000 }
                        );
                      }}
                      size={"small"}
                    >
                      Копировать ссылку
                    </Button>
                  </TableCell>
                  <TableCell colSpan={plan.length + 1}></TableCell>
                </TableRow>
              ) : null}
              <TableRow>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    minWidth: isDesktop ? "270px" : "200px",
                  }}
                >
                  Студент
                </TableCell>
                {plan && plan.length
                  ? plan
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <Tooltip title={item.topic}>
                          <TableCell sx={{ minWidth: "40px" }}>
                            {item.order}
                          </TableCell>
                        </Tooltip>
                      ))
                  : null}
                <TableCell
                  sx={{
                    position: "sticky",
                    backgroundColor: "#ececec",
                    fontWeight: "bold",
                    right: 0,
                  }}
                >
                  Итого
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table && table.length
                ? table.map((row) => (
                    <TableRow>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          minWidth: isDesktop ? "270px" : "150px",
                          background: "#fff",
                        }}
                      >
                        {isDesktop
                          ? row.studentName
                          : `${row.studentName.split(" ")[0]} ${
                              row.studentName.split(" ")[1][0]
                            }. ${row.studentName.split(" ")[2][0]}.`}
                      </TableCell>
                      {row.grade && plan?.length
                        ? plan.map((p) => (
                            <CellWithGrade
                              setGradeCallBack={() => {
                                getGradesTableByClass(classId!)
                                  .then((res) => {
                                    setGroupName(res.data.groupName);
                                    setSubjectName(res.data.subjectName);
                                    setTable(res.data.table);
                                    setIsShared(res.data.isShared);
                                    setPlan(
                                      res.data.plan.sort(
                                        (
                                          a: { order: number },
                                          b: { order: number }
                                        ) => a.order - b.order
                                      )
                                    );
                                  })
                                  .then(() => run(classId!));
                              }}
                              grade={row.grade[p.id] || null}
                              studentId={row.studentId}
                              planItemId={p.id}
                              criterias={p.criteria}
                              topic={p.topic || ""}
                              studentName={
                                isDesktop
                                  ? row.studentName
                                  : `${row.studentName.split(" ")[0]} ${
                                      row.studentName.split(" ")[1][0]
                                    }. ${row.studentName.split(" ")[2][0]}.`
                              }
                            />
                          ))
                        : null}
                      <TableCell
                        sx={{
                          position: "sticky",
                          backgroundColor: "#ececec",
                          fontWeight: "bold",
                          right: 0,
                        }}
                      >
                        {row.summary}
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

export default ClassGroupTable;
