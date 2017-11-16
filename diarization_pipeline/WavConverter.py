# this module converts audio files to .wav files, for Diarization
# input:  tag (the name of the file) , extension

import sys
import pydub
from pydub import AudioSegment
import os

def translateAudioToWav(tag,filetype):

    dir = os.path.dirname(__file__)
    infile = os.path.join(dir, '../tmp/'+tag+'.'+filetype)
    outfile = os.path.join(dir, '../tmp/'+tag+'.wav')
    publicOutfile = os.path.join(dir, '../public/audio/'+tag+'.wav')

    # infile = '../tmp/'+tag+'.'+filetype
    # outfile = '../tmp/'+tag+'.wav'

    supportedInputTypes = {'mp3','ogg','mp4','flv','wma','aac','wav'}
    directNames = {'ogg','flv','mp3'}

    # if this extension is valid for the pydub to convert it,
    if filetype in supportedInputTypes:

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
        
        # export the wavdata to the public directory
        wavData.export(publicOutfile,format="wav")
    else:
        # note the error
        print(filetype+'Is not a supported audio file type')
