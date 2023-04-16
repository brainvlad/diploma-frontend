import React from "react";
import {Grid, Paper, Typography} from "@mui/material";

type Props = {
    id: string;
    name: string;
    description: string;
}


const ClassItem = ({id, name, description}: Props) => {
    return <Paper style={{padding: "14px 24px"}}>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Typography fontSize={"15px"}>{name}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography fontSize={"15px"}>{description}</Typography>
            </Grid>
        </Grid>
    </Paper>
};

export default ClassItem;
