<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../components/Formik/FormikControl";
import { Flex, Spacer, Box, Button } from "@chakra-ui/react";
import firebase from "../config/firebase-config";

//initialize firestore
const firestore = firebase.firestore();

export async function getStaticProps(context) {
  const dataref = await firestore.collection("Schools").get();

  const data = dataref.docs.map((doc) => doc.data());
  const id = dataref.docs.map((doc) => doc.id);
  return {
    props: {
      data,
      id,
    },
  };
}

function AddDepartment(props) {
  let schoolName = [];
  const getSchoolOptions = props.id.forEach((id) => {
    schoolName.push({ key: id, value: id });
  });

  const schoolOptions = [
    { key: "Select your School", value: "" },
    ...schoolName,
  ];

  interface values {
    department?: string;
    school?: string;
    faculty?: string;
  }
  const [formikValue, setFormikValue] = useState<values>({});
  // this function is been passed to the render props formik component, which then call it and pass the state of formikvalues like method as props

  const getFormikValue = (value: values) => {
    setFormikValue(value);
  };

  let facultyName = [];

  props.data.forEach((data) => {
    if (formikValue.school === data.Name) {
      data.Facluties.forEach((item) => {
        facultyName.push({ key: item, value: item });
      });
    }
  });

  const facultylOptions = [
    { key: "Select your Faculty", value: "" },
    ...facultyName,
  ];

  const initialValues = {
    departmentName: "",
    school: "",
    faculty: "",
  };

  const validationSchema = Yup.object().shape({
    departmentName: Yup.mixed().required("Required"),
  });
  
  const onSubmit = (values,actions) => {
    const school = values.school;
    const department =values.departmentName;
    //created a new courses array to the database for future adding of courses into the array 
    const Courses = []
    firestore
      .collection("Schools")
      .doc(school)
      .collection("Department")
      .doc(department)
      .set({
        Courses,
         createdAt: new Date()
      })
      .then(() => {
        console.log("Document successfully written!")
        actions.resetForm()
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <Flex align="center" justify="center" h="50vw">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          const [formikState, setformikState] = useState({});
          //this function send formikstate to the upper component like method as props
          useEffect(() => {
            setformikState(formik.values);
            getFormikValue(formikState);
          }, [formik]);
          return (
            <Form>
              <Box>
                <FormikControl
                  control="Selectoption"
                  label="School"
                  name="school"
                  options={schoolOptions}
                />
              </Box>
              <Box>
                <FormikControl
                  control="Selectoption"
                  label="Faculty"
                  name="faculty"
                  options={facultylOptions}
                />
              </Box>
              <Box mt="20px">
                <FormikControl
                  //control='input'
                  control="chakraInput"
                  type="name"
                  label="Department Name"
                  name="departmentName"
                />
              </Box>

              <Spacer />
              <Box mt={4} textAlign="center">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
}

export default AddDepartment;
=======
import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../components/Formik/FormikControl";
import { Flex, Spacer, Box, Button, useToast } from "@chakra-ui/react";
import firebase from "../config/firebase-config";

//initialize firestore
const firestore = firebase.firestore();

export async function getStaticProps(context) {
  const dataref = await firestore.collection("Schools").get();

  const data = dataref.docs.map((doc) => JSON.stringify(doc.data()));
  const id = dataref.docs.map((doc) => doc.id);
  return {
    props: {
      data,
      id,
    },
  };
}

function AddDepartment(props) {
  //
  const data = props.data.map((i) => JSON.parse(i));

  console.log(props.id);
  let schoolOptions = [];

  props.id.forEach((id) => {
    schoolOptions.push({ key: id, value: id });
  });

  //console.log(schoolOptions)
  interface values {
    department?: string;
    school?: string;
    faculty?: string;
  }
  const [formikValue, setFormikValue] = useState<values>({});
  // this function is been passed to the render props formik component, which then call it and pass the state of formikvalues like method as props

  const getFormikValue = (value: values) => {
    setFormikValue(value);
  };

  let facultylOptions = [];
  // am using optional chaining to check if Facuties exisits and if if has values
  data.forEach((data) => {
    if (formikValue.school === data.Name) {
      data?.Facluties?.forEach((item) => {
        facultylOptions.push({ key: item, value: item });
      });
    }
  });

  const initialValues = {
    departmentName: "",
    school: "",
    faculty: "",
  };

  const validationSchema = Yup.object().shape({
    departmentName: Yup.mixed().required("Required"),
  });

  const toast = useToast();

  const displayToast = () => {
    toast({
      title: "Department created.",
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = (values, actions) => {
    const school = values.school;
    const department = values.departmentName;
    actions.setSubmitting(true);

    //created a new courses array to the database for future adding of courses into the array
    const Courses = [];
    firestore
      .collection("Schools")
      .doc(school)
      .collection("Department")
      .doc(department)
      .set({
        Courses,
        createdAt: new Date(),
      })
      .then(() => {
        displayToast();
        actions.resetForm();
        actions.setSubmitting(false);
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <Flex align="center" justify="center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          const [formikState, setformikState] = useState({});
          //this function send formikstate to the upper component like method as props
          useEffect(() => {
            setformikState(formik.values);
            getFormikValue(formikState);
          }, [formik]);
          return (
            <Form>
              <Box>
                <FormikControl
                  control="Selectoption"
                  label="School"
                  name="school"
                  options={schoolOptions}
                />
              </Box>
              <Box>
                <FormikControl
                  control="Selectoption"
                  label="Faculty"
                  name="faculty"
                  options={facultylOptions}
                />
              </Box>
              <Box mt="20px">
                <FormikControl
                  //control='input'
                  control="chakraInput"
                  type="name"
                  label="Department Name"
                  name="departmentName"
                />
              </Box>

              <Spacer />
              <Box mt={4} textAlign="center">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
}

export default AddDepartment;
