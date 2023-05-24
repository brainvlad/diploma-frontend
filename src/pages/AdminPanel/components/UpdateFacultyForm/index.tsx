import React, { useEffect } from "react";
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { updateFaculty } from "../../../../http/faculty";
import { toast } from "react-hot-toast";

type Props = {
  name: string;
  shortName: string;
  id: string;
  callback: () => void;
};

const UpdateFacultyForm = ({ name, shortName, id, callback }: Props) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    register("id", { value: id });
    register("name", { value: name });
    register("shortName", { value: name });
  }, [register]);

  const [state, run] = useAsyncFn(async (data: any) => {
    try {
      const res = await updateFaculty(data);

      if (res.status >= 200 && res.status < 400) {
        toast.success("Данные успешно изменены!");
      }

      return res.data;
    } catch (e) {
    } finally {
      callback();
    }
  });

  return (
    <Stack spacing={1}>
      <TextField
        label={"Название"}
        size={"small"}
        onChange={(e) => setValue("name", e.target.value)}
        defaultValue={name}
      />
      <TextField
        label={"Короткое название"}
        size={"small"}
        onChange={(e) => setValue("shortName", e.target.value)}
        defaultValue={shortName}
      />
      <LoadingButton
        variant={"contained"}
        size={"small"}
        onClick={handleSubmit(run)}
        loading={state.loading}
        defaultValue={shortName}
      >
        Сохранить
      </LoadingButton>
    </Stack>
  );
};

export default UpdateFacultyForm;
