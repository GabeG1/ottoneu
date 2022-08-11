import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import './style/App.css';
import TextField from '@mui/material/TextField';
import { Button, Paper, Stack } from '@mui/material';
import * as yup from 'yup';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


axios.defaults.withCredentials = true

function App() {
  const [cookies, setCookie] = useCookies(["ottoneu"]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    (cookies.authToken !== undefined) || false
  );
  const [authToken, setAuthToken] = useState(cookies.authToken || "");
  const [username, setUsername] = useState("");


  useEffect(() => {
    // declare the async data fetching function


    // make sure to catch any error

  }, []);


  const validationSchema = yup.object({
    username: yup
      .string('Enter your email')
      .required('username is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  if (isLoggedIn) {
    return <Navigate to='/team' />
  }
  return (
    <div className="App">
      <Paper className="Floating-form" elevation={12}>
        <Stack spacing={3}>
          <h1>Welcome to the ottoneu Helper!</h1>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            /*validate={async (values) => {
              //const regex = new RegExp("[0-9]{4}$");
              const errors = {};
              if (!values.username) {
                errors.username = "Required";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}*/

            onSubmit={async (values, { resetForm }) => {


              const login = async () => {

                console.log("starting")
                const formData = new FormData();
                console.log(process.env)
                const userInfo = {
                  'username': values.username,
                  'password': values.password,
                }
                Object.keys(userInfo).forEach(key => formData.append(key, userInfo[key]));
                // get the data from the api
                const data = await axios.post(`http://localhost:5000/login`, formData, {
                  headers: {
                    //'content-type': 'application/x-www-form-urlencoded',
                    // "Access-Control-Allow-Origin": "*",
                    //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                  }
                });
                console.log("finished")
                setAuthToken(cookies._ga_R079V0VW20)
                setIsLoggedIn(true);
              };


              // call the function
              login().catch(console.error);
            }}
          >
            {({ isSubmitting, errors, touched, values, handleChange }) => (
              <Form className='floating-form'>
                <Stack spacing={2}>
                  <TextField
                    id="username"
                    name="username"
                    label="username"
                    type="username"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    onChange={handleChange}
                    value={values.username}
                  />

                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    onChange={handleChange}
                    value={values.password}
                  />

                  <Button variant='outlined' type="submit" disabled={isSubmitting}
                    style={{
                      'width': 10, 'marginLeft': 'auto',
                      'marginRight': 'auto',
                    }}
                  >
                    Login!
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Paper>
    </div >
  );
}

export default App;
