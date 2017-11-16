# This script runs the diarization pipeline from an audio file to JSON output
# input: name, extension of audio file to be diarized

import WavConverter
import SegParser
import Diarizer
import sys

# strip the arguments
name = sys.argv[1]
tag = sys.argv[2]
filetype = sys.argv[3].lower()

# put the file in the correct format
WavConverter.translateAudioToWav(name,tag,filetype)

# run the lium jar on the wav file
Diarizer.runLium(name)

# translate the output to a JSON object
SegParser.translateSegToJSON(name)
