function onOpen() {
  SpreadsheetApp
    .getActiveSpreadsheet()
    .addMenu('管理', [
      {name: 'Jamfからデータ取得', functionName: 'getJamf'},
    ]);
}

function getJamf() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("getJamfData");

  var values = new Array();

  // スプレッドシートのタイトル部分
  values.push(['No', 'SerialNumber', 'Asset Tag', 'Device Status', 'Model', 'po_date', '2y', '3y', 'Processor', 'Memory', 'Disk', 'keyboard', 'RealName']);

  const API_URL = '<JAMF URL>'
  // ClassicAPIはBasic認証なのでCredentialをBase64エンコードする
  // username:passwordはAPIアクセス用のJamfアカウントを作成し指定する
  const auth_data = Utilities.base64Encode('<ユーザ名>:<パスワード>');

  var options = {
    'method' : 'GET',
    'contentType': 'application/json',
    'headers': {'Authorization' : 'Basic ' + auth_data,
                'accept' : 'application/json'},
  };
  
  // 全てのコンピューター一覧を取得
  const response = UrlFetchApp.fetch(API_URL + 'computers', options);
  var cont = JSON.parse(response.getContentText('UTF-8'));

  // コンピュータごとに処理する
  for (let i=0; i<cont.computers.length; i++) {  
    var computer = cont.computers[i];
    
    // 個別のコンピュータの情報を取る
    const _comResponse = UrlFetchApp.fetch(API_URL + 'computers/id/' + computer.id, options);
    var _comres = JSON.parse(_comResponse.getContentText('UTF-8')); 
    Logger.log(_comres.computer.purchasing)
    //Logger.log(_comres.computer.general)

    // スプレッドシートに出力するデータを取る
    let serial_number = _comres.computer.general.serial_number;
    let asset_tag = _comres.computer.general.asset_tag;
    let extension_attributes = _comres.computer.extension_attributes;
    let model = _comres.computer.hardware.model;
    let processor_type = _comres.computer.hardware.processor_type;
    let processor_speed_ghz = Number(_comres.computer.hardware.processor_speed_mhz) / 1000;
    let total_ram_gb = Number(_comres.computer.hardware.total_ram_mb) / 1024;
    let disk_size = Math.round(Number((_comres.computer.hardware.storage[0].size) / 1000) * 10) /10;
    let realname = _comres.computer.location.realname;
    let po_date = _comres.computer.purchasing.po_date;
    Logger.log(extension_attributes)
    //const device_status = '';
    
    // スプレッドシートに出力する拡張属性のデータを取る
    for (let j=0; j<extension_attributes.length; j++){
      if(extension_attributes[j].name == 'Device Status'){
          device_status = extension_attributes[j].value;
      } else if(extension_attributes[j].name == 'KeyboardLayout'){
          keyboard = extension_attributes[j].value;
      } else if(extension_attributes[j].name == '2years'){
          years2 = extension_attributes[j].value;
      } else if(extension_attributes[j].name == '3years'){
          years3 = extension_attributes[j].value;
      }
    }
    //Logger.log(years2)
    //Logger.log(years3)
    //Logger.log(extension_attributes)

    // 出力するデータを配列に設定
    values.push([i+1, serial_number, asset_tag, device_status, model, po_date, years2, years3, processor_type + ' ' + processor_speed_ghz, total_ram_gb , disk_size, keyboard, realname]); 

  }
  //Logger.log(values)

  // シートのクリア
  sheet.clear();
  let filter = sheet.getFilter();
  if( filter != null ){
    sheet.getFilter().remove();
  }
  
  // スプレッドシートへのデータ投入
  sheet.getRange(1, 1, values.length, 13).setValues(values);
  sheet.getRange(1,1,1,13).createFilter();
  sheet.getFilter().removeColumnFilterCriteria(4);
}
