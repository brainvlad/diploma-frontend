import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  type?: "text" | "password";
  control: any;
  value?: string;
};

const FormInputText: React.FC<Props> = (props) => {
  return (
    <Controller
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <TextField
          variant={"outlined"}
          label={props.label}
          size={"small"}
          onChange={onChange}
          value={props.value}
          type={props.type}
          focused={!!props.value}
          fullWidth
        />
      )}
      name={props.name}
    />
  );
};

export default FormInputText;
