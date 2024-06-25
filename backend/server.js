const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
app.use(bodyParser.json());

app.post('/save-barcode', (req, res) => {
  const { barcode } = req.body;

  const filePath = 'barcodes.xlsx';
  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Barcode']]), 'Sheet1');
  }

  const worksheet = workbook.Sheets['Sheet1'];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  rows.push([barcode]);
  const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
  workbook.Sheets['Sheet1'] = newWorksheet;
  XLSX.writeFile(workbook, filePath);

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
