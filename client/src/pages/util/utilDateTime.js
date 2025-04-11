// time ตัวเลข , origin(hrs,min,sec,mil) ,  dest(hrs,min,sec,mil)
export const timeConvert = (time, origin, dest) => {
    if (origin === 'hrs') {
        if (dest === 'mil') {
            return ((time * 60) * 60) * 1000;
        };
    };

    if (origin === 'mil') {
        if (dest === 'hrs') {
            return ((time / 1000) / 60) / 60;
        };
    };
};

export const fulfillTwoDigit = (t) => {
    if (t < 10) return '0' + t;
    return t;
};

export const getToDay = () => {
    const dt = new Date();
    const nowDate = dt.getDate();
    const nowMonth = dt.getMonth() + 1; // january is 0
    const nowYear = dt.getFullYear();
    return { nowDate, nowMonth, nowYear };
};

export const getDayoneuptoToday = () => {
    let dayStart = ''
    let dayEnd = ''
    const { nowDate, nowMonth, nowYear } = getToDay();
    dayStart = nowYear + '-' + fulfillTwoDigit(nowMonth) + '-01';
    dayEnd = nowYear + '-' + fulfillTwoDigit(nowMonth) + '-' + fulfillTwoDigit(nowDate);
    return { dayStart, dayEnd };
};

export const validateTimeDuration = (dayStart, dayEnd) => {
    if (!dayStart || !dayEnd) return { error: true };
    const s = new Date(dayStart);
    const e = new Date(dayEnd);

    const dS = new Date(s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate()).getTime(); // milliseconds
    const dE = new Date(e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()).getTime(); // milliseconds
    if (dS > dE) return { error: true };
    return { dS, dE, error: false };
};

export const hdlTimeDuration = (dayStart, dayEnd) => {
    if (!dayStart || !dayEnd) return { error: true };
    const { dS, dE, error } = validateTimeDuration(dayStart, dayEnd);
    if (error) return { error: true };
    // จำนวนวันที่เลือก ใช้เป็นจำนวนสมาชิกของอาร์เรย์
    const dRange = timeConvert((dE - dS), 'mil', 'hrs') / 24;
    return { dS, dE, dRange, error: false };
};