import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import Highcharts from 'highcharts'
import HighchartsDrillDown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'
import Chart from "../../chartOption";
import {getModLoaderChartAPI} from "../../apiClient";

Highcharts.setOptions(Chart.globalOptions);
HighchartsDrillDown(Highcharts);

const ModLoaderChart = () => {
    const {t} = useTranslation();
    const [chartOptions, setChartOptions] = useState(null);

    useEffect(() => {
        getModLoaderChartAPI().then(res => {
            const chartOption = {
                ...Chart.getDrillDownPieChartOption(t),
                colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
                    '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92']
            };

            const data = res.data;
            Object.keys(data).forEach(modLoaderName => {
                const techVersionMap = data[modLoaderName];

                const versionGraphData = [];
                let totalCount = 0;

                Object.keys(techVersionMap).forEach(techVersion => {
                    const techVersionCount = techVersionMap[techVersion];

                    totalCount += techVersionCount;
                    versionGraphData.push([techVersion, techVersionCount]);
                })

                chartOption.series[0].data.push({
                    name: modLoaderName,
                    y: totalCount,
                    drilldown: modLoaderName
                });

                chartOption.drilldown.series.push({
                    name: modLoaderName,
                    id: modLoaderName,
                    data: versionGraphData
                });
            })

            setChartOptions(chartOption);
        })
    }, [])

    return (
        <>
            <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
        </>
    )
}

export default ModLoaderChart;
