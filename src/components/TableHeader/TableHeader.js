const TableHeader = ({ dates }) => {

    return (
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
    );
};

export default TableHeader;