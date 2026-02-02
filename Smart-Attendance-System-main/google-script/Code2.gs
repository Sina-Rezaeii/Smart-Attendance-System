function doGet() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = doc.getSheetByName("Attendance");

  // Get the range dynamically based on the data in the sheet
  const range = sheet.getDataRange();
  const values = range.getDisplayValues();

  // Skip the header row and map the data
  const result = values.slice(1).map((row) => ({
    Name: row[0],
    UID: row[1],
    Date: row[2],
    Time_In: row[3],
    Time_Out: row[4]
  }));

  return ContentService.createTextOutput(JSON.stringify({data: result})).setMimeType(ContentService.MimeType.JSON);
}
