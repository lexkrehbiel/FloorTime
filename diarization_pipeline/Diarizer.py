# this module is intended to take in a .wav file and output a .seg file,
# the diarization information from the .wav input
# input: tag (NOT including .wav) of the wav file

import os

# run lium diarization on the files specified
def runLium(tag):

    dir = os.path.dirname(__file__)
    liumPath = os.path.join(dir, '../vendors/lium.jar')+" "
    outpath = '/tmp/'+tag+'.seg'
    inpath = '/tmp/'+tag+'.wav'

    # generate the command line components
    javaPath = "java "
    res = "-Xmx2024m "
    jar = "-jar "
    inputMask = "--fInputMask="+inpath+" "
    outputMask = "--sOutputMask="+outpath+" "
    options = "--doCEClustering "+tag;
    command =javaPath + res + jar + liumPath + inputMask + outputMask + options
    # pass the generated command to the operating system
    os.system(command)

    #print(1/(1-1))

    return 0
