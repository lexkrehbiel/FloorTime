# This script runs the diarization pipeline from an audio file to JSON output
# input: name, extension of audio file to be diarized

import WavConverter
import SegParser
import Diarizer
import sys

# strip the arguments
tag = sys.argv[1];
filetype = sys.argv[2];

# put the file in the correct format
WavConverter.translateAudioToWav(tag,filetype)

# run the lium jar on the wav file
Diarizer.runLium(tag)

# translate the output to a JSON object
SegParser.translateSegToJSON(tag)
