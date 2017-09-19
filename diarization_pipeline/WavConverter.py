import sys
import pydub
from pydub import AudioSegment

def translateAudioToWav(tag,filetype):

    infile = '../data/audio/'+tag+'.'+filetype
    outfile = '../data/wav/'+tag+'.wav'
    print(infile)

    supportedInputTypes = {'mp3','ogg','mp4','flv','wma','aac'}
    directNames = {'ogg','flv','mp3'}

    if filetype in supportedInputTypes:
        method = getattr(AudioSegment,'from_file')
        if filetype in directNames:
            method = getattr(AudioSegment,'from_'+filetype)
        print(infile)
        wavData = method(infile)
        wavData.export(outfile,format="wav")
    else:
        print(filetype+'Is not a supported audio file type')
