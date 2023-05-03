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
  Stack,
  Typography,
} from "@mui/material";
import { createNewClass } from "../../../../http/classes";

type Props = {
  subjectId: string;
  open: boolean;
  subjectName: string;
  callBack: () => void;
};

const NewClassForm = ({ subjectId, open, subjectName, callBack }: Props) => {
  const [getGroupsState, getGroupsSubmit] = useAsyncFn(async () => {
    const res = await getAllGroups();

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
      getGroupsSubmit();
    }
  }, [open]);

  if (!getGroupsState.error && !getGroupsState.loading) {
    return (
      <Stack spacing={2} sx={{ margin: 1.5, width: 400 }}>
        <Typography>Предмет: {subjectName}</Typography>
        <Typography>Группа: {selectedGroupName || "Нет выбрана"}</Typography>
        <Divider />
        <List
          sx={{
            maxHeight: 300,
            // border: "1px solid rgba(0,0,0,0.6)",
            bgcolor: "background.info",
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {getGroupsState.value?.list?.length > 0
            ? getGroupsState.value.list.map((g: any) => (
                <ListItem disablePadding>
                  <ListItemButton
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
                      {g.name} (Курс: {g.course}, Группа: {g.group}, Подгруппа:{" "}
                      {g.subGroup})
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
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
