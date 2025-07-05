import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import css from 'styled-jsx/css';
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    activeIndex,
    showActive
  } = props;
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
        stroke="none"
        style={{ outline: 'none', backgroundColor: 'transparent', }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        stroke="none"
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 5}
        fill={payload.fill}
        style={{ outline: 'none', backgroundColor: 'transparent', }}
      />
    </g>
  );
};

const renderNOActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    activeIndex,
    showActive
  } = props;
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
        stroke="none"
        fill={payload.fill}
        style={{ outline: 'none', backgroundColor: 'transparent', }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        stroke="none"
        innerRadius={outerRadius}
        outerRadius={outerRadius}
        fill={payload.fill}
        style={{ outline: 'none', backgroundColor: 'transparent', }}
      />
    </g>
  );
};

export default class PrePieChart extends PureComponent {
  state = {
    activeIndex: this.props.maxInx || 0
  };
  componentDidUpdate(prevProps) {
    // 当shouldComponentUpdate返回true时执行
    if (this.props.maxInx !== prevProps.maxInx) {
      this.setState({
        activeIndex: this.props.maxInx
      });
    }
  }
  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index
    });
  };
  movePieEnter = (_, index) => {
    this.setState({
      activeIndex: this.props.maxInx || 0
    });
  };

  render() {
    const { copyPreferenceData = [], showActive = true } = this.props;
    const formatData = copyPreferenceData.map(item => {
      return {
        ...item,
        name: item.name?.replace('USDT', ''),
        color: item.color?.replace(/stroke[^;]*;?/, '')
      };
    });
    return (
      <div className="recharts-container">
        <PieChart
          width={120}
          height={120}
          style={{ outline: 'none' }}
          // onMouseDown={(e) => e.preventDefault()} // 阻止默认聚焦行为
          tabIndex={-1} // 禁止图表本身获取焦点
        >
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={showActive ? renderActiveShape : renderNOActiveShape}
            data={formatData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            dataKey="currentValue"
            onMouseEnter={this.onPieEnter}
            onMouseOut={this.movePieEnter}
            stroke="none"
            tabIndex={-1} // 禁止Pie获取焦点
          >
            {formatData?.map(entry => (
              <Cell
                key={`cell-${entry.value}`}
                fill={entry.color}
                stroke="none"
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
        <style jsx>{styles}</style>
        <style jsx global>{`
          /* 全局样式确保覆盖所有情况 */
          .recharts-container :focus,
          .recharts-container :focus-visible,
          .recharts-container :focus-within {
            outline: none !important;
            box-shadow: none !important;
          }
          .recharts-wrapper,
          .recharts-surface {
            outline: none !important;
          }
          .recharts-sector:focus {
            outline: none !important;
          }
        `}</style>
      </div>
    );
  }
}

const styles = css`
  /* 禁用所有 Recharts 相关元素的焦点轮廓 */
  :global(.recharts-wrapper:focus),
  :global(.recharts-surface:focus),
  :global(.recharts-pie:focus),
  :global(.recharts-sector:focus) {
    outline: none !important;
    box-shadow: none !important;
  }

  /* 针对现代浏览器的 :focus-visible 伪类 */
  :global(.recharts-wrapper:focus-visible),
  :global(.recharts-surface:focus-visible) {
    outline: none !important;
  }
`;
