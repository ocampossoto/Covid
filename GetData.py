import urllib.request, json 
import csv
import codecs
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
import sys


if(len(sys.argv) != 2):
    print("No paramaters to run.")
    exit()
if(sys.argv[1] == 'stage'):
    cred = credentials.Certificate('./stage.json')
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'frcscout-6d1d3.appspot.com'
    })
elif(sys.argv[0] == 'prod'):
    cred = credentials.Certificate('./prod.json')
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'gs://just-scout.appspot.com'
    })
else: 
    print('No Enviorment Selected.', sys.argv[1])
    exit()
bucket = storage.bucket()
AllDATA = {"US": {}}
#['Province_State', 'Country_Region', 'Last_Update', 'Lat', 'Long_', 'Confirmed', 'Deaths', 'Recovered', 'Active', 'FIPS', 'Incident_Rate', 'People_Tested', 'People_Hospitalized', 'Mortality_Rate', 'UID', 'ISO3', 'Testing_Rate', 'Hospitalization_Rate']
def do_stuff(DATA):
    if(DATA[1] != 'US'):
        return
    
    
    if(DATA[0] != 'Recovered'):
        if(DATA[0] not in AllDATA[DATA[1]]):
            AllDATA[DATA[1]][DATA[0]] = {}
        AllDATA[DATA[1]][DATA[0]][DATA[2]] = {'Confirmed': DATA[5], 
                        'Deaths' : DATA[6], 
                        'Recovered': DATA[7], 
                        'Active': DATA[8], 
                        'FIPS': DATA[9], 
                        'Incident_Rate': DATA[10], 
                        'People_Tested': DATA[11], 
                        'People_Hospitalized': DATA[12], 
                        'Mortality_Rate': DATA[13], 
                        'UID': DATA[14], 
                        'ISO3': DATA[15], 
                        'Testing_Rate': DATA[16], 
                        'Hospitalization_Rate': DATA[17]}
    

header = {"Authorization": "2dac74a50c148d7ad1d334f1a87e8bebfc7929f7"}

data = [] #temp data
## get list of files. 
request = urllib.request.Request("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports_us/", headers=header)
with urllib.request.urlopen(request) as response:
    data = json.loads(response.read().decode())
    
#remove header
data.pop()
##Convert data in each file to json
for i in data:
    ftpstream = urllib.request.urlopen(i["download_url"]+"?u=ocampossoto")
    csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'))
    for line in csvfile:
        do_stuff(line)

with open('CovidData.json', 'w') as fp:
    json.dump(AllDATA, fp)


imagePath = "CovidData.json"
imageBlob = bucket.blob("covid/CovidData.json")
imageBlob.upload_from_filename(imagePath)
print(imageBlob.public_url)
