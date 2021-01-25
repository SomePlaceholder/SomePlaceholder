/* eslint-disable react/prop-types */
import React, { ReactElement } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export const TimeChart: React.FC<{
  data: { x: string; time: number }[];
  fill: string;
  color?: string;
}> = (props): ReactElement => {
  const { data, fill, color } = props;

  return (
    <AreaChart
      width={600}
      height={200}
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" tick={{ fill: color }} />
      <YAxis tick={{ fill: color }} />
      <Tooltip />
      <Area type="monotone" dataKey="time" stroke={fill} fill={fill} />
    </AreaChart>
  );
};
