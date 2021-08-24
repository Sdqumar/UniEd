import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { Box } from '@chakra-ui/react';

export default function PDFViewer({ data }) {
	return (
		<Box mt={10}>
			<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
				<Viewer fileUrl={data} />
			</Worker>
		</Box>
	);
}
