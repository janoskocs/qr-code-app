import { useState } from "react";
import "./Table.scss";
import schedule from "../../data/data";

const Table = () => {
    const generateDates = () => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const dates = [];

        for (let i = 0; i < 9; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - 2 + i);
            const formattedDate = date.toLocaleDateString('en-GB'); // Format date as "05/06/2023"
            const dayOfWeek = daysOfWeek[date.getDay()];
            dates.push({ date: formattedDate, day: dayOfWeek });
        }
        return dates;
    };

    const generateHours = () => {
        return [
            '08:00', '11:00', '11:45', '13:00', '14:00', '15:00', '15:30',
            '16:00', '17:00', '18:00', '18:30', '19:00', '21:00'
        ];
    };

    const generateCells = (dates, hours) => {
        const cells = [];

        for (let i = 0; i < hours.length; i++) {
            const row = [];

            for (let j = 0; j < dates.length; j++) {
                const day = dates[j].day;
                const hour = hours[i];

                let content = '';

                if (schedule[day] && schedule[day][hour]) {
                    content = schedule[day][hour];
                }

                row.push(<td key={`${day}-${hour}`}>{content}</td>);
            }

            cells.push(row);
        }

        return cells;
    };

    const dates = generateDates();
    const hours = generateHours();
    const cells = generateCells(dates, hours);

    const [selectedDateTime, setSelectedDateTime] = useState('');

    const handleButtonClick = (date, hour, service) => {
        const selectedDate = new Date(date.date);
        const selectedHour = hours[hour].replace(':', ''); // Remove colon from the selected hour
        const formattedDate = selectedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).replace(/\//g, ''); // Remove slashes from the default formatted date
        const serviceFirstChar = service.charAt(0);
        setSelectedDateTime(`PAL${serviceFirstChar}${formattedDate}${selectedHour}`);
    };


    return (
        <>
            <table className="table">
                <thead className="table__head">
                    <tr className="table__row">
                        <th>Time</th>
                        {dates.map((date, index) => (
                            <th className="table__dates" key={index}>
                                {date.date}
                            </th>
                        ))}
                    </tr>
                    <tr className="table__row">
                        <th>Day</th>
                        {dates.map((date, index) => (
                            <th className="table__days" key={index}>
                                {date.day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table__body">
                    {hours.map((hour, hourIndex) => (
                        <tr key={hourIndex}>
                            <td>{hour}</td>
                            {dates.map((date, dateIndex) => {
                                let service = cells[hourIndex][dateIndex].props.children;

                                return <td key={`${hour}-${dateIndex}`}>
                                    {service === "NO_SERVICE" ? (
                                        ""
                                    ) : (
                                        <button onClick={() => handleButtonClick(date, hourIndex, service)}>
                                            {service}
                                        </button>
                                    )}
                                </td>


                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="test">
                <p>Selected Date and Time: {selectedDateTime}</p>
            </div>
        </>
    );
};

export default Table;
