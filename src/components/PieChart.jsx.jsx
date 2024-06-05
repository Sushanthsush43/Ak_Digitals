import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../css/Dashboard.css';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './uitls/toastStyle';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const totalStorage = parseFloat(5); // Total storage in GB
  const photoSize  = parseFloat(data.photoSize);
  const videoSize  = parseFloat(data.videoSize);

  const usedStorage = parseFloat(photoSize + videoSize).toFixed(2);

  const remainingStorage = parseFloat(totalStorage - usedStorage).toFixed(2);

  const chartData = {
    labels: ['Photos', 'Videos', 'Remaining'],
    datasets: [
      {
        label: 'Storage Distribution',
        data: [photoSize, videoSize, remainingStorage],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${value} GB`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 20, // Add space between chart and legend
      },
    },
  };

  useEffect(()=>{
    if(remainingStorage <= 0) {
      toast.error("Storage full. Consider deleting some files and please reach out to the developers.", {...toastErrorStyle(), autoClose: false});
    } else if (remainingStorage <= 0.5) {
      toast.error("Storage almost full. Consider deleting some files or reaching out to the developers.", {...toastErrorStyle(), autoClose: false});
    }
  },[remainingStorage]);

  return (
    <div className='piechart-div-sub border border-dark rounded'>
      <div className='piechart-div p-2'>
        <Pie data={chartData} options={options} className='chart'/>
      </div>
      <div className='storage-extra_details-div'>
  <h2 className="lead">
    <FontAwesomeIcon icon={faCaretRight} /> Total space used :
      <strong style={{fontSize: '1.8rem', color : usedStorage>= 4.5 ? 'red' : 'inherit' }}> {usedStorage} GB</strong>
  </h2>
  <h2 className="lead">
    <FontAwesomeIcon icon={faCaretRight} /> Storage space Limit :<strong style={{fontSize: '1.8rem'}}> 5 GB</strong>
  </h2>
</div>

    </div>
  );
};

export default PieChart;