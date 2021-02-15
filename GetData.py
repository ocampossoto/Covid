import urllib.request, json 
import csv
import codecs

import sys
if(len(sys.argv) != 2):
    print("No paramaters to run.")
    exit()

header = {"Authorization":  sys.argv[1]}

AllDATA = {"US": {}}
#['Province_State', 'Country_Region', 'Last_Update', 'Lat', 'Long_', 'Confirmed', 'Deaths', 'Recovered', 'Active', 'FIPS', 'Incident_Rate', 'People_Tested', 'People_Hospitalized', 'Mortality_Rate', 'UID', 'ISO3', 'Testing_Rate', 'Hospitalization_Rate']
def do_stuff(DATA):
    if(DATA[1] != 'US'):
        return
    if(DATA[0] != 'Recovered'):
        if(DATA[0] not in AllDATA[DATA[1]]):
            AllDATA[DATA[1]][DATA[0]] = {}
        AllDATA[DATA[1]][DATA[0]][DATA[2]] = {
            'Confirmed': DATA[5], 
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
    

data = [] #temp data
## get list of files. 
request = urllib.request.Request("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports_us/", headers=header)
with urllib.request.urlopen(request) as response:
    data = json.loads(response.read().decode())
    
#remove header
data.pop()
print("Starting Proccess...")
##Convert data in each file to json
#count = 0#for debuging
for i in data:
    #for debuging 
    #count+=1
    #print(str(round((count/len(data))*100))+ "%")
    ftpstream = urllib.request.urlopen(i["download_url"]+"?u=ocampossoto")
    csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'))
    for line in csvfile:
        do_stuff(line)
print("Complete writing file...")
with open('CovidDataUS.json', 'w') as fp:
    json.dump(AllDATA, fp)

