# This script runs the diarization pipeline from an audio file to JSON output
# input: name, extension of audio file to be diarized

import WavConverter
import SegParser
import Diarizer
import sys
import wave
import os

multi = "multi"
data= []
dir = os.path.dirname(__file__)

# for all files given
for i in range(1,len(sys.argv)-1,2):

    # strip the arguments
    tag = sys.argv[i];
    filetype = sys.argv[i+1].lower();

    # put the file in the correct format
    WavConverter.translateAudioToWav(tag,filetype)

    dir = os.path.dirname(__file__)
    fileName = os.path.join(dir, '../data/wav/'+tag+'.wav')

    w = wave.open(fileName, 'rb')
    data.append( [w.getparams(), w.readframes(w.getnframes())] )
    w.close()


# write the output
# outfile = os.path.join(dir, '../data/wav/'+tag+'.wav')
outfile = os.path.join(dir, '../data/wav/'+multi+'.wav')
#outfile = "/Users/lexieKrehbiel/Documents/SrProject/FloorTime/data/wav/multi.wav"
output = wave.open(outfile, 'wb')
output.setparams(data[0][0])
output.writeframes(data[0][1])
output.writeframes(data[1][1])
output.close()

# run the lium jar on the wav file
Diarizer.runLium(multi)

# translate the output to a JSON object
SegParser.translateSegToJSON(multi)
