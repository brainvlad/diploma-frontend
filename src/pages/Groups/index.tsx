import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Container} from "@mui/material";
import {useEffect, useState} from "react";
import {GroupItem} from "../../types/groups";
import {getUserGroups} from "../../http/groups";
import {getUserSubjects} from "../../http/subjects";
import GroupsItem from "./components/GroupItem";
import {getGroupsBySubjects} from "../../http/classes";

const Groups = () => {

    const [subjects, setSubjects] = useState<Array<any>>([]);
    const [groups, setGroups] = useState<GroupItem[]>([]);

    const [expanded, setExpanded] = useState<string | false>(false);

    useEffect(() => {
        getUserSubjects().then(res => setSubjects(res.data.list))
    }, [])

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <Container>
            {!!subjects.length ? (
                subjects.map((subject: any) => (
                    <Accordion
                        onClick={() => getGroupsBySubjects(subject.id).then((res) => setGroups(res.data.list))}
                        onChange={handleChange(subject.name)}
                        expanded={expanded === subject.name}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{subject.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {!!groups && groups.length ?
                                groups.map(g => <GroupsItem id={g.id} name={g.name} description={g.description}/>)
                                : null}
                        </AccordionDetails>
                    </Accordion>))
            ) : null}
        </Container>
    );
}

export default Groups;
