"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  FormControl,
  InputLabel,
  TextField,
  Divider,
  Chip,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Input
} from "@mui/material"; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const MapChart = dynamic(() => import('./MapChart'), { ssr: false });

const Insights = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStates, setSelectedStates] = useState([]);
  const [mapType, setMapType] = useState('region'); // 'region' or 'country'

  // Format the timestamp into a human-readable format
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatDateForChart(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://portfolio-backend-two-zeta.vercel.app/visit")
      .then((response) => {
        setVisits(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  function getUniqueStates() {
    const states = new Set();
    visits.forEach(visit => {
      if (visit.location && visit.location.region) {
        states.add(visit.location.region);
      }
    });
    return Array.from(states).sort();
  }

  function filterVisitsByDateAndState(visits) {
    let filteredVisits = [...visits];
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch(timeRange) {
        case 'day':
          cutoff.setDate(now.getDate() - 1);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filteredVisits = filteredVisits.map(visit => ({
        ...visit,
        timestamps: visit.timestamps.filter(t => new Date(t) >= cutoff)
      })).filter(visit => visit.timestamps.length > 0);
    }
    
    // Filter by custom date range
    if (startDate && endDate) {
      filteredVisits = filteredVisits.map(visit => ({
        ...visit,
        timestamps: visit.timestamps.filter(t => {
          const date = new Date(t);
          return date >= startDate && date <= endDate;
        })
      })).filter(visit => visit.timestamps.length > 0);
    }
    
    // Filter by selected states
    if (selectedStates.length > 0) {
      filteredVisits = filteredVisits.filter(visit => 
        visit.location && visit.location.region && selectedStates.includes(visit.location.region)
      );
    }
    
    return filteredVisits;
  }

  function getSortedTimestamps(visits) {
    const filteredVisits = filterVisitsByDateAndState(visits);
    const allTimestamps = filteredVisits.flatMap((visit) => visit.timestamps);
    return allTimestamps.sort((a, b) => new Date(a) - new Date(b));
  }

  function getVisitCountTillTimestamps(visits) {
    const allTimestamps = getSortedTimestamps(visits);
    let visitCountTillNow = 0;
    const visitCountArray = [];
    allTimestamps.forEach((timestamp) => {
      visitCountTillNow++;
      visitCountArray.push(visitCountTillNow);
    });
    return visitCountArray;
  }

  function prepareMapData() {
    const locationData = {};
    
    filteredVisits.forEach(visit => {
      if (!visit.location) return;
      
      const key = mapType === 'region' 
        ? (visit.location.region || 'Unknown') 
        : (visit.location.country || 'Unknown');
      
      if (!locationData[key]) {
        locationData[key] = {
          count: 0,
          cities: new Set(),
          lastVisit: null
        };
      }
      
      locationData[key].count += visit.count;
      if (visit.location.city) locationData[key].cities.add(visit.location.city);
      
      const lastTimestamp = visit.timestamps[visit.timestamps.length - 1];
      if (lastTimestamp && (!locationData[key].lastVisit || new Date(lastTimestamp) > new Date(locationData[key].lastVisit))) {
        locationData[key].lastVisit = lastTimestamp;
      }
    });
    
    return Object.entries(locationData).map(([name, data]) => ({
      id: name,
      value: data.count,
      cities: Array.from(data.cities).join(', '),
      lastVisit: data.lastVisit ? formatTimestamp(data.lastVisit) : 'N/A'
    }));
  }

  const filteredVisits = filterVisitsByDateAndState(visits);
  const uniqueStates = getUniqueStates();
  const sortedTimestamps = getSortedTimestamps(visits);
  const visitCounts = getVisitCountTillTimestamps(visits);
  const mapData = prepareMapData();

  const lineChartData = {
    series: [
      {
        name: "Cumulative Visit Count",
        data: visitCounts,
      },
    ],
    options: {
      chart: {
        id: "line-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
      },
      xaxis: {
        categories: sortedTimestamps.map(formatDateForChart),
        labels: {
          rotate: -45,
          formatter: function(value) {
            return value;
          }
        },
        tickAmount: 10
      },
      yaxis: {
        title: {
          text: "Visit Count"
        }
      },
      title: {
        text: "",
        align: "center",
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        x: {
          formatter: function(value) {
            return formatTimestamp(sortedTimestamps[value]);
          }
        },
        y: {
          formatter: function(value) {
            return value + (value === 1 ? " visit" : " visits");
          }
        }
      },
      colors: ['#3f51b5']
    },
  };

  const barChartData = {
    series: [
      {
        name: "Visits per User",
        data: filteredVisits.map((visit) => visit.count),
      },
    ],
    options: {
      chart: {
        id: "bar-chart",
        toolbar: {
          show: true
        }
      },
      xaxis: {
        categories: filteredVisits.map((visit) => {
          if (!visit.userId) return 'Anonymous';
          return visit.userId.length > 6 
            ? `${visit.userId.substring(0, 6)}...` 
            : visit.userId;
        }),
      },
      yaxis: {
        title: {
          text: "Number of Visits"
        }
      },
      title: {
        text: "Visit Count per User",
        align: "center",
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return value + (value === 1 ? " visit" : " visits");
          },
        },
        x: {
          formatter: function(value) {
            const visit = filteredVisits.find(v => {
              const shortId = v.userId ? 
                (v.userId.length > 6 ? v.userId.substring(0, 6) + '...' : v.userId) 
                : 'Anonymous';
              return shortId === value;
            });
            return `User: ${value}\nFirst Visit: ${visit ? formatTimestamp(visit.timestamps[0]) : ''}`;
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '70%',
        }
      },
      colors: ['#4caf50']
    },
  };

  const summaryStats = {
    totalVisits: sortedTimestamps.length,
    uniqueUsers: filteredVisits.length,
    mostActiveState: filteredVisits.reduce((max, visit) => 
      visit.location && visit.count > (max?.count || 0) ? visit : max, null
    ),
    lastVisit: sortedTimestamps.length > 0 
      ? new Date(sortedTimestamps[sortedTimestamps.length - 1]) 
      : null
  };

  return (
    <Box
      sx={{
        width: "95%",
        maxWidth: "1400px",
        margin: "auto",
        padding: "2rem 1rem",
      }}
    >
      <Typography
  variant="h3"
  gutterBottom
  sx={{
    fontWeight: 700,
    mb: 4,
    textAlign: 'center',
    color: 'primary.dark',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }}
>
  Portfolio Insights Dashboard
</Typography>


      {loading ? (
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 10,
        gap: 2,
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
          '100%': { opacity: 0.8, transform: 'scale(1)' },
        },
      }}
    >
      <CircularProgress size={70} thickness={4} color="primary" />
      <Typography
        variant="subtitle1"
        sx={{ color: 'text.secondary', fontWeight: 500 }}
      >
        Loading Insights...
      </Typography>
    </Box>
      ) : (
        <>
          {/* Filters Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    label="Time Range"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="day">Last 24 Hours</MenuItem>
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={startDate}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>States</InputLabel>
                  <Select
                    multiple
                    value={selectedStates}
                    onChange={(e) => setSelectedStates(e.target.value)}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {uniqueStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        <Checkbox checked={selectedStates.indexOf(state) > -1} />
                        <ListItemText primary={state} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Visits</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {summaryStats.totalVisits}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Unique Users</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {summaryStats.uniqueUsers}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Most Active State</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {summaryStats.mostActiveState?.location?.region || 'N/A'}
                </Typography>
                {summaryStats.mostActiveState && (
                  <Chip 
                    label={`${summaryStats.mostActiveState.count} visits`} 
                    size="small" 
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Last Visit</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {summaryStats.lastVisit ? formatTimestamp(summaryStats.lastVisit) : 'N/A'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Visit Trends</Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                    >
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="area">Area Chart</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ReactApexChart
                  options={lineChartData.options}
                  series={lineChartData.series}
                  type={chartType}
                  height={350}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Geographical Distribution</Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={mapType}
                      onChange={(e) => setMapType(e.target.value)}
                    >
                      <MenuItem value="region">By State</MenuItem>
                      <MenuItem value="country">By Country</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {mapData.length > 0 ? (
                  <>
                    <Box sx={{ height: 300 }}>
                      <MapChart data={mapData} mapType={mapType} />
                    </Box>
                    <Box sx={{ mt: 2, maxHeight: 150, overflow: 'auto' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Location Details:
                      </Typography>
                      {mapData.map((item) => (
                        <Box key={item.id} sx={{ mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{item.id}</strong>: {item.value} visits
                            {item.cities && ` (Cities: ${item.cities})`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last visit: {item.lastVisit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}>
                    No location data available for selected filters
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid
  item
  xs={12}
  className=""
  sx={{
    display: {
      xs: "none", // hidden on extra-small devices (mobile)
      sm: "block", // visible on small devices and above
    },
  }}
>
  <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>User Activity</Typography>
    <Divider sx={{ mb: 2 }} />
    <ReactApexChart
      options={barChartData.options}
      series={barChartData.series}
      type="bar"
      height={350}
    />
  </Paper>
</Grid>

          </Grid>
        </>
      )}
    </Box>
  );
};

export default Insights;