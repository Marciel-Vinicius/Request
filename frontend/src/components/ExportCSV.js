import React from 'react';
import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';

export default function ExportCSV({ data }) {
    const headers = Object.keys(data[0] || {}).map(key => ({ label: key, key }));
    return (
        <Button variant="outlined">
            <CSVLink data={data} headers={headers} filename="export.csv" style={{ textDecoration: 'none' }}>
                Exportar CSV
            </CSVLink>
        </Button>
    );
}