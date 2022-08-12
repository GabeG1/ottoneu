import Table from 'react-bootstrap/Table';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import '../style/App.css';
import '../style/Team.css';
import { Paper } from '@mui/material';


function Team() {

    const [teamData, setTeamData] = useState([]);
    const [teamName, setTeamName] = useState();
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
            setTeamData(JSON.parse(data.data['team']));
            setTeamName(data.data['teamName'])
        }

        fetchTeam().catch(console.error);
    }, []);


    return (
        <div className="App">

            <Paper className='team-table-container' elevation={12}>
                <header className='team-header'>
                    Welcome {teamName}!
                </header>
                <Table striped responsive
                    aria-label="simple table"
                    className="team-table"
                >
                    <thead>
                        <tr>
                            {teamData && teamData[0] && Object.keys(teamData[0]).map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {teamData && teamData.map((row) => (
                            <tr
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <td component="td">
                                    {row.Player}
                                </td>
                                <td >{row.POS}</td>
                                <td >{row.Salary}</td>
                                <td >{row.Bye}</td>
                                <td >{row['2021 Pts']}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Paper>

        </div>
    )
}

export default Team;