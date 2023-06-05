export const generatePalletString = (service, date, hour, pageCount = '00') => {
    return `PAL${service}${date}${hour}${pageCount}`;
};
