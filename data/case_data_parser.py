import json;

result = {}
data = {}
pops = {}

with open('./ld-case-counts-by-county-00-14.json') as json_file:
	data = json.load(json_file)

with open('./county_totals_2014.json') as json_file:
	pops = json.load(json_file)

for county in data:
	if county['STCODE'] != 0 and county['CTYCODE'] != 0:
		countyCode = str(county['CTYCODE'])
		if countyCode == '999':
			id = county['STCODE']
			for pop in pops:
				if id == pop['STATE'] and pop['COUNTY'] == 0:
					county['totalPop'] = pop['POPESTIMATE2014']
		else:
			for pop in pops:
				if pop['COUNTY'] == county['CTYCODE'] and pop['STATE'] == county['STCODE']:
					county['totalPop'] = pop['POPESTIMATE2014']
			if len(countyCode) == 1:
				countyCode = '00' + countyCode
			elif len(countyCode) == 2:
				countyCode = '0' + countyCode
			id = int(str(county['STCODE']) + countyCode)
		del county['STCODE']
		del county['CTYCODE']
		result[id] = county

with open('./2014data.json', 'w') as json_result:
	json.dump(result, json_result);
