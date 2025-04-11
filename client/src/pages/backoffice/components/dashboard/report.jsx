import { useEffect, useState } from "react"
import { useEcomStore } from "../../../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../../ecomStore/authStore";
import { toast } from "react-toastify";
import LineChart from "./components/lineChart";
import { fulfillTwoDigit, getDayoneuptoToday, getToDay, hdlTimeDuration } from "../../../util/utilDateTime";
import { reportPerDay } from "../../../../api/reportApi";
import { arrForChartData, dataChart } from "../../../util/utilChart";
import "./chartConfig"

// format "YYYY-MM-DD"
export default function Report() {
    const { token } = useAuthStore(
        useShallow(s => ({
            token: s.token,
        })));
    const { reportThisMonth, actionReportThisMonth } = useEcomStore(
        useShallow(s => ({
            reportThisMonth: s.reportThisMonth,
            actionReportThisMonth: s.actionReportThisMonth,
        })));
    const [chartData, setChartData] = useState();
    const [month, setMonth] = useState(() => {
        const dt = new Date().getMonth();

        switch (dt) {
            case 0:
                console.log("มกราคม");
                return "มกราคม";
            case 1:
                console.log("กุมภาพันธ์")
                return "กุมภาพันธ์";
            case 2:
                console.log("มีนาคม")
                return "มีนาคม";
            case 3:
                console.log("เมษายน")
                return "เมษายน";
            case 4:
                console.log("พฤษภาคม")
                return "พฤษภาคม";
            case 5:
                console.log("มิถุนายน")
                return "มิถุนายน";
            case 6:
                console.log("กรกฏาคม")
                return "กรกฏาคม";
            case 7:
                console.log("สิงหาคม")
                return "สิงหาคม";
            case 8:
                console.log("กันยายน")
                return "กันยายน";
            case 9:
                console.log("ตุลาคม")
                return "ตุลาคม";
            case 10:
                console.log("พฤศจิกายน")
                return "พฤศจิกายน";
            case 11:
                console.log("ธันวาคม")
                return "ธันวาคม";
            default:
                console.log(`Sorry, we are out of ${expr}.`);
                return "Somthing wrong";
        }
    });
    const [today, setToday] = useState();
    const [dataInput, setDataInput] = useState({ dayStart: '', dayEnd: '' });

    // console.log(chartData)

    const fetchData = async (dayStart, dayEnd, status) => {
        const payload = { dayStart, dayEnd };
        if (status === 'custom') {
            try {
                return await reportPerDay(payload, token);
            } catch (err) {
                if (err.code === "ERR_NETWORK") return { message: err.message };
                return { status: err.status, message: err.response.data.message };
            }
        } else {
            const res = await actionReportThisMonth(payload, token);
            if (res.error) return toast.error(res.error.message);
        };
    };



    //------------- init time duration
    const hdlInitData = async () => {
        const { nowDate, nowMonth, nowYear } = getToDay();
        const dayStart = nowYear + '-' + fulfillTwoDigit(nowMonth) + '-01';
        const dayEnd = nowYear + '-' + fulfillTwoDigit(nowMonth) + '-' + fulfillTwoDigit(nowDate);

        // dS , dE (milliseconds)
        const { dS, dE, dRange, error } = hdlTimeDuration(dayStart, dayEnd);
        if (error) return toast.warning('Incomplete data');
        return arrForChartData({ dS, dRange, dataApi: reportThisMonth });
    };

    //------------- custom time duration
    const hdlDateInput = (data) => {
        const { name, value } = data.target;
        setDataInput(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const hdlCustomData = async () => {
        const { dayStart, dayEnd } = dataInput;
        if (!dayStart || !dayEnd) return toast.warning('Incomplete data');

        // dS , dE (milliseconds)
        const { dS, dE, dRange, error } = hdlTimeDuration(dayStart, dayEnd);
        if (error) return toast.warning('Incomplete data');

        // ดึงข้อมูลจากเซิร์ฟเวอร์
        const res = await fetchData(dayStart, dayEnd, 'custom');

        if (res.status === 200) {
            const dataApi = res.data.result;
            return arrForChartData({ dS, dRange, dataApi });
        } else {
            // console.log(res.message);
            toast.error(res.message);
        };
    };

    const hdlChartData = async () => {
        const { dayStart, dayEnd } = dataInput;
        let arrData;

        if (!dayStart || !dayEnd) {
            arrData = await hdlInitData();
        } else {
            arrData = await hdlCustomData();
            console.log('arrData custom : ', arrData)
            //setting data
        };
        setChartData(() => dataChart({ arrData, bgcolor: 'white', bdcolor: 'red' }))
    };

    useEffect(() => {
        if (!reportThisMonth) {
            const { dayStart, dayEnd } = getDayoneuptoToday();
            fetchData(dayStart, dayEnd);
            // hdlChartData();
        } else {
            hdlChartData();
        };

        setToday(() => {
            const { nowDate, nowMonth, nowYear } = getToDay();
            return nowYear + '-' + fulfillTwoDigit(nowMonth) + '-' + fulfillTwoDigit(nowDate);
        });
    }, [reportThisMonth]);
    // }, [reportThisMonth, dataInput]);

    const hdlWatch = () => {
        hdlChartData();
    };



    const debug = (value) => {
        // const dSplit = new Date(reportThisMonth[1].create_date).toLocaleDateString('th-TH', { year: "numeric", month: "2-digit", day: "2-digit", });
        // const dSplit = new Date(reportThisMonth[1].create_date).toISOString().split('T', 1);
        // const str = dSplit[0].slice(5)
        // console.log(dSplit)

        // const hrs7 = timeConvert(7, 'hrs', 'mil'); // return millisecond (7hrs)
        // const t = new Date(reportThisMonth[1].create_date).getTime();
        // const toLocalTz = new Date(reportThisMonth[1].create_date).getTime() + hrs7;
        // console.log(t)
        // console.log(toLocalTz)

        console.log(new Date(reportThisMonth[1].create_date).getTime())
        const t = new Date(reportThisMonth[1].create_date).getTime()
        console.log(new Date(t).getTime())
        const tz = new Date(t).getTime()
        console.log(new Date(tz))

        // const dt = new Date(reportThisMonth[1].create_date);
        // const d = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        // const milD = new Date(d).getTime(); //return milliseconds
        // console.log(dt)
        // console.log(d)
        // console.log(milD)
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-8/12 bg-white shadow-lg p-4">
                <div>
                    <label className="me-2">start</label>
                    <input type="date" name="dayStart" max={today} className="border border-sky-500 rounded" onChange={e => hdlDateInput(e)}></input>
                    <label className="me-2">end</label>
                    <input type="date" name="dayEnd" max={today} className="border border-sky-500 rounded" onChange={e => hdlDateInput(e)}></input>

                    <button className="ms-2 bo-btn-add bg-green-500" onClick={hdlWatch}>เลือกดู</button>
                </div>
                <div>
                    {/* <button className="bo-btn-add bg-green-500" onClick={debug}>debug</button> */}
                </div>

                <div className="w-full h-max">
                    {chartData && <LineChart chartData={chartData} desc={`รายงานยอดขาย`} title={""} />}
                </div>
            </div>

            <div className="w-full lg:w-4/12 flex flex-wrap gap-2">
                {/* <div className="flex-1 lg:w-full">
                    <div className="bg-white shadow-lg h-full">1</div>
                </div>
                <div className="flex-1 lg:w-full">
                    <div className="bg-white shadow-lg ">2</div>
                </div> */}
                <div className="bg-white shadow-lg grow lg:shrink lg:w-full">1</div>
                <div className="bg-white shadow-lg grow lg:shrink lg:w-full">2</div>
                <div className="bg-white shadow-lg grow lg:shrink lg:w-full">3</div>
                <div className="bg-white shadow-lg grow lg:shrink lg:w-full">4</div>
            </div>
        </div>
    )
}