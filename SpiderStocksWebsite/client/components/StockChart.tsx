import {
  Area,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StockChartProps {
  values: number[];
  stroke?: string;
  name?: string;
}

export function StockChart({ values, stroke = "#3bc9db", name = "Close" }: StockChartProps) {
  const data = values.map((value, index) => ({
    day: index + 1,
    value,
  }));

  return (
    <div className="h-[320px] w-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-6 shadow-xl">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="stock-line" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.48} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={(day: number) => (day % 5 === 0 || day === 1 ? `${day}` : "")}
            interval={0}
            minTickGap={12}
            stroke="#94a3b8"
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val.toFixed(2)}`}
            width={92}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.16)", strokeWidth: 1 }}
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.2)",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, name]}
            labelFormatter={(label) => `${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="transparent"
            fill="url(#stock-line)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: stroke, strokeWidth: 0 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
