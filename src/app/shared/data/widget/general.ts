export let followersGrowth: any = {
  series: [
    {
      name: "Growth",
      data: [10, 5, 15, 0, 15, 12, 29, 29, 29, 12, 15, 5],
    },
  ],
  chart: {
    height: 135,
    type: "line",
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 5,
      left: 0,
      blur: 4,
      color: "#7366ff",
      opacity: 0.22,
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  colors: ["#5527FF"],
  stroke: {
    width: 3,
    curve: "smooth",
  },
  xaxis: {
    type: "category",
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    tickAmount: 10,
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      gradientToColors: ["#5527FF"],
      shadeIntensity: 1,
      type: "horizontal",
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1,
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1,
        },
      ],
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    min: -10,
    max: 40,
    labels: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 992,
      options: {
        chart: {
          height: 150,
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 180,
        },
      },
    },
  ],
};

export let visitors: any = {
  series: [
    {
      name: "Active",
      data: [18, 10, 65, 18, 28, 10],
    },
    {
      name: "Bounce",
      data: [25, 50, 30, 30, 25, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 270,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ["#FFA941", "var(--theme-deafult)"],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Rubik, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 6,
      height: 6,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

export let averageSales: any = {
  series: [70],
  chart: {
    height: 130,
    type: "radialBar",
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 10,
      color: "var(--theme-deafult)",
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "60%",
      },
      track: {
        strokeWidth: "60%",
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        showOn: "always",
        value: {
          color: "var(--body-font-color)",
          fontSize: "14px",
          show: true,
          offsetY: -10,
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
  title: "Average Sales Per Day",
  sales: "45,908",
  growth: "+5.7",
  desc: "The point of using Lorem Ipsum",
};


export let averageProfit: any = {
   series: [60],
   chart: {
     height: 130,
     type: "radialBar",
     dropShadow: {
       enabled: true,
       top: 3,
       left: 0,
       blur: 10,
       color: "var(--theme-secondary)",
       opacity: 0.35,
     },
   },
   plotOptions: {
     radialBar: {
       hollow: {
         size: "60%",
       },
       track: {
         strokeWidth: "60%",
         opacity: 1,
         margin: 5,
       },
       dataLabels: {
         showOn: "always",
         value: {
           color: "var(--body-font-color)",
           fontSize: "14px",
           show: true,
           offsetY: -10,
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
   title: "Average Profit Per Day",
   sales: "89.6%",
   growth: "+2.7",
   desc: "The point of using Lorem Ipsum",
 };
 