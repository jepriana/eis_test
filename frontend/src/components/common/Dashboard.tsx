import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Container, CircularProgress, TextField, Grid } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { getDashboardSummary } from '../../services/dashboard_api';
import { AuthContext } from '../../context/AuthContext';
import dayjs, { Dayjs } from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

interface DashboardData {
    totalUnit: number;
    totalRole: number;
    totalEmployee: number;
    totalLogin: number;
    topLogin: {
        employeeId: string;
        employeeName: string;
        totalLogin: number;
    }[];
    loginTrend: {
        month: string;
        totalLogins: number;
    }[];
}

const Dashboard: React.FC = () => {
    const currentDate = dayjs();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<Dayjs>(currentDate.subtract(1, 'year'));
    const [endDate, setEndDate] = useState<Dayjs>(currentDate);
    const authContext = useContext(AuthContext);

    const fetchData = useCallback( async (start: string, end: string) => {
        if (authContext?.accessToken) {
            setLoading(true);
            const response = await getDashboardSummary(authContext.accessToken, start, end);
            const result = await response.data;
            setData(result);
            setLoading(false);
        }
    }, [authContext?.accessToken]);

    useEffect(() => {
        fetchData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }, [authContext?.accessToken, startDate, endDate, fetchData]);

    if (loading) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            {" "}
            <CircularProgress />{" "}
          </Box>
        );
    }

    const barData = {
        labels: data?.topLogin.map(employee => employee.employeeName),
        datasets: [
            {
                label: 'Total Logins',
                data: data?.topLogin.map(employee => employee.totalLogin),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const lineData = {
        labels: data?.loginTrend.map(trend => trend.month),
        datasets: [
            {
                label: 'Total Logins',
                data: data?.loginTrend.map(trend => trend.totalLogins),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            }
        ]
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {/* Date Range Filter */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate.format('YYYY-MM-DD')}
                        onChange={(e) => setStartDate(dayjs(e.target.value))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate.format('YYYY-MM-DD')}
                        onChange={(e) => setEndDate(dayjs(e.target.value))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Card sx={{ flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography variant="h6">Total Units</Typography>
                        <Typography variant="h4">{data?.totalUnit}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography variant="h6">Total Roles</Typography>
                        <Typography variant="h4">{data?.totalRole}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography variant="h6">Total Employees</Typography>
                        <Typography variant="h4">{data?.totalEmployee}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography variant="h6">Total Logins</Typography>
                        <Typography variant="h4">{data?.totalLogin}</Typography>
                    </CardContent>
                </Card>
            </Box>
            <Typography variant="h5" gutterBottom>
                Top 10 Employees by Logins Above 25
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Bar data={barData} />
            </Box>
            <Typography variant="h5" gutterBottom>
                Login Trend by Month
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Line data={lineData} />
            </Box>
        </Container>
    );
};

export default Dashboard;
