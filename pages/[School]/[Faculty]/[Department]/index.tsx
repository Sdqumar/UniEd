import { Box, Typography, Button, makeStyles } from '@material-ui/core';

import { useRouter } from 'next/router';
import { useRef } from 'react';
import NextLink from 'next/link';
import firebase from 'config/firebase-config';

import dynamic from 'next/dynamic';
const AddCourse = dynamic(() => import('../../../../components/AddCourse'));
const CoursesGrid = dynamic(() => import('components/CoursesGrid'));

export async function getStaticPaths() {
	const paths = [
		{
			params: {
				School: 'Futminna',
				Faculty: 'Education',
				Department: 'Health-Education',
			},
		},
	];

	return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context) {
	const school = context.params.School;
	const faculty = context.params.Faculty;
	const department = context.params.Department;

	const { collection, query, getFirestore, where, getDocs, getDoc, doc } =
		await import('firebase/firestore');
	const firestore = getFirestore(firebase);

	const q = query(
		collection(firestore, 'schools', school, 'courses'),
		where('Department', '==', department.replace(/-/g, ' '))
	);
	const schoolRef = await getDocs(q);

	const adminRef = await getDoc(
		doc(firestore, 'schools', school, 'admin', 'admin')
	);

	let admins = adminRef?.data()?.admins;

	let data = schoolRef.docs.map((item) => item.id.replace(/-/g, ' '));

	// if (data === [] && !admins) {
	// 	return {
	// 		notFound: true,
	// 	};
	// }
	return {
		props: {
			data,
			admins,
		},
		revalidate: 10,
	};
}

const useStyles = makeStyles((theme) => ({
	department: {
		padding: '2rem',
		'& .MuiButton-contained': {
			color: 'red',
		},
	},
}));

const School = ({ data, admins }) => {
	// const auth = firebase.auth();

	// const uid = auth?.currentUser?.uid;

	// let isAdmin = admins?.some((item) => item == uid);
	const classes = useStyles();
	const router = useRouter();

	const school = router.query.School.toString().replace(/-/g, ' ');

	const faculty = router.query.Faculty.toString().replace(/-/g, ' ');
	const department = router.query.Department.toString().replace(/-/g, ' ');

	const schoolUrl = `/${school.replace(/\s/g, '-')}`;
	const facultyUrl = `/${faculty.replace(/\s/g, '-')}`;
	const departmentUrl = `/${department.replace(/\s/g, '-')}`;

	const url = schoolUrl + facultyUrl + departmentUrl;

	const boxRef = useRef(null);

	const onClick = () => {
		boxRef.current.style.display = 'block';
	};
	const closeBox = () => {
		boxRef.current.style.display = 'none';
	};

	// const collectionGrp = async () => {
	// 	const q = query(collectionGroup(firestore, 'courses'));
	// 	const schoolRef = await getDocs(q);
	// 	schoolRef.docs.map((item) => {
	// 		console.log(item.data()?.['Course']);
	// 	});
	// };
	// collectionGrp();
	return (
		<Box mt="1rem" pl="1rem">
			<Box>
				<Button variant="outlined" onClick={onClick}>
					Add Course
				</Button>
				<Box
					display="none"
					ref={boxRef}
					position="fixed"
					left="1px"
					top="6rem"
					bgcolor="#fff"
					width="100%"
					zIndex={1}
					className={classes.department}
				>
					<Box justifyContent="space-between" mt="1rem">
						<Typography className="heading">Add Course</Typography>
						<Button variant="contained" onClick={closeBox}>
							Close
						</Button>
					</Box>
					<AddCourse
						School={school}
						Faculty={faculty}
						Department={department}
					/>
				</Box>
			</Box>

			<Typography className="heading">
				<NextLink href={schoolUrl}>{school}</NextLink> -
				<NextLink href={schoolUrl + facultyUrl}>{faculty}</NextLink> -{' '}
				{department}
			</Typography>
			<CoursesGrid flexDir="row" list={data} url={url} />
		</Box>
	);
};

export default School;