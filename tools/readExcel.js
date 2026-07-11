const ExcelJS = require("exceljs");

async function readExcel(filePath) {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    const columns = [];
    const rows = [];

    // Mapping Header
    worksheet.getRow(1).eachCell((cell, colNumber) => {

        columns.push({
            letter: cell.address.replace(/[0-9]/g, ""), // A, B, C...
            name: cell.value
        });

    });

    // Data
    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber === 1) return;

        const obj = {};

        columns.forEach((column, index) => {

            obj[column.name] = row.getCell(index + 1).value;

        });

        rows.push(obj);

    });

    return {
        sheetName: worksheet.name,
        columns,
        rows
    };

}

module.exports = {
    readExcel
};