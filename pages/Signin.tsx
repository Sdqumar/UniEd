import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Button, makeStyles, Typography, Paper } from "@material-ui/core";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext } from "react";
import AuthContext from "@/components/AuthContext";
import firebase from "../config/firebase-config";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import FormikControl from "@/components/Formik/FormikControl";
import Head from "next/head";

const ForgetPassword = dynamic(() => import("components/ForgetPassword"));

const useStyles = makeStyles((theme) => ({
  login: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "2rem",
    flexDirection: "column",
    "& .MuiFormControl-root": {
      minWidth: "15rem",
      margin: "10px",
    },
  },
  forget: {
    display: "none",
    zIndex: 10,
    position: "absolute",
    width: "100%",
    minHeight: "content-fit",
    padding: "1rem",

    "& .MuiButton-contained": {
      color: "red",
    },
  },
}));

function SignIn() {
  const classes = useStyles();
  const initialValues = {
    email: "",
    input: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
  });

  const router = useRouter();

  type values = {
    email: string;
    password: string;
  };
  const [,setCurrentUser] = useContext(AuthContext);
  
  const onSubmit = async (values: values, actions) => {
    const { getAuth, signInWithEmailAndPassword } = await import(
      "firebase/auth"
    );
    const auth = getAuth(firebase);

    actions.setSubmitting(true);

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((user) => {
        
        Cookies.set("user",JSON.stringify(user.user));
        setCurrentUser(user.user);
        toast.success("Login Sucessfully!");
         router.push("/");
      })
      .catch((error) => {
        toast.error("Invalid Username or Password!");
      });
  };
  const boxRef = useRef(null);

  const onClick = () => {
    boxRef.current.style.display = "block";
  };
  const closeBox = () => {
    boxRef.current.style.display = "none";
  };
  return (
    <>
      <Head>
        <title>Sign In | Academic Plug </title>
      </Head>

      <Paper className={classes.forget} ref={boxRef}>
        <button className="closeBtn" onClick={closeBox}>
          Close
        </button>
        <ForgetPassword />
      </Paper>
      <Box className={classes.login}>
        <Typography variant="h4">SIGN IN</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Box>
                  <FormikControl
                    control="chakraInput"
                    type="email"
                    label="Email"
                    name="email"
                  />
                </Box>
                <Box>
                  <FormikControl
                    control="chakraInput"
                    type="password"
                    label="Password"
                    name="password"
                  />
                </Box>
                <Toaster position="top-center" />

                <Box>
                  <Button onClick={onClick}>Forget Password?</Button>
                </Box>
                <Box mt="10px" textAlign="center">
                  <Button
                    variant="outlined"
                    type="submit"
                    name='submit'
                    disabled={!formik.isValid}
                  >
                    Submit
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
}

export default SignIn;
