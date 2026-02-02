function clearTheSheet(Attendance) {
  var app = SpreadsheetApp;
  var activeSpreadsheet = app.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getSheetByName("Attendance");

  if (!sheet) {
    Logger.log("Sheet not found: " + Attendance);
    return;
  }

  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  // Clear content from the second row to the last row and all columns
  if (lastRow > 1) { // Ensure there are rows to clear
    sheet.getRange(2, 1, lastRow - 1, lastColumn).clearContent();
  }
}
