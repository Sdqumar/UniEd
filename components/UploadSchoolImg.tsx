import { useState } from 'react';

const UploadSchoolImg = ({ getFile, formik }) => {
	interface file {
		name: string;
		type: string;
		size: number;
	}

	const [file, setFile] = useState<file>();
	const [error, seterror] = useState<boolean | string>('');
	const [fileTemp, setFileTemp] = useState('');

	interface e {
		target: { files: [] | {} };
	}

	const handleFile = (e: e) => {
		const file = e.target.files[0];
		seterror('Please Upload png or jpeg file');
		setFileTemp(null);
		setFile(null);
		if (file === undefined) {
			seterror('*Please Upload a png or jpeg image');
		} else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
			seterror('*Please Upload a png or jpeg image');
		} else if (file.size > 500000) {
			seterror('*Upload file less than 100kb file');
		} else {
			seterror(false);
			setFile(file);
			setFileTemp(URL.createObjectURL(e.target.files[0]));
		}
	};

	return (
		<Box w="300px" m="0 10">
			<FormControl isRequired>
				<form onSubmit={onSubmit}>
					<FormLabel>Upload Image</FormLabel>
					<Box d="flex" alignItems="center">
						<Input
							isRequired
							type="file"
							label="File"
							name="file"
							onChange={handleFile}
						/>
						{error && <Text color="red">{error}</Text>}

						<Button
							type="submit"
							colorScheme="teal"
							variant="outline"
							disabled={!file || !formik}
							ml="10px"
						>
							upload
						</Button>
					</Box>
				</form>
			</FormControl>
			<Box d="block" mt="4">
				{fileTemp && <img src={fileTemp} />}
			</Box>
		</Box>
	);
};

export default UploadSchoolImg;
