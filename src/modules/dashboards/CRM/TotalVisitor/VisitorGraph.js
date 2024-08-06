import React from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import PropTypes from 'prop-types';
import {Fonts} from '@crema/constants/AppEnums';
import {useIntl} from 'react-intl';

const VisitorGraph = ({totalVisitors, totalUserCount}) => {
  const {messages} = useIntl();
  return (
    <ResponsiveContainer>
      <PieChart style={{height: '15rem'}}>
        <text
          x='50%'
          fontWeight={Fonts.MEDIUM}
          fontSize={20}
          y='45%'
          textAnchor='middle'
          dominantBaseline='middle'
        >
          {totalUserCount}
        </text>
        <text
          x='50%'
          fontWeight={Fonts.MEDIUM}
          fontSize={20}
          y='55%'
          textAnchor='middle'
          dominantBaseline='middle'
        >
          {messages['totaluser']}
        </text>
        <Pie
          data={totalVisitors}
          startAngle={90}
          endAngle={-270}
          dataKey='value'
          cx='50%'
          cy='50%'
          innerRadius='80%'
          outerRadius='95%'
        >
          {totalVisitors.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          labelStyle={{color: 'black'}}
          contentStyle={{
            borderRadius: 12,
            borderColor: '#31354188',
            background: '#FFFFFFCA',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VisitorGraph;

VisitorGraph.defaultProps = {
  totalVisitors: [],
};

VisitorGraph.propTypes = {
  totalVisitors: PropTypes.array,
  totalUserCount: PropTypes.any,
};
