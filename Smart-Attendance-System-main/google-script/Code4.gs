function archiveCopy() {
  var file = DriveApp.getFileById("FILE_ID");
  var destination = DriveApp.getFolderById("FOLDER_ID");

  var timeZone = Session.getScriptTimeZone();
  var formattedDate = Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd 'HH:mm:ss'");
  var name = SpreadsheetApp.getActiveSpreadsheet().getName() + "Copy" + formattedDate;

  file.makeCopy(name, destination);
}

