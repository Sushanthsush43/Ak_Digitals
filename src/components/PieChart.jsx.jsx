import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import '../css/Dashboard.css';

const PieChartComponent = ({ data }) => {
  const totalStorage = data.photoSize + data.videoSize;
  const usedStorage = data.photoSize + data.videoSize;
  const remainingStorage = totalStorage - usedStorage;

  const chartData = [
    { title: 'Photos', value: data.photoSize, color: '#36A2EB' },
    { title: 'Videos', value: data.videoSize, color: '#FF6384' },
    { title: 'Remaining', value: remainingStorage, color: '#F5F5F5' },
  ];

  const animationConfig = {
    animate: true,
    animationDuration: 1000,
    animationEasing: 'ease-out'
  };

  const segmentsStyle = (index) => ({
    transition: 'fill 0.3s ease',
    fill: chartData[index].color,
  });

  const labelStyle = (index) => ({
    fontSize: '6px',
    transition: 'fill 0.3s ease',
  });
  console.log(data);

  return (
    <div className='chart-div'>
      <PieChart
        data={chartData}
        label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value} GB`}
        labelStyle={labelStyle}
        segmentsStyle={segmentsStyle}
        {...animationConfig}
      />
      <div className='extra_details-div'>
        <h2>aaaaaaaaaaaaaa</h2>
        <h2>bbbbbbbbbbbbb</h2>
        <h2>cccccccccccccccc</h2>
      </div>
    </div>
  );
};

export default PieChartComponent;
