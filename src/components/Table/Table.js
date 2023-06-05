import { useState } from "react";

import { generateDates, generateHours, generateCells } from "../../utils/tableUtils";
import { generatePalletString } from "../../utils/generatePalletString";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";

import Modal from 'react-modal';

import "./Table.scss";

const Table = () => {

    //Modal
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const [selectedValue, setSelectedValue] = useState("10");

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleInputChange = (event) => {
        setSelectedValue(event.target.value);
    };
    //Generate QR Codes


    //Dates
    const dates = generateDates();
    const hours = generateHours();
    const cells = generateCells(dates, hours);

    const [selectedDateTime, setSelectedDateTime] = useState('');

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedHour, setSelectedHour] = useState("")
    const [service, setService] = useState("")

    const handleButtonClick = (date, hour, service) => {
        setSelectedDate(date.date.split("/").join(""))
        setSelectedHour(hours[hour].replace(':', ''));
        setService(service);
        setSelectedValue(Number(selectedValue))
        // const selectedHour = hours[hour].replace(':', '');)
        // const selectedDate = date.date.split("/").join("");
        // const serviceFirstChar = service.charAt(0);
        openModal()
    };

    const print = () => {
        console.log(generatePalletString(service, selectedDate, selectedHour, selectedValue)
        )
    }

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

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>How many QR codes would you like to print?</h2>

                <article className="pagecount">
                    <div className="pagecount__choice">
                        <label>
                            <input
                                type="radio"
                                value="00"
                                checked={selectedValue === "00"}
                                onChange={handleRadioChange}
                            />
                            1
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="10"
                                checked={selectedValue === 10}
                                onChange={handleRadioChange}
                            />
                            10
                        </label>
                        <label>
                            <input
                                type="text"
                                value={selectedValue}
                                onChange={handleInputChange}
                                onClick={() => setSelectedValue("")}
                            />
                            Custom
                        </label>
                    </div>

                    {service === "DHLUPS" ? <>
                        Select DHL or UPS
                        <label>
                            <input
                                type="radio"
                                value="DHL"
                                checked={service === "DHL"}
                                onChange={(e) => setService("DHL")}
                            />
                            DHL
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="UPS"
                                checked={service === "UPS"}
                                onChange={(e) => setService("UPS")}
                            />
                            UPS
                        </label></> : ""}
                    <div className="action">
                        <button onClick={closeModal}>Cancel</button>
                        <button className="pagecount__print-btn" onClick={print}>Print</button>
                    </div>

                </article>
            </Modal>
        </>
    );
};

export default Table;
