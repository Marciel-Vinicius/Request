import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportPDF({ data }) {
    const handleExport = () => {
        const doc = new jsPDF();
        const headers = [Object.keys(data[0] || {})];
        const rows = data.map(item => Object.values(item));
        doc.autoTable({ head: headers, body: rows });
        doc.save('export.pdf');
    };

    return <Button variant="outlined" onClick={handleExport}>Exportar PDF</Button>;
}