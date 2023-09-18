import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from "ng-apexcharts";

let primary_color = localStorage.getItem("primary_color") || "#7366ff";
let secondary_color = localStorage.getItem("secondary_color") || "#f73164";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  tooltip?: any;
  dataLabels?: ApexDataLabels;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  labels?: string[];
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
  responsive?: ApexResponsive[];
  pieseries?: ApexNonAxisChartSeries;
  title?: ApexTitleSubtitle;
  theme?: ApexTheme;
  colors?: string[];
  markers?: ApexMarkers;
  annotations?: ApexAnnotations;
  grid?: ApexGrid;
};


export let averageSales: ChartOptions | any =  {
  
  series: [100],
  chart: {
    height: 150,
    type: "radialBar",
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 10,
      color: ["var(--theme-deafult)"],
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "60%",
      },
      track: {
        strokeWidth: "45%",
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        showOn: "always",
        value: {
          color: "var(--chart-text-color)",
          fontSize: "18px",
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: ["var(--theme-deafult)"],
  stroke: {
    lineCap: "round",
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 130,
        },
      },
    },
  ],
  averageTitle: "Le nombre total de bien",
  average: "0",
  parsonage: "5.7",
  desc: "Les biens de location et ventes",
  cardColor: "primary",
};

export let averageProfit: ChartOptions | any = {
  series: [0],
  chart: {
    height: 150,
    type: "radialBar",
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 10,
      color: ["var(--theme-secondary)"],
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "60%",
      },
      track: {
        strokeWidth: "45%",
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        showOn: "always",
        value: {
          color: "var(--chart-text-color)",
          fontSize: "18px",
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: ["var(--theme-secondary)"],
  stroke: {
    lineCap: "round",
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 130,
        },
      },
    },
  ],
  averageTitle: "Nombre Total ",
  average: "0",
  parsonage: "2.7",
  desc: " de bien A vendre",
  cardColor: "secondary",
};

export let averageVisits: ChartOptions | any = {
  series: [0],
  chart: {
    height: 150,
    type: "radialBar",
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 10,
      color: ["#54BA4A"],
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "60%",
      },
      track: {
        strokeWidth: "45%",
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        showOn: "always",
        value: {
          color: "var(--chart-text-color)",
          fontSize: "18px",
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: ["#54BA4A"],
  stroke: {
    lineCap: "round",
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 130,
        },
      },
    },
  ],
  averageTitle: "Nombre total",
  average: "0",
  parsonage: "1.5",
  desc: " De bien a louer ",
  cardColor: "success",
};

export let transactions = [
  {
    type: "Buy",
    coin: "BTC",
    date: "14 Mar, 2022",
    parsonage: "0.018",
    price: "236.89",
    growth: "high",
    arrow: "trending-up",
  },
  {
    type: "Sell",
    coin: "ETH",
    date: "28 Mar, 2022",
    parsonage: "0.018",
    price: "236.89",
    growth: "low",
    arrow: "trending-down",
  },
  {
    type: "Buy",
    coin: "BTC",
    date: "16 Apr, 2022",
    parsonage: "0.012",
    price: "236.89",
    growth: "high",
    arrow: "trending-up",
  },
  {
    type: "Sell",
    coin: "ETH",
    date: "25 Mar, 2022",
    parsonage: "0.089",
    price: "116.89",
    growth: "low",
    arrow: "trending-down",
  },
  {
    type: "Buy",
    coin: "BTC",
    date: "14 Mar, 2022",
    parsonage: "0.018",
    price: "236.89",
    growth: "high",
    arrow: "trending-up",
  },
  {
    type: "Buy",
    coin: "LTC",
    date: "25 Mar, 2022",
    parsonage: "0.089",
    price: "116.89",
    growth: "low",
    arrow: "trending-down",
  },
  {
    type: "Buy",
    coin: "BTC",
    date: "14 Mar, 2022",
    parsonage: "0.018",
    price: "236.89",
    growth: "high",
    arrow: "trending-up",
  },
  {
    type: "Sell",
    coin: "ETH",
    date: "14 Mar, 2022",
    parsonage: "0.018",
    price: "236.89",
    growth: "low",
    arrow: "trending-down",
  },
];

export let Bitcoin: any = {
  series: [
    {
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
    },
  ],
  chart: {
    width: 120,
    height: 120,
    type: "line",
    toolbar: {
      show: false,
    },
    offsetY: 10,
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 6,
      left: 0,
      blur: 6,
      color: "#FFA941",
      opacity: 0.3,
    },
  },
  grid: {
    show: false,
  },
  colors: ["#FFA941"],
  stroke: {
    width: 2,
    curve: "smooth",
  },
  labels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov"],
  markers: {
    size: 0,
  },
  xaxis: {
    // type: 'datetime',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    marker: {
      show: false,
    },
    x: {
      show: false,
    },
    y: {
      show: false,
      labels: {
        show: false,
      },
    },
  },
  responsive: [
    {
      breakpoint: 1790,
      options: {
        chart: {
          width: 100,
          height: 100,
        },
      },
    },
    {
      breakpoint: 1661,
      options: {
        chart: {
          width: "100%",
          height: 100,
        },
      },
    },
  ],
  icon: "beta",
  coinName: "Bitcoin",
  tag: "BTC",
  colorClass: "warning",
  price: "2,143",
  parsonage: "50",
};

export let Ethereum: any = {
  series: [
    {
      data: [30, 25, 30, 25, 64, 40, 59, 52, 64],
    },
  ],
  chart: {
    width: 120,
    height: 120,
    type: "line",
    toolbar: {
      show: false,
    },
    offsetY: 10,
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 6,
      left: 0,
      blur: 6,
      color: "var(--theme-deafult)",
      opacity: 0.3,
    },
  },
  grid: {
    show: false,
  },
  colors: ["var(--theme-deafult)"],
  stroke: {
    width: 2,
    curve: "smooth",
  },
  labels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep"],
  markers: {
    size: 0,
  },
  xaxis: {
    // type: 'datetime',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    marker: {
      show: false,
    },
    x: {
      show: false,
    },
    y: {
      show: false,
      labels: {
        show: false,
      },
    },
  },
  responsive: [
    {
      breakpoint: 1790,
      options: {
        chart: {
          width: 100,
          height: 100,
        },
      },
    },
    {
      breakpoint: 1661,
      options: {
        chart: {
          width: "100%",
          height: 100,
        },
      },
    },
  ],
  icon: "eth",
  coinName: "Ethereum",
  tag: "ETC",
  colorClass: "primary",
  price: "7,450",
  parsonage: "35",
};

export let LeaveTravel: any = {
  series: [
    {
      data: [30, 25, 36, 30, 64, 50, 45, 62, 60, 64],
    },
  ],
  chart: {
    width: 120,
    height: 120,
    type: "line",
    toolbar: {
      show: false,
    },
    offsetY: 10,
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 6,
      left: 0,
      blur: 6,
      color: "#54BA4A",
      opacity: 0.3,
    },
  },
  grid: {
    show: false,
  },
  colors: ["#54BA4A"],
  stroke: {
    width: 2,
    curve: "smooth",
  },
  labels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct"],
  markers: {
    size: 0,
  },
  xaxis: {
    // type: 'datetime',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    marker: {
      show: false,
    },
    x: {
      show: false,
    },
    y: {
      show: false,
      labels: {
        show: false,
      },
    },
  },
  responsive: [
    {
      breakpoint: 1790,
      options: {
        chart: {
          width: 100,
          height: 100,
        },
      },
    },
    {
      breakpoint: 1661,
      options: {
        chart: {
          width: "100%",
          height: 100,
        },
      },
    },
  ],
  icon: "ltc",
  coinName: "Leave Travel",
  tag: "LTC",
  colorClass: "success",
  price: "2,198",
  parsonage: "73",
};

export let marketChart: ChartOptions | any = {
  series: [
    {
      name: "TEAM A",
      type: "column",
      data: [4, 8, 4.5, 8, 13, 8.5, 12, 5, 7, 12],
    },
    {
      name: "TEAM C",
      type: "line",
      data: [2, 3, 2, 6, 8, 12, 9, 7, 9, 7],
    },
  ],
  chart: {
    height: 300,
    type: "line",
    stacked: false,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: [1],
      top: 0,
      left: 0,
      blur: 15,
      color: "var(--theme-deafult)",
      opacity: 0.3,
    },
  },
  stroke: {
    width: [0, 3],
    curve: "smooth",
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  colors: ["rgba(170, 175, 203, 0.2)", "var(--theme-deafult)"],
  grid: {
    borderColor: "var(--chart-border)",
  },
  plotOptions: {
    bar: {
      columnWidth: "20%",
    },
  },
  fill: {
    type: ["solid", "gradient"],
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: ["var(--theme-deafult)", "#d867ac"],
      opacityFrom: 0.8,
      opacityTo: 0.8,
      colorStops: [
        {
          offset: 0,
          color: "#d867ac",
          opacity: 1,
        },
        {
          offset: 30,
          color: "#d867ac",
          opacity: 1,
        },
        {
          offset: 50,
          color: "var(--theme-deafult)",
          opacity: 1,
        },
        {
          offset: 80,
          color: "var(--theme-deafult)",
          opacity: 1,
        },
        {
          offset: 100,
          color: "var(--theme-deafult)",
          opacity: 1,
        },
      ],
    },
  },
  labels: ["Sep 10", "Sep 15", "Sep 20", "Sep 25", "Sep 30", "Oct 05", "Oct 10", "Oct 15", "Oct 20", "Oct 25"],
  markers: {
    size: 0,
  },
  yaxis: {
    min: 0,
    max: 20,
    tickAmount: 5,
    labels: {
      formatter: function (val) {
        return val + "k";
      },
      style: {
        fontSize: "12px",
        fontFamily: "Rubik, sans-serif",
        colors: "var(--chart-text-color)",
      },
    },
  },
  xaxis: {
    tooltip: {
      enabled: false,
    },
    labels: {
      style: {
        fontSize: "10px",
        fontFamily: "Rubik, sans-serif",
        colors: "var(--chart-text-color)",
      },
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  legend: {
    show: false,
  },
};

export let portfolio: ChartOptions | any = {
  series: [44, 55, 67],
  chart: {
    height: 280,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        show: false,
      },
      track: {
        background: "var(--chart-progress-light)",
        opacity: 0.3,
      },
      hollow: {
        margin: 10,
        size: "40%",
        image: "assets/images/dashboard-4/portfolio-bg.png",
        imageWidth: 230,
        imageHeight: 230,
        imageClipped: false,
      },
    },
  },
  colors: ["#54BA4A", "#FFA539", "#7366FF"],
  labels: ["USD", "BTC", "ETH"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.25,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [50, 0, 80, 100],
    },
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 260,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 10,
              size: "40%",
              image: "assets/images/dashboard-4/portfolio-bg.png",
              imageWidth: 190,
              imageHeight: 190,
              imageClipped: false,
            },
          },
        },
      },
    },
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 320,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              imageWidth: 260,
              imageHeight: 260,
            },
          },
        },
      },
    },
    {
      breakpoint: 650,
      options: {
        chart: {
          height: 280,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              imageWidth: 220,
              imageHeight: 220,
            },
          },
        },
      },
    },
  ],
};
