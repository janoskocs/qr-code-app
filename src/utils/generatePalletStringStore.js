export const generatePalletString = (service, date, hour, pageCount = 1) => {
    let stringArr = []
    if (pageCount === 0) {
        stringArr.push(`PAL${service}${date.slice(0, 4)}${hour}1`)
    }

    for (let i = 1; i <= pageCount; i++) {
        // const palletNum = i < 10 ? `0${i}` : `${i}`; // Add leading zero for values less than 10
        stringArr.push(`PALSO${service}${date.slice(0, 4)}${hour}${i}`)
    }
    return stringArr
};
