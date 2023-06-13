import { useState, useEffect } from "react";

import { generateDates, generateHours, generateCells } from "../../utils/tableUtils";
import { generatePalletString } from "../../utils/generatePalletString";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";

import Modal from 'react-modal';
import jsPDF from 'jspdf';
import { toDataURL } from 'qrcode';
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
    const [isCustomOpen, setIsCustomOpen] = useState(false)

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
    const handleInputChange = (event) => {
        setSelectedValue(event.target.value);
    };

    //Dates
    const dates = generateDates();
    const hours = generateHours();
    const cells = generateCells(dates, hours);

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedHour, setSelectedHour] = useState("")
    const [service, setService] = useState("")

    const setDate = (date) => {
        let newDateString = date.split("-").join("")
        setSelectedDate(`${newDateString.slice(6, 8)}${newDateString.slice(4, 6)}${newDateString.slice(2, 4)}`)
    }
    const handleButtonClick = (date, hour, service) => {
        setSelectedDate(date.date.split("/").join(""))
        setSelectedHour(hours[hour].replace(':', ''));
        setService(service);
        setSelectedValue(Number(selectedValue))
        openModal()
    };

    const [palletStringArr, setPalletStringArr] = useState([])
    const print = () => {

        const updatedPalletStringArr = generatePalletString(service, selectedDate, selectedHour, selectedValue);
        setPalletStringArr(updatedPalletStringArr);
    };
    useEffect(() => {
        if (palletStringArr.length > 0) {
            generatePDF(palletStringArr)
            window.location.reload(false);
        }

    }, [palletStringArr]);

    const generatePDF = async (strings) => {
        const doc = new jsPDF('landscape');
        const fontSize = 40; // Adjust the font size as per your requirements
        const topMargin = 10; // Adjust the top margin as per your requirements
        const qrCodeSize = 130; // Adjust the QR code size as per your requirements
        const qrCodeMargin = 10; // Adjust the margin between the text and QR code as per your requirements

        for (let i = 0; i < strings.length; i++) {
            if (i > 0) {
                doc.addPage('landscape');
            }

            // Add text
            doc.setFontSize(fontSize);
            doc.text(strings[i], doc.internal.pageSize.getWidth() / 2, topMargin, {
                align: 'center',
                baseline: 'top',
            });

            let service = strings[i].slice(3, 4)

            if (service === "D") {
                doc.text("DHL", doc.internal.pageSize.getWidth() / 2, 40, {
                    align: 'center',
                    baseline: 'center',
                });
            }
            if (service === "U") {
                doc.text("UPS", doc.internal.pageSize.getWidth() / 2, 40, {
                    align: 'center',
                    baseline: 'center',
                });
            }

            if (service === "B") {
                doc.text("BLK", doc.internal.pageSize.getWidth() / 2, 40, {
                    align: 'center',
                    baseline: 'center',
                });
            }

            let hour = strings[i].slice(10, 12) + ":" + strings[i].slice(12, 14)
            doc.text(hour, doc.internal.pageSize.getWidth() / 2, 55, {
                align: 'center',
                baseline: 'center',
            });

            // Add QR code
            const qrCodeDataURL = await toDataURL(strings[i], { width: qrCodeSize, height: qrCodeSize });
            doc.addImage(qrCodeDataURL, 'JPEG', doc.internal.pageSize.getWidth() / 2 - qrCodeSize / 2, topMargin + fontSize + qrCodeMargin, qrCodeSize, qrCodeSize);
        }

        doc.save('output.pdf');
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

            <section className="custom">
                <h4 className="custom__title">Custom QR Code</h4>
                <button onClick={() => setIsCustomOpen(true)}>Custom</button>
            </section>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>How many QR codes would you like to print?</h2>

                <article className="pagecount">
                    <div className="pagecount__choice">
                        <label htmlFor="palletcount__input">
                            Quantity of pallets
                        </label>
                        <input
                            type="text"
                            value={selectedValue}
                            onChange={handleInputChange}
                            onClick={() => setSelectedValue("")}
                            className="palletcount__input"
                        />
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

            {/*  Custom modal */}

            <Modal
                isOpen={isCustomOpen}
                onAfterOpen={afterOpenModal}
                style={customStyles}
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Custom pallet</h2>
                <article>
                    <div className="palletinfo">
                        <p>Service</p>
                        <div className="palletinfo__service">
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
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="BLK"
                                    checked={service === "BLK"}
                                    onChange={(e) => setService("BLK")}
                                />
                                BLK
                            </label>
                        </div>
                        <div className="palletinfo__date">
                            <input type="date" onChange={(e) => { setDate(e.target.value) }} />
                            <input type="time" onChange={(e) => { setSelectedHour(e.target.value.replace(":", "")) }} />
                        </div>
                    </div>
                    <div className="action">
                        <button onClick={(e) => setIsCustomOpen(false)}>Cancel</button>
                        <button className="pagecount__print-btn" onClick={print}>Print</button>
                    </div>
                </article>
            </Modal>
        </>
    );
};

export default Table;
