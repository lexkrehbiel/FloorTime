# this module is intended to take in a .seg file and output a .json file,
# converting the .seg information into a json object, with fields indexed by key

import os

# run lium diarization on the files specified
def runLium(tag):
    javaPath = "/usr/bin/java "
    res = "-Xmx2024m "
    jar = "-jar "
    liumPath = "../vendors/lium.jar  "
    inputMask = "--fInputMask=../data/wav/"+tag+".wav "
    outputMask = "--sOutputMask=../data/seg/"+tag+".seg "
    options = "--doCEClustering "+tag;
    command =javaPath + res + jar + liumPath + inputMask + outputMask + options
    os.system(command)
