import React, { useState } from "react";
import { Button, Stack, useMediaQuery } from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";
import Dialog from "../../../../components/Dialog";
import CreateSubjectForm from "../CreateSubjectForm";

type Props = {
  getSubjectsAgain: () => void;
};

const SettingsBar = ({ getSubjectsAgain }: Props) => {
  const isDesktop = useMediaQuery("(min-width:550px)");

  const [openCreate, setOpenCreate] = useState<boolean>(false);

  return (
    <Stack spacing={1}>
      <Button
        variant={"outlined"}
        endIcon={<CreateIcon />}
        onClick={() => setOpenCreate(true)}
        size={isDesktop ? "large" : "small"}
        fullWidth={!isDesktop}
      >
        Создать
      </Button>

      <CreateSubjectForm
        callback={() => {
          getSubjectsAgain();
          setOpenCreate(!openCreate);
        }}
        open={openCreate}
        handleOpen={() => setOpenCreate(!openCreate)}
      />
    </Stack>
  );
};

export default SettingsBar;
