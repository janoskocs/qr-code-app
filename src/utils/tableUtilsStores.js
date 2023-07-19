import schedule from "../data/storesData";

export const generateDates = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 9; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - 2 + i);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        const dayOfWeek = daysOfWeek[date.getDay()];
        dates.push({ date: formattedDate, day: dayOfWeek });
    }
    return dates;
};

export const generateHours = () => {
    return ["07:30", "08:15", "08:30", "11:00", "11:30", "12:00", "12:30", "13:00"];
};

export const generateCells = (dates, hours) => {
    const cells = [];

    for (let i = 0; i < hours.length; i++) {
        const row = [];

        for (let j = 0; j < dates.length; j++) {
            const day = dates[j].day;
            const hour = hours[i];

            let content = "";

            if (schedule[day] && schedule[day][hour]) {
                content = schedule[day][hour];
            }

            row.push(<td key={`${day}-${hour}`}>{content}</td>);
        }

        cells.push(row);
    }

    return cells;
};