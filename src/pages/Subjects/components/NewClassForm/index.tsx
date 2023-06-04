import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { getAllGroups, getGroupById } from "../../../../http/groups";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Stack,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { createNewClass } from "../../../../http/classes";
import { getAllFaculties } from "../../../../http/faculty";

type Props = {
  subjectId: string;
  open: boolean;
  subjectName: string;
  callBack: () => void;
};

const NewClassForm = ({ subjectId, open, subjectName, callBack }: Props) => {
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedGroupNum, setSelectedGroupNum] = useState<number | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<number | null>(null);

  const [getGroupsState, getGroupsSubmit] = useAsyncFn(async () => {
    const res = await getAllGroups();

    return res.data;
  });
  const [faculties, getFaculties] = useAsyncFn(async () => {
    const res = await getAllFaculties();
    return res.data;
  });
  const [getGroupByIdState, getGroupByIdSubmit] = useAsyncFn(
    async (groupId) => {
      const res = await getGroupById(groupId);

      return res.data;
    }
  );

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState("");

  useEffect(() => {
    if (subjectId && open) {
      getFaculties();
      getGroupsSubmit();
    }
  }, [open]);

  if (!getGroupsState.error && !getGroupsState.loading) {
    return (
      <Stack spacing={2} sx={{ margin: 1.5, width: 400 }}>
        <Typography>Предмет: {subjectName}</Typography>
        <Typography>Группа: {selectedGroupName || "Нет выбрана"}</Typography>
        <Divider />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={
            !faculties.loading && !faculties.error && faculties.value?.list
              ? faculties.value.list.map((f: any) => ({
                  label: f.name,
                  id: f.id,
                }))
              : []
          }
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Факультет" fullWidth size={"small"} />
          )}
          onChange={(e, newValue: any) => {
            setSelectedFaculty(!newValue?.id ? null : newValue?.id);
            // console.log({ e, newValue });
          }}
        />
        <Stack
          direction={"row"}
          sx={{ marginTop: 1.5 }}
          justifyContent={"space-between"}
        >
          <TextField
            size={"small"}
            label={"Курс"}
            sx={{ width: "100px" }}
            inputProps={{ min: 1, max: 6 }}
            onChange={(e) => setSelectedCourse(+e.target.value)}
          />
          <TextField
            size={"small"}
            label={"Группа"}
            sx={{ width: "100px" }}
            inputProps={{ min: 1, max: 100 }}
            onChange={(e) => setSelectedGroupNum(+e.target.value)}
          />
          <TextField
            size={"small"}
            label={"Подгруппа"}
            sx={{ width: "150px" }}
            inputProps={{ min: 1, max: 3 }}
            onChange={(e) => setSelectedSubGroup(+e.target.value)}
          />
        </Stack>
        <List
          sx={{
            maxHeight: 300,
            // border: "1px solid rgba(0,0,0,0.6)",
            bgcolor: "background.info",
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {/*<Autocomplete*/}
          {/*  disablePortal*/}
          {/*  id="combo-box-demo"*/}
          {/*  options={*/}
          {/*    !getGroupsState.loading &&*/}
          {/*    getGroupsState.error &&*/}
          {/*    (getGroupsState?.value as any).list?.length > 0*/}
          {/*      ? (getGroupsState?.value as any).list.map((g: any) => {*/}
          {/*          return {*/}
          {/*            label: `${g.name} (Курс: ${g.course}, Группа: ${g.group}, Подгруппа: ${g.subGroup})`,*/}
          {/*            value: g.id,*/}
          {/*          };*/}
          {/*        })*/}
          {/*      : []*/}
          {/*  }*/}
          {/*  sx={{ width: 300 }}*/}
          {/*  renderInput={(params) => <TextField {...params} label="Группа" />}*/}
          {/*/>*/}

          {getGroupsState.value?.list?.length > 0
            ? getGroupsState.value.list
                .filter((g: any) =>
                  selectedFaculty ? g.facultyId === selectedFaculty : true
                )
                .filter((g: any) =>
                  selectedCourse ? g.course === selectedCourse : true
                )
                .filter((g: any) =>
                  selectedGroupNum ? g.group === selectedGroupNum : true
                )
                .filter((g: any) =>
                  selectedSubGroup ? g.subGroup === selectedSubGroup : true
                )
                .map((g: any) => (
                  <Tooltip title={`${g.studentsCount} студентов в группе`}>
                    <ListItem disablePadding>
                      <ListItemButton
                        disabled={g.studentsCount === 0}
                        onClick={() => {
                          setSelectedGroup(g.id);
                          getGroupByIdSubmit(g.id).then((data) =>
                            setSelectedGroupName(
                              `${data.name} (Курс: ${data.course}, Группа: ${data.group}, Подгруппа: ${data.subGroup})`
                            )
                          );
                        }}
                      >
                        <ListItemText>
                          {g.name} (Курс: {g.course}, Группа: {g.group},
                          Подгруппа: {g.subGroup})
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                ))
            : null}
        </List>
        <Divider />
        <Button
          disabled={!selectedGroup}
          variant={"contained"}
          onClick={() => {
            if (selectedGroup) {
              createNewClass({ subjectId, groupId: selectedGroup });
              callBack();
            }
          }}
        >
          Сохранить
        </Button>
      </Stack>
    );
  }

  if (getGroupsState.loading) {
    return (
      <Container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return <h1>{subjectId}</h1>;
};

export default NewClassForm;
