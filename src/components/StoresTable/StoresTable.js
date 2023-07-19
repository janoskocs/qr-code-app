import { useState, useEffect } from "react";

import { generateDates, generateHours, generateCells } from "../../utils/tableUtilsStores";
import { generatePalletString } from "../../utils/generatePalletStringStore";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";

import Modal from 'react-modal';
import jsPDF from 'jspdf';
import { toDataURL } from 'qrcode';
import "./StoresTable.scss";

const StoresTable = () => {

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

    const [selectedValue, setSelectedValue] = useState("9");
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
            doc.text(strings[i], doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 20, {
                align: 'center',
                baseline: 'bottom',
            });


            let service = strings[i].slice(5, 6)

            if (service === "P") {
                doc.text("PHO", doc.internal.pageSize.getWidth() / 2 - 30, 35, {
                    align: 'center',
                    baseline: 'center',
                });
            }
            if (service === "C") {
                doc.text("CP", doc.internal.pageSize.getWidth() / 2 - 30, 35, {
                    align: 'center',
                    baseline: 'center',
                });
            }

            if (service === "M") {
                doc.text("M87", doc.internal.pageSize.getWidth() / 2 - 30, 35, {
                    align: 'center',
                    baseline: 'center',
                });
            }

            if (service === "W") {
                doc.text("W36", doc.internal.pageSize.getWidth() / 2 - 30, 35, {
                    align: 'center',
                    baseline: 'center',
                });
            }
            if (service === "H") {
                doc.text("SHARD", doc.internal.pageSize.getWidth() / 2 - 30, 35, {
                    align: 'center',
                    baseline: 'center',
                });
            }

            let hour = strings[i].slice(-5, -3) + ":" + strings[i].slice(-3, -1)
            doc.text(hour, doc.internal.pageSize.getWidth() / 2 + 30, 35, {
                align: 'center',
                baseline: 'center',
            });

            // Add QR code
            const qrCodeDataURL = await toDataURL(strings[i], { width: qrCodeSize, height: qrCodeSize });
            // doc.addImage(qrCodeDataURL, 'JPEG', doc.internal.pageSize.getWidth() / 2 - qrCodeSize / 2, topMargin + fontSize + qrCodeMargin, qrCodeSize, qrCodeSize);
            doc.addImage(qrCodeDataURL, 'JPEG', doc.internal.pageSize.getWidth() / 2 - qrCodeSize / 2, doc.internal.pageSize.getHeight() / 2 - qrCodeSize / 2, qrCodeSize, qrCodeSize);

        }

        doc.save('output.pdf');
        window.location.reload(false);
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

            {/* <section className="custom">
                <button className="custom__btn" onClick={() => setIsCustomOpen(true)}>Create custom QR code</button>
            </section> */}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="modal">
                    <h2 className="modal__title" ref={(_subtitle) => (subtitle = _subtitle)}></h2>
                    <h2 className="modal__title">Quantity of pallets</h2>

                    <article className="pagecount">
                        <div className="pagecount__choice">
                            <label htmlFor="palletcount__input" className="modal__label">
                                Enter quantity:
                            </label>
                            <input
                                type="text"
                                value={selectedValue}
                                onChange={handleInputChange}
                                onClick={() => setSelectedValue("")}
                                className="palletcount__input"
                            />
                        </div>

                        {service === "W36SH" ? <>
                            <p className="modal__text">Select W36 or SHARD</p>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="W36"
                                    checked={service === "W36"}
                                    onChange={(e) => setService("W36")}
                                />
                                W36
                            </label>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="HO"
                                    checked={service === "HO"}
                                    onChange={(e) => setService("HO")}
                                />
                                SHARD
                            </label></> : ""}

                        {service === "CPM87" ? <>
                            <p className="modal__text">Select CP or M87</p>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="CP"
                                    checked={service === "CP"}
                                    onChange={(e) => setService("CP")}
                                />
                                CP
                            </label>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="M87"
                                    checked={service === "M87"}
                                    onChange={(e) => setService("M87")}
                                />
                                M87
                            </label></> : ""}
                        {service === "M87W36" ? <>
                            <p className="modal__text">Select M87 or W36</p>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="M87"
                                    checked={service === "M87"}
                                    onChange={(e) => setService("M87")}
                                />
                                M87
                            </label>
                            <label className="modal__label">
                                <input
                                    className="modal__radio"
                                    type="radio"
                                    value="W36"
                                    checked={service === "W36"}
                                    onChange={(e) => setService("W36")}
                                />
                                W36
                            </label></> : ""}
                        <div className="action">
                            <button className="action__cancel" onClick={closeModal}>Cancel</button>
                            <button className="action__print" onClick={print}>Print</button>
                        </div>
                    </article>
                </div>

            </Modal>

            {/*  Custom modal */}

            {/* <Modal
                isOpen={isCustomOpen}
                onAfterOpen={afterOpenModal}
                style={customStyles}
            >
                <h2 className="modal__title" ref={(_subtitle) => (subtitle = _subtitle)}>Custom pallet</h2> */}
            <article className="custom-wrapper">
                <div className="palletinfo">
                    <p className="modal__text">Service</p>
                    <div className="palletinfo__service">
                        <label className="modal__label">
                            <input
                                className="modal__radio"
                                type="radio"
                                value="PHO"
                                checked={service === "PHO"}
                                onChange={(e) => setService("PHO")}
                            />
                            PHO
                        </label>
                        <label className="modal__label">
                            <input
                                className="modal__radio"
                                type="radio"
                                value="CP"
                                checked={service === "CP"}
                                onChange={(e) => setService("CP")}
                            />
                            CP
                        </label>
                        <label className="modal__label">
                            <input
                                className="modal__radio"
                                type="radio"
                                value="M87"
                                checked={service === "M87"}
                                onChange={(e) => setService("M87")}
                            />
                            M87
                        </label>
                        <label className="modal__label">
                            <input
                                className="modal__radio"
                                type="radio"
                                value="W36"
                                checked={service === "W36"}
                                onChange={(e) => setService("W36")}
                            />
                            W36
                        </label>
                        <label className="modal__label">
                            <input
                                className="modal__radio"
                                type="radio"
                                value="HO"
                                checked={service === "HO"}
                                onChange={(e) => setService("HO")}
                            />
                            SHARD
                        </label>
                    </div>
                    <div className="palletinfo">
                        <input className="palletinfo__input" type="date" onChange={(e) => { setDate(e.target.value) }} />
                        <input className="palletinfo__input" type="time" onChange={(e) => { setSelectedHour(e.target.value.replace(":", "")) }} />
                    </div>
                </div>
                <div className="pagecount__choice">
                    <label htmlFor="palletcount__input" className="modal__label">
                        Enter quantity:
                    </label>
                    <input
                        type="text"
                        value={selectedValue}
                        onChange={handleInputChange}
                        onClick={() => setSelectedValue("")}
                        className="palletcount__input"
                    />
                </div>
                <div className="action">
                    <button className="action__cancel" onClick={(e) => setIsCustomOpen(false)}>Cancel</button>
                    <button className="action__print" onClick={print}>Print</button>
                </div>
            </article>
            {/* </Modal> */}
        </>
    );
};

export default StoresTable;
