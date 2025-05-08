import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, activeIndex, showActive } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 5}
        fill={payload.fill}
      />
    </g>
  );
};

const renderNOActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, activeIndex, showActive } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius}
        outerRadius={outerRadius}
        fill={payload.fill}
      />
    </g>
  );
};

export default class PrePieChart extends PureComponent {
  state = {
    activeIndex: this.props.maxInx,
  };
  componentDidUpdate(prevProps) {
    // 当shouldComponentUpdate返回true时执行
    if (this.props.maxInx !== prevProps.maxInx) {
      this.setState({
        activeIndex: this.props.maxInx,
      });
    }
  }
  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  movePieEnter = (_, index) => {
    this.setState({
      activeIndex: this.props.maxInx,
    });
  };

  render() {
    const { copyPreferenceData = [], showActive = true } = this.props;
    return (
      <PieChart width={120} height={120}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={showActive ? renderActiveShape : renderNOActiveShape}
          data={copyPreferenceData}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={50}
          dataKey="currentValue"
          onMouseEnter={this.onPieEnter}
          onMouseOut={this.movePieEnter}
        >
          {copyPreferenceData?.map((entry) => (
            <Cell key={`cell-${entry.value}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}
