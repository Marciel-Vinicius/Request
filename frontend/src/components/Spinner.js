import { CircularProgress, Box } from '@mui/material';

export default function Spinner() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress />
        </Box>
    );
}