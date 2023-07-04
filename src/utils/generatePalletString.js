export const generatePalletString = (service, date, hour, pageCount = 1) => {
    let stringArr = []

    if (pageCount === 0) {
        stringArr.push(`PAL${service.charAt(0)}${date}${hour}01`)
    }

    for (let i = 1; i <= pageCount; i++) {
        const palletNum = i < 10 ? `0${i}` : `${i}`; // Add leading zero for values less than 10
        stringArr.push(`PAL${service.charAt(0)}${date}${hour}${palletNum}`)
    }
    return stringArr
};
