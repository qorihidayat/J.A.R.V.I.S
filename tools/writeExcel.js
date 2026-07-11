const ExcelJS = require("exceljs");

async function writeExcel(filePath, actions) {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    for (const action of actions) {

        const worksheet = workbook.getWorksheet(action.sheetName);

        switch (action.type) {

            case "setValue":

                worksheet.getCell(action.cell).value = action.value;

                break;

            case "setFormula":

                worksheet.getCell(action.cell).value = {
                    formula: action.formula
                };

                break;

            default:

                console.log("Unknown Action:", action.type);

        }

    }

    await workbook.xlsx.writeFile(filePath);

    return "Excel updated.";

}

module.exports = {
    writeExcel
};