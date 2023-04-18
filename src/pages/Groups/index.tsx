import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getUserGroups } from "../../http/groups";
import AccordionDetails from "@mui/material/AccordionDetails";
import * as _ from "lodash";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    if (groups.length === 0) {
      getUserGroups().then((res) => setGroups(res.data.list));
    }
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <Typography variant={"h3"}>Группы</Typography>
        <Divider />
        <div>
          {groups.length > 0
            ? Object.keys(_.groupBy(groups, "course")).map((key) => (
                <Accordion>
                  <AccordionSummary>
                    <Typography>{key} курс</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table size={"small"}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Курс</TableCell>
                            <TableCell>Группа</TableCell>
                            <TableCell>Подгруппа</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {_.groupBy(groups, "course")[key].map((g) => (
                            <TableRow>
                              <TableCell>{g.name}</TableCell>
                              <TableCell>{g.course}</TableCell>
                              <TableCell>{g.group}</TableCell>
                              <TableCell>{g.subGroup}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))
            : null}
        </div>
      </Stack>
    </Container>
  );
};

export default Groups;
