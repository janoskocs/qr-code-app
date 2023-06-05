const TableRow = ({ hour, dates, hourIndex, cells, handleButtonClick }) => {
    return (
        <tr>
            <td>{hour}</td>
            {dates.map((date, dateIndex) => {
                let service = cells[hourIndex][dateIndex].props.children;

                return (
                    <td key={`${hour}-${dateIndex}`}>
                        {service === "NO_SERVICE" ? (
                            ""
                        ) : (
                            <button onClick={() => handleButtonClick(date, hourIndex, service)}>
                                {service}
                            </button>
                        )}
                    </td>
                );
            })}
        </tr>
    );
};

export default TableRow;