# this module is intended to take in a .wav file and output a .seg file,
# the diarization information from the .wav input
# input: tag (NOT including .wav) of the wav file

import os
useCustomLIUM = True

# run lium diarization on the files specified
def runLium(tag):

    dir = os.path.dirname(__file__)
    liumPath = os.path.join(dir, '../vendors/lium.jar')+" "
    outpath = '/tmp/'+tag+'.seg'
    inpath = '/tmp/'+tag+'.wav'

    # generate the command line components
    javaPath = "java "
    mem = "2028m"
    res = "-Xmx" + mem + " "
    jar = "-jar "
    bicSegThres = "1.7"
    bicCluThres = "2.5"
    vitDecThres = "250"
    clrCluThres = "1.7"
    inputMask = "--fInputMask="+inpath+" "
    outputMask = "--sOutputMask="+outpath+" "
    options = "--doCEClustering "+tag;
    if not useCustomLIUM:
        command =javaPath + res + jar + liumPath + inputMask + outputMask + options
    else:
        command = os.path.join(dir, "./diarization.sh") + ' ' + liumPath + ' ' + mem + ' ' + inpath + ' ' + outpath + ' ' + "/tmp" + ' ' + bicSegThres + ' ' + bicCluThres + ' ' + vitDecThres + ' ' + clrCluThres + ' ' + os.path.join(dir, "../data/models")
    # pass the generated command to the operating system
    os.system(command)

    return 0
