import { timeConvert } from "./utilDateTime";

export const dataChart = ({ arrData, bgcolor, bdcolor }) => {
    return {
        labels: arrData.map((e) => e.date),
        datasets: [{
            label: "Total ",
            data: arrData.map((e) => e.sum),
            backgroundColor: bgcolor,
            borderColor: bdcolor,
            borderWidth: 2
        }]
    }
};

export const arrForChartData = ({ dS, dRange, dataApi }) => {
    let arr = [];
    let dCount = dS; //ตัวเลขวันที่(หน่วยmillisec) ทำให้เพิ่มขึ้นครั้งละ24ชม. เพื่อใช้อ้างอิงวันที่ในแต่ละวัน
    const hrs24 = timeConvert(24, 'hrs', 'mil'); // return millisecond (24hrs)

    // ลูป dS+24ชม. จนกว่าจะมากกว่าวันสิ้นสุด(dE)
    for (let i = 0; i <= dRange; i++) {
        //dCount เปรียบเทียบกับวันที่จาก dataApi ด้วยการ filter จะได้อาร์เรย์ของข้อมูลที่ตรงกับวันที่นั้นๆมา
        const arrFilter = dataApi.filter(e => {
            const dt = new Date(e.create_date);
            const d = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
            const milD = new Date(d).getTime(); //return milliseconds
            return dCount == milD;
        });

        const dtC = new Date(dCount);
        const dC = dtC.getDate() + '-' + (dtC.getMonth() + 1);

        //ถ้า arrFilter มีสมาชิก (lenth > 0) ให้ sum มีค่าเท่ากับ total_order ใน arrFilter มารวมกัน ถ้าไม่ให้เท่ากับ 0
        const sum = arrFilter.length > 0 ? arrFilter.reduce((acc, cur) => acc += cur.total_order, 0) : 0;
        //เพิ่มเข้าไปในตัวแปร arr arr.push({date:'dCount', sum:'sum_total_order'})
        arr.push({ date: dC, sum });
        //เพิ่มค่า dCount+24ชม.
        dCount += hrs24;
    }
    return arr;
};