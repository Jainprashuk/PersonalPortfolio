"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

// Dynamic import for react-apexcharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MapChart = ({ data, mapType }) => {
  // Determine which map to use based on the mapType prop
  const map = mapType === 'region' ? 'us' : 'world';

  const options = {
    chart: {
      type: 'treemap',
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
      }
    },
    title: {
      text: `Visits by ${mapType === 'region' ? 'State/Region' : 'Country'}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold'
      }
    },
    colors: [
      '#3B93A5',
      '#F7B844',
      '#ADD8C7',
      '#EC3C65',
      '#CDD7B6',
      '#C1F666',
      '#D43F97',
      '#1E5D8C',
      '#421243',
      '#7F94B0',
      '#EF6537',
      '#C0ADDB'
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        dataLabels: {
          format: 'scale',
          style: {
            fontSize: '12px'
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + (value === 1 ? " visit" : " visits");
        }
      }
    }
  };

  const series = [{
    data: data.map(item => ({
      x: item.id,
      y: item.value
    }))
  }];

  return (
    <Box>
      {data.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type="treemap"
          height={300}
        />
      ) : (
        <Box sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary'
        }}>
          <Typography>No data available</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapChart;