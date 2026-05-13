'use client';

import { useMemo } from 'react';
import Chart, { getSharedChartOptions } from './apex-wrapper';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface LatencyTrendChartProps {
  data: number[];
  height?: number | string;
  variant?: 'default' | 'sparkline';
}

export const LatencyTrendChart = ({ 
  data, 
  height = 240,
  variant = 'default' 
}: LatencyTrendChartProps) => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isSparkline = variant === 'sparkline';

  const options = useMemo(() => {
    const shared = getSharedChartOptions(theme);
    const isDark = theme === 'dark';
    const primaryColor = '#3b82f6'; // Brand blue

    return {
      ...shared,
      colors: [primaryColor],
      chart: {
        ...shared.chart,
        sparkline: { enabled: isSparkline },
        dropShadow: {
          enabled: !isSparkline,
          top: 10,
          left: 0,
          blur: 15,
          color: primaryColor,
          opacity: 0.15
        }
      },
      stroke: {
        ...shared.stroke,
        curve: 'smooth',
        width: isSparkline ? 2 : 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: isSparkline ? 0.3 : 0.45,
          opacityTo: 0,
          stops: [0, 100],
        }
      },
      xaxis: {
        ...shared.xaxis,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      yaxis: {
        ...shared.yaxis,
        show: !isSparkline,
        labels: {
          ...shared.yaxis.labels,
          formatter: (val: number) => `${Math.round(val)}${t('dashboard.analytics.ms')}`
        },
        tickAmount: 4,
        min: 0,
      },
      grid: {
        ...shared.grid,
        show: !isSparkline,
        padding: {
          top: isSparkline ? 0 : 10,
          right: isSparkline ? 0 : 0,
          bottom: isSparkline ? 0 : 0,
          left: isSparkline ? 0 : 10
        }
      },
      annotations: isSparkline ? undefined : {
        yaxis: [
          {
            y: 200,
            borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.4)',
            strokeDashArray: 4,
            label: {
              text: 'EXCELLENT',
              position: 'left',
              textAnchor: 'start',
              style: { 
                color: '#10b981', 
                background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', 
                fontSize: '9px', 
                fontWeight: 800,
              }
            }
          },
          {
            y: 500,
            borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.4)',
            strokeDashArray: 4,
            label: {
              text: 'HEALTHY',
              position: 'left',
              textAnchor: 'start',
              style: { 
                color: '#3b82f6', 
                background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', 
                fontSize: '9px', 
                fontWeight: 800,
              }
            }
          }
        ]
      },
      markers: {
        size: 0,
        hover: { size: isSparkline ? 0 : 6 }
      },
      tooltip: {
        ...shared.tooltip,
        enabled: !isSparkline
      }
    };
  }, [t, theme, isSparkline]);

  const series = [{
    name: t('dashboard.metrics.avg_latency'),
    data: data.length > 0 ? data : [0, 0, 0, 0, 0]
  }];

  return (
    <div className={cn("w-full h-full", !isSparkline && "min-h-[160px]")}>
      <Chart
        options={options}
        series={series}
        type="area"
        height={height}
        width="100%"
      />
    </div>
  );
};
