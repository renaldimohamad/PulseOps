'use client';

import { useMemo } from 'react';
import Chart, { getSharedChartOptions } from './apex-wrapper';
import { useTheme } from '@/lib/theme';

interface PerformanceBarChartProps {
  data: { name: string; latency: number }[];
  type: 'fastest' | 'slowest';
}

export const PerformanceBarChart = ({ data, type }: PerformanceBarChartProps) => {
  const { theme } = useTheme();

  const options = useMemo(() => {
    const shared = getSharedChartOptions(theme);

    return {
      ...shared,
      chart: {
        ...shared.chart,
        type: 'bar',
      },
      colors: [type === 'fastest' ? '#10b981' : '#ef4444'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '40%',
          distributed: false,
        }
      },
      xaxis: {
        ...shared.xaxis,
        categories: data.map(d => d.name),
        labels: {
          ...shared.xaxis.labels,
          formatter: (val: number) => `${Math.round(val)}ms`
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        ...shared.yaxis,
        labels: {
          ...shared.yaxis.labels,
          maxWidth: 120,
        }
      },
      grid: {
        ...shared.grid,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
        padding: { left: 0, right: 10 }
      }
    };
  }, [data, type, theme]);

  const series = [{
    name: 'Latency',
    data: data.map(d => d.latency)
  }];

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={160}
      />
    </div>
  );
};
