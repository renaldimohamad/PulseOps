'use client';

import { useMemo } from 'react';
import Chart, { getSharedChartOptions } from './apex-wrapper';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

interface ServiceHealthDonutProps {
  stats: {
    up: number;
    degraded: number;
    down: number;
  };
}

export const ServiceHealthDonut = ({ stats }: ServiceHealthDonutProps) => {
  const { t } = useI18n();
  const { theme } = useTheme();

  const options = useMemo(() => {
    const shared = getSharedChartOptions(theme);
    const isDark = theme === 'dark';

    return {
      ...shared,
      chart: {
        ...shared.chart,
        type: 'donut',
      },
      colors: ['#10b981', '#f59e0b', '#ef4444'], // Healthy, Degraded, Down
      stroke: { show: false },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '80%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '10px',
                fontWeight: 700,
                color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 800,
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                offsetY: 6
              },
              total: {
                show: true,
                label: 'TOTAL',
                color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      },
      labels: [t('common.healthy'), t('common.degraded'), t('common.critical')],
      legend: {
        ...shared.legend,
        position: 'bottom',
        offsetY: 0,
      },
      tooltip: {
        ...shared.tooltip,
        y: {
          formatter: (val: number) => `${val} ${t('common.services')}`
        }
      }
    };
  }, [t, theme]);

  const series = [stats.up, stats.degraded, stats.down];

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[220px]">
      <Chart
        options={options}
        series={series}
        type="donut"
        height={220}
      />
    </div>
  );
};
