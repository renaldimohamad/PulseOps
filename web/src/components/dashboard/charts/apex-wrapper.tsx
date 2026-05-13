'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import for ApexCharts to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-xl bg-muted/20" />
});

export default Chart;

// Shared Theme Options for Observability Aesthetic
export const getSharedChartOptions = (theme: 'light' | 'dark'): any => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipBg = isDark ? '#0a0a0a' : '#ffffff';

  return {
    theme: {
      mode: theme,
    },
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'inherit',
      sparkline: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        dynamicAnimation: {
          enabled: true,
          speed: 450
        }
      },
      parentHeightOffset: 0,
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3,
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2.5,
      lineCap: 'round',
    },
    tooltip: {
      theme: theme,
      style: { fontSize: '11px', fontFamily: 'inherit' },
      y: {
        formatter: (val: number) => `${val}ms`
      },
      marker: { show: true },
      followCursor: true,
      intersect: false,
      shared: true,
      backdropFilter: 'blur(8px)',
      cssClass: 'premium-chart-tooltip',
    },
    legend: {
      fontSize: '11px',
      fontWeight: 600,
      fontFamily: 'inherit',
      labels: { colors: textColor },
      markers: { radius: 4, width: 8, height: 8, offsetX: -4 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    xaxis: {
      labels: { style: { colors: textColor, fontWeight: 500, fontSize: '10px' } }
    },
    yaxis: {
      labels: { style: { colors: textColor, fontWeight: 500, fontSize: '10px' } }
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 180 },
          legend: { position: 'bottom', offsetY: 0 }
        }
      }
    ]
  };
};
