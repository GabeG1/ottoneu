import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import '../style/App.css';
import '../style/Team.css';


function Team() {

    const [teamData, setTeamData] = useState([]);
    const [cookies, setCookie] = useCookies(["ottoneu"]);

    useEffect(() => {

        const fetchTeam = async () => {

            const formData = new FormData();
            console.log("cookies", cookies)
            const iCookies = cookies
            Object.keys(iCookies).forEach(key => formData.append(key, iCookies[key]));
            // get the data from the api
            const data = await axios.post(`http://localhost:5000/team`, formData, {
                headers: {
                }
            });
            console.log(data.data);
            setTeamData(data.data);
        }

        fetchTeam().catch(console.error);
    }, []);


    return (
        <div className="App">

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {teamData && teamData[0] && Object.keys(teamData[0]).map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamData && teamData.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.Player}
                                </TableCell>
                                <TableCell >{row.POS}</TableCell>
                                <TableCell >{row.Salary}</TableCell>
                                <TableCell >{row.Bye}</TableCell>
                                <TableCell >{row['2021 Pts']}</TableCell>
                               
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}

export default Team;