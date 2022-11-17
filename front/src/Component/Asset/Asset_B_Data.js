import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AssetBdata = ({ extended, period, goal }) => {
  let monthly = Math.floor(extended / period);
  if (isNaN(monthly)) {
    monthly = 0;
  } else if (monthly === Infinity) {
    monthly = 0;
  }

  // const testA = test.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  let percentage = Math.floor((monthly / extended) * 100);
  if (isNaN(percentage)) {
    percentage = 0;
  }

  const data = [
    {
      name: goal,
      목표율: 100,
      현재: percentage,
      amt: 2400,
    },
    {
      name: 'Page B',
      목표율: 100,
      현재: 10,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  // const data = [
  //   {
  //     name: '현금',
  //     목표금액: 10000,
  //     현재금액: 7000,
  //   },
  //   {
  //     name: '금',
  //     목표금액: 1000,
  //     현재금액: 7000,
  //   },
  //   {
  //     name: '다이아몬드',
  //     목표금액: 400,
  //     현재금액: 90,
  //   },
  //   {
  //     name: '주식',
  //     목표금액: 700,
  //     현재금액: 300,
  //   },
  // ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={1000}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 100,
          left: 100,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
        <XAxis dataKey="name" stroke="#bcead5" />
        <YAxis stroke="#bcead5" />
        <Tooltip />
        <Legend />
        <Bar dataKey="현재" fill="#def5e5" />
        <Bar dataKey="목표율" fill="#9ec3b0" />
      </BarChart>
    </ResponsiveContainer>
  );
};
