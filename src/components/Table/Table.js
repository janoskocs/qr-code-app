import { useState } from "react";

import { generateDates, generateHours, generateCells } from "../../utils/tableUtils";
import { generatePalletString } from "../../utils/generatePalletString";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";

import "./Table.scss";

const Table = () => {
    const dates = generateDates();
    const hours = generateHours();
    const cells = generateCells(dates, hours);

    const [selectedDateTime, setSelectedDateTime] = useState('');

    const handleButtonClick = (date, hour, service) => {
        const selectedDate = date.date.split("/").join("");
        const selectedHour = hours[hour].replace(':', '');

        const serviceFirstChar = service.charAt(0);
        setSelectedDateTime(generatePalletString(serviceFirstChar, selectedDate, selectedHour));
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
