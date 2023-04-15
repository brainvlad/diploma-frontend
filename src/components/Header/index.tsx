import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {useStyles} from "./styled";

const Header: React.FC = () => {
    // @ts-ignore
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar variant="dense" className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    Е-Кафедра
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
