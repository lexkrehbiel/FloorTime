# this module converts audio files to .wav files, for Diarization
# input:  tag (the name of the file) , extension

import sys
import pydub
from pydub import AudioSegment

def translateAudioToWav(name,tag,filetype):

    infile = '/tmp/'+tag+'.'+filetype
    outfile = '/tmp/'+name+'.wav'

    supportedInputTypes = {'mp3','ogg','mp4','flv','wma','aac','wav','mov'}
    directNames = {'ogg','flv','mp3'}

    # if this extension is valid for the pydub to convert it,
    if filetype.lower() in supportedInputTypes:

        # get the method to run the .wav conversion
        method = getattr(AudioSegment,'from_file')

        # if the method should reference the direct filetype, replace it
        # (this is a quirk of the pydub API)
        if filetype in directNames:
            method = getattr(AudioSegment,'from_'+filetype)

        # generate the wavdata
        wavData = method(infile)

        # export the wavdata to the data/wav directory
        wavData.export(outfile,format="wav")
    else:
        # note the error
        print(filetype+' is not a supported audio file type')
