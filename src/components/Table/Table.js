import { useState } from "react";

import { generateDates, generateHours, generateCells } from "../../utils/tableUtils";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";

import "./Table.scss";

const Table = () => {
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
                <TableHeader dates={dates} />
                <tbody className="table__body">
                    {hours.map((hour, hourIndex) => (
                        <TableRow
                            key={hourIndex}
                            hour={hour}
                            dates={dates}
                            hourIndex={hourIndex}
                            cells={cells}
                            handleButtonClick={handleButtonClick}
                        />
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
