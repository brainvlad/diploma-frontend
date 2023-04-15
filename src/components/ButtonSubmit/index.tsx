import React from "react";
import { Button } from "@mui/material";

type Props = {
    label: string;
    onClick: () => void;
};

const ButtonSubmit: React.FC<Props> = (props: Props) => {
    return (
        <Button
            color={"primary"}
            variant={"contained"}
            type={"submit"}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    );
};

export default ButtonSubmit;
