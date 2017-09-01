# this module is intended to take in a .seg file and output a .json file,
# converting the .seg information into a json object, with fields indexed by key

import json

# store the segment data
segments = []

# store the metadata
meta = []

# store the name of each index
segmentKeyNames = ['showName','channelNumber','start','length','gender','band','environment','speaker']
metaKeyNames = ['speaker','FSScore','FTScore','MSScore','MTScore']

for i in range(83) :
    row = raw_input()
    cols = row.split()
    if cols[0] == ';;' :
        # strip the non-meaningful columns
        cols = [col for col in cols if (col not in [';;','cluster','[',']','='] and 'score' not in col)]
        # convert the array to key-value pairs
        dict_obj = dict(zip(metaKeyNames,cols))
        meta.append(dict_obj)
    else :
        # convert the array to key-value pairs
        dict_obj = dict(zip(segmentKeyNames,cols))
        segments.append(dict_obj)

# combine the data components into a single object
data = {'segments': segments, 'meta':meta};

# JSONify
JSON = json.dumps(data);

print(JSON)
