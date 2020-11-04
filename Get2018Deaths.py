# open file
# go through and extract:
#   Cause of death, Deaths, Crude Rate
# Save in Dictionary as {"Cause Of Death":{"Deaths": ####, "Crude Rate"}}
# Save as json file
import csv
# import re
import json 
AllDATA = []
with open("Underlying Cause of Death 2018.csv") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    residential_count = 0
    for row in csv_reader:
        # print(row["Cause of death"], row["Deaths"], row["Crude Rate"])
        AllDATA.append({"name": row["Causes of Death"] + " (2018)", "Deaths": row["Deaths"], "Crude Rate":row["Crude Rate"]})

# print(AllDATA)

with open('./covidstats/src/Deaths2018.json', 'w') as fp:
    json.dump(AllDATA, fp)