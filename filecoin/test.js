import axios from 'axios';
import xlsx from 'node-xlsx';
import fs from 'fs';
import {varIDTop1000Arr} from './var.js';
import {sendPostRequest} from './utils/request.js';

// var excelData = [
//     [
//         'id',
//         new Date('2022-08-10T06:46:30.000Z'),
//     ],
//     [
//         'f02',
//         22
//     ]
// ];


// 返回两个数组
const getBalanceArrById = async (userID) => {
    const url = 'https://api.filscan.io:8700/rpc/v1';
    const postData = {
        "id": 1,
        "jsonrpc": "2.0",
        "params": [
            userID,
            "1y"
        ],
        "method": "filscan.GeneralAddressBalanceTrend"
    }

    const result = await sendPostRequest(url, postData);
    const balanceArr = result.result;
    let arrName = [];
    let arrBalance = [];

    if (balanceArr == null){
        console.log(userID, '有问题');
    }
    for (let i = 0; i < balanceArr.length; i++){
        let element = balanceArr[i]
        const utcDate = new Date(element.block_time * 1000);
        arrName.push(new Date(utcDate))

        const balance = element.balance.substring(0, element.balance.length - 18) * 1;
        arrBalance.push(balance);
    }
    arrName.push('userID');
    arrBalance.push(userID);
    arrName = arrName.reverse()
    arrBalance = arrBalance.reverse();
    return {arrName, arrBalance};
}

const operateExcel = async (filePath, sheetName, excelData) => {
    const buffer = xlsx.build([{name: sheetName, data: excelData}], {}); // Returns a buffer
    // 写入文件
    fs.writeFile(filePath, buffer, function(err) {
        if (err) {
            console.log("Write failed: " + err);
            return;
        }

        console.log("Write completed.");
    });

}

(async () => {

    let excelData = []
    for (let i = 500; i < varIDTop1000Arr.length; i++){
        let result = await getBalanceArrById(varIDTop1000Arr[i]);
    
        if (i == 0 || i == varIDTop1000Arr.length - 1){
            excelData.push(result.arrName);
        }
        
        excelData.push(result.arrBalance);
        console.log(i, "finished");
    }
    await operateExcel('./top3.xlsx', 'top1000', excelData);

})().then().catch();

