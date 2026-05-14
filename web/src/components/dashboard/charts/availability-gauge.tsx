'use client';

import { useMemo } from 'react';
import Chart, { getSharedChartOptions } from './apex-wrapper';
import { useTheme } from '@/lib/theme';

interface AvailabilityGaugeProps {
  value: number;
  color?: string;
  height?: number;
}

export const AvailabilityGauge = ({ value, color = '#3b82f6', height = 150 }: AvailabilityGaugeProps) => {
  const { theme } = useTheme();

  const options = useMemo(() => {
    const shared = getSharedChartOptions(theme);

    return {
      ...shared,
      chart: {
        ...shared.chart,
        type: 'radialBar',
        sparkline: { enabled: true },
        animations: {
          ...shared.chart.animations,
          speed: 2000
        }
      },
      colors: [color],
      plotOptions: {
        radialBar: {
          startAngle: -100,
          endAngle: 100,
          hollow: {
            margin: 0,
            size: '72%',
          },
          track: {
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)',
            strokeWidth: '98%',
            margin: 0,
          },
          dataLabels: {
            show: false,
          }
        }
      },
      stroke: {
        lineCap: 'round',
        width: 1
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [color],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.6,
          stops: [0, 100]
        }
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1,
          }
        }
      }
    };
  }, [theme, color]);

  return (
    <div className="w-full flex items-center justify-center -mt-6 -mb-10">
      <Chart
        options={options}
        series={[value]}
        type="radialBar"
        height={height}
      />
    </div>
  );
};
