import firebase from "config/firebase-config";
import {
  Container,
  Heading,
  useToast,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import CoursesGrid from "components/CoursesGrid";
import DeleteButton from "components/DeleteButton";
import { useRouter } from "next/router";
import AddMaterial from "components/AddMaterial";
import { useRef } from "react";
import Link from "next/link";

const firestore = firebase.firestore();

export async function getStaticPaths() {
  const paths = [
    {
      params: {
        School: "Federal-University-Minna",
        Faculty: "Education",
        Department: "Health-Education",
        Course: "HED-112",
      },
    },
  ];

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(context) {
  const school = context.params.School;
  const course = context.params.Course;

  const schoolref = await firestore
    .collection("Schools")
    .doc(school.replace(/-/g, " "))
    .collection("Courses")
    .where("Course", "==", course.replace(/-/g, " "))
    .get();

  const [data] = schoolref.docs?.map((item) => item.data());
  const result = data === undefined || data.length <= 0 ? data === null : data;

  return {
    props: {
      result,
    },
  };
}

const School = ({ result }) => {
  const router = useRouter();

  const list = result?.Materials?.map((item) => item.Name);
  const school = router.query.School.toString().replace(/-/g, " ");
  const faculty = router.query.Faculty.toString().replace(/-/g, " ");
  const department = router.query.Department.toString().replace(/-/g, " ");
  const course = router.query.Course.toString().replace(/-/g, " ");

  const schoolUrl = `/${school.replace(/\s/g, "-")}`;
  const facultyUrl = `/${faculty.replace(/\s/g, "-")}`;
  const departmentUrl = `/${department.replace(/\s/g, "-")}`;
  const courseUrl = `/${course.replace(/\s/g, "-")}`;

  const url = schoolUrl + facultyUrl + departmentUrl + courseUrl;

  const toast = useToast();
  const displayToast = () => {
    toast({
      title: "Material Deleted",
      position: "top",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  const boxRef = useRef(null);

  const onClick = () => {
    boxRef.current.style.display = "block";
  };
  const closeBox = () => {
    boxRef.current.style.display = "none";
  };
  const handleDelete = async () => {
    firestore
      .collection("Schools")
      .doc(school)
      .collection("Courses")
      .doc(course)
      .delete()
      .then(() => {
        displayToast();

        setTimeout(() => router.back(), 2500);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <Container maxW="90%">
      <Flex justify="space-between" mt="1rem">
        <Button onClick={onClick}>Add Material</Button>
        <DeleteButton deleteFuntion={handleDelete} name="Course" />
      </Flex>
      <Box
        d="none"
        left="2rem"
        boxShadow="base"
        rounded="md"
        ref={boxRef}
        pos="absolute"
        bg="#fff"
        width="95vw"
        top="6rem"
      >
        <Button color="red" float="right" m="1rem" onClick={closeBox}>
          Close
        </Button>
        <AddMaterial />
      </Box>
      <Heading size="lg" fontSize="50px" w="95%">
        <Link href={schoolUrl}>{school}</Link> -{" "}
        <Link href={schoolUrl + facultyUrl}>{faculty}</Link> -{" "}
        <Link href={schoolUrl + facultyUrl + departmentUrl}>{department}</Link>{" "}
        - {course}
        <CoursesGrid list={list} url={url} />
      </Heading>
    </Container>
  );
};

export default School;
