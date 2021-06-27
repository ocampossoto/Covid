const axios = require('axios');
var fs = require('fs');

//Get token from arguments
const arguments = process.argv.slice(2);
let token;
let user;
if (arguments.length === 0) {
    console.log("Authorization token is not provided");
    return;

}
else {
    token = arguments[1];
    user = arguments[0];
}
var AllData = { 'US': {} };

function CSVStringToJSON(csvString) {
    //Fist row should be keys
    var arr = csvString.split("\n");
    arr.shift();
    arr.forEach(element => {
        var recordArr = element.split(",");
        if (recordArr.length > 1) {
            if (recordArr[1] != 'US') {
                return;
            }
            else {
                if (AllData['US'][recordArr[0]] === undefined) {
                    AllData['US'][recordArr[0]] = {}
                }
                AllData[recordArr[1]][recordArr[0]][recordArr[2]] = {
                    'Confirmed': recordArr[5],
                    'Deaths': recordArr[6],
                    'Recovered': recordArr[7],
                    'Active': recordArr[8],
                    'FIPS': recordArr[9],
                    'Incident_Rate': recordArr[10],
                    'People_Tested': recordArr[11],
                    'People_Hospitalized': recordArr[12],
                    'Mortality_Rate': recordArr[13],
                    'UID': recordArr[14],
                    'ISO3': recordArr[15],
                    'Testing_Rate': recordArr[16],
                    'Hospitalization_Rate': recordArr[17]
                }

            }
        }

    });
}


//Get data
axios.get('https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports_us/',
    { auth: { "username": user, "password": token } }
)
    .then(async res => {

        const fileList = res.data;
        for (var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            await axios.get(file["download_url"]).then(res => {
                var str = res.data;
                CSVStringToJSON(str);
                return;
            }).catch(e => {
                console.log(e.message, e);
            })
            process.stdout.write("Proccessing... "+ Math.round(i/fileList.length * 100)+"% \r");
        }
        //Save File
        fs.writeFileSync('../covidUSData.json', JSON.stringify(AllData, null, 2), err => {
            if (err) {
                console.error(err)
                return
            }
        });

    })
    .catch(err => {
        console.log('Error: ', err);
    });