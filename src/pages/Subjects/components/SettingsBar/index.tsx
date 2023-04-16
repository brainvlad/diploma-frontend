import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";
import Dialog from "../../../../components/Dialog";
import CreateSubjectForm from "../CreateSubjectForm";

const SettingsBar = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  return (
    <Stack spacing={1} direction={"row"}>
      <Button
        variant={"outlined"}
        endIcon={<CreateIcon />}
        onClick={() => setOpenCreate(true)}
      >
        Создать
      </Button>

      <CreateSubjectForm
        open={openCreate}
        handleOpen={() => setOpenCreate(!openCreate)}
      />
    </Stack>
  );
};

export default SettingsBar;
