// src/components/DonutChart.jsx
import React from 'react';

const DonutChart = ({ calories, segments }) => {
  // 스타일 정의
  const styles = {
    donutChart: {
      position: 'relative',
      width: '200px',
      height: '200px'
    },
    caloriesInfo: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    },
    caloriesNumber: {
      fontSize: '36px',
      fontWeight: 'bold',
      margin: '0'
    },
    caloriesLabel: {
      fontSize: '14px',
      color: '#888',
      margin: '0'
    }
  };

  return (
    <div style={styles.donutChart}>
      <svg width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="transparent" stroke="#eee" strokeWidth="10" />
        
        {/* 차트 세그먼트 계산 및 그리기 */}
        {segments.map((segment, index) => {
          // 원형 차트의 세그먼트를 계산
          const prevSegmentsTotal = segments
            .slice(0, index)
            .reduce((total, seg) => total + seg.percent, 0);
          const startAngle = (prevSegmentsTotal / 100) * 360;
          const endAngle = ((prevSegmentsTotal + segment.percent) / 100) * 360;
          
          // SVG 아크 계산
          const startX = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180);
          const startY = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180);
          const endX = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180);
          const endY = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          // 큰 호인지 여부
          const largeArcFlag = segment.percent > 50 ? 1 : 0;
          const pathData = `
            M 50 50
            L ${startX} ${startY}
            A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z
          `;
          
          return <path key={index} d={pathData} fill={segment.color} />;
        })}
        
        {/* 중앙 흰색 원 */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
      
      {/* 칼로리 정보 */}
      <div style={styles.caloriesInfo}>
        <div style={styles.caloriesNumber}>{Math.round(calories)}</div>
        <div style={styles.caloriesLabel}>Calories</div>
      </div>
    </div>
  );
};

export default DonutChart;