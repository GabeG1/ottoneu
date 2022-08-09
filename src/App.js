import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import './style/App.css';
import TextField from '@mui/material/TextField';
import { Button, Paper, Stack } from '@mui/material';
import * as yup from 'yup';
import { Navigate } from 'react-router-dom';

function App() {
  const [cookies, setCookie] = useCookies(["ottoneu"]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    (cookies.authToken !== undefined) || false
  );
  const [authToken, setAuthToken] = useState(cookies.authToken || "");
  const [username, setUsername] = useState(cookies.username || "");

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

              //setCookie("username", values.username, { path: "/" });
              //setCookie("authToken", values.teamName, { path: "/" });
              console.log("here")
              setUsername(values.username);
              setIsLoggedIn(true);
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
