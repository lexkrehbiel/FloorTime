import WavConverter
import SegParser
import Diarizer
import sys

tag = sys.argv[1];
filetype = sys.argv[2];

# run the pipeline!

# put the file in the correct format
WavConverter.translateAudioToWav(tag,filetype)

# run the lium jar on the wav file
Diarizer.runLium(tag)

# translate the output to a JSON object
SegParser.translateSegToJSON(tag)
