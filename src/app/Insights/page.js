"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material"; 
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Insights = () => {
  const [visits, setVisits] = useState([]);

  // Format the timestamp into a human-readable format
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  useEffect(() => {
    axios
      .get("https://portfolio-backend-two-zeta.vercel.app/visit")
      .then((response) => {
        setVisits(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  function getSortedTimestamps(visits) {
    const allTimestamps = visits.flatMap((visit) => visit.timestamps);
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

  const lineChartData = {
    series: [
      {
        name: "Cumulative Visit Count",
        data: getVisitCountTillTimestamps(visits),
      },
    ],
    options: {
      chart: {
        id: "line-chart",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: getSortedTimestamps(visits).map(formatTimestamp),
        labels: {
          rotate: -45,
        },
      },
      title: {
        text: "Cumulative Visit Count Over Time",
        align: "center",
      },
    },
  };

  const locationDistributionData = {
    series: visits.map((visit) => visit.count),
    options: {
      chart: {
        id: "pie-chart",
      },
      labels: visits.map((visit) => visit.location.city),
      title: {
        text: "Location Distribution",
        align: "center",
      },
    },
  };

  const barChartData = {
    series: [
      {
        name: "Visits per User",
        data: visits.map((visit) => visit.count),
      },
    ],
    options: {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: visits.map((visit) => visit.userId),
      },
      title: {
        text: "Visit Count per User",
        align: "center",
      },
      tooltip: {
        x: {
          show: true,
          format: "dd MMM yyyy",
        },
        y: {
          formatter: function (value) {
            return value + " visits";
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: "1200px",
        margin: "auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Insights Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={14} lg={20}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ReactApexChart
              options={lineChartData.options}
              series={lineChartData.series}
              type="line"
              height={350}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={14} lg={20}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ReactApexChart
              options={locationDistributionData.options}
              series={locationDistributionData.series}
              type="pie"
              height={350}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={14} lg={20}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ReactApexChart
              options={barChartData.options}
              series={barChartData.series}
              type="bar"
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Insights;
