function doGet(e) { 
  Logger.log(JSON.stringify(e));
  var result = 'OK';
  if (e.parameter == 'undefined') {
    result = 'No_Parameters';
  } else {
    var sheet_id = 'SPREADSHEET_ID'; 	// Spreadsheet ID.
    var sheet_UD = 'User_Data';  // Sheet name for user data.
    var sheet_AT = 'Attendance';  // Sheet name for attendance.

    var sheet_open = SpreadsheetApp.openById(sheet_id);
    var sheet_user_data = sheet_open.getSheetByName(sheet_UD);
    var sheet_attendence = sheet_open.getSheetByName(sheet_AT);
    
    var sts_val = "";
    var uid_val = "";
    var uid_column = "B";
    var TI_val = "";
    var Date_val = "";
    
    for (var param in e.parameter) {
      Logger.log('In for loop, param=' + param);
      var value = stripQuotes(e.parameter[param]);
      Logger.log(param + ':' + e.parameter[param]);
      switch (param) {
        case 'sts':
          sts_val = value;
          break;

        case 'uid':
          uid_val = value;
          break;

        default:
      }
    }
    
    if (sts_val == 'reg') {
      var check_new_UID = checkUID(sheet_id, sheet_UD, 2, uid_val);
      
      if (check_new_UID == true) {
        result += ",regErr01"; 
        return ContentService.createTextOutput(result);
      }

      var getLastRowUIDCol = findLastRow(sheet_id, sheet_UD, uid_column);  
      var newUID = sheet_open.getRange(uid_column + (getLastRowUIDCol + 1));
      newUID.setValue(uid_val);
      result += ",R_Successful";
      
      return ContentService.createTextOutput(result);
    }
    
    if (sts_val == 'atc') {
      var FUID = findUID(sheet_id, sheet_UD, 2, uid_val);
      
      if (FUID == -1) {
        result += ",atcErr01";
        return ContentService.createTextOutput(result);
      } else {
        var get_Range = sheet_user_data.getRange("A" + (FUID + 2));
        var user_name_by_UID = get_Range.getValue();
        
        var Curr_Date = Utilities.formatDate(new Date(), "Asia/Jakarta", 'dd/MM/yyyy');
        var Curr_Time = Utilities.formatDate(new Date(), "Asia/Jakarta", 'HH:mm:ss');
        var Curr_Timestamp = new Date().getTime();
        
        // Get the last timestamp for this UID
        var lastTimestampRange = sheet_user_data.getRange("C" + (FUID + 2)); // Column "C" for last timestamp
        var lastTimestamp = lastTimestampRange.getValue();
        
        if (lastTimestamp && (Curr_Timestamp - lastTimestamp) < 60000) { // 60000 milliseconds = 1 minute
          result += ",atcErr02"; // atcErr02 = Cannot register again within one minute
          return ContentService.createTextOutput(result);
        }
        
        // Update the last timestamp for this UID
        lastTimestampRange.setValue(Curr_Timestamp);

        var data = sheet_attendence.getDataRange().getDisplayValues();
        var enter_data = "time_in";
        var num_row;

        if (data.length > 1) {
          for (var i = 0; i < data.length; i++) {
            if (data[i][1] == uid_val) {
              if (data[i][2] == Curr_Date) {
                if (data[i][4] == "") {
                  Date_val = data[i][2];
                  TI_val = data[i][3];
                  enter_data = "time_out";
                  num_row = i + 1;
                  break;
                } else {
                  enter_data = "time_in";
                }
              }
            }
          }
        }
        
        if (enter_data == "time_in") {
          sheet_attendence.insertRows(2);
          sheet_attendence.getRange("A2").setValue(user_name_by_UID);
          sheet_attendence.getRange("B2").setValue(uid_val);
          sheet_attendence.getRange("C2").setValue(Curr_Date);
          sheet_attendence.getRange("D2").setValue(Curr_Time);
          sheet_attendence.getRange("E2").setValue(""); // Reset Time Out
          SpreadsheetApp.flush();
          
          result += ",TI_Successful" + "," + user_name_by_UID + "," + Curr_Date + "," + Curr_Time;
          return ContentService.createTextOutput(result);
        }
        
        if (enter_data == "time_out") {
          sheet_attendence.getRange("E" + num_row).setValue(Curr_Time);
          result += ",TO_Successful" + "," + user_name_by_UID + "," + Date_val + "," + TI_val + "," + Curr_Time;
          return ContentService.createTextOutput(result);
        }
      }
    }
  }
}

function stripQuotes(value) {
  return value.replace(/^["']|['"]$/g, "");
}

function findLastRow(id_sheet, name_sheet, name_column) {
  var spreadsheet = SpreadsheetApp.openById(id_sheet);
  var sheet = spreadsheet.getSheetByName(name_sheet);
  var lastRow = sheet.getLastRow();

  var range = sheet.getRange(name_column + lastRow);

  if (range.getValue() !== "") {
    return lastRow;
  } else {
    return range.getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  }
}

function findUID(id_sheet, name_sheet, column_index, searchString) {
  var open_sheet = SpreadsheetApp.openById(id_sheet);
  var sheet = open_sheet.getSheetByName(name_sheet);
  var columnValues = sheet.getRange(2, column_index, sheet.getLastRow()).getValues();
  var searchResult = columnValues.findIndex(searchString);

  return searchResult;
}

function checkUID(id_sheet, name_sheet, column_index, searchString) {
  var open_sheet = SpreadsheetApp.openById(id_sheet);
  var sheet = open_sheet.getSheetByName(name_sheet); 
  var columnValues = sheet.getRange(2, column_index, sheet.getLastRow()).getValues();
  var searchResult = columnValues.findIndex(searchString);

  if (searchResult != -1) {
    sheet.setActiveRange(sheet.getRange(searchResult + 2, 3)).setValue("UID has been registered in this row.");
    return true;
  } else {
    return false;
  }
}

Array.prototype.findIndex = function(search) {
  if (search == "") return false;
  for (var i = 0; i < this.length; i++)
    if (this[i].toString().indexOf(search) > -1 ) return i;

  return -1;
}
