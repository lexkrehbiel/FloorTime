#!/bin/bash

LOCALCLASSPATH=./LIUM_SpkDiarization.jar
uem=./Assets/Training/sph/%s.uem.seg
sph=./Assets/Training/sph/%s.sph
audio=train_1
show=`basename $audio .sph`

echo Starting Threshold Training
#java -Xmx2024m -jar $LOCALCLASSPATH --help --thresholds=1.5:2.5,2.5:3.5,250.0:300,0:3.0 --loadInputSegmentation --fInputMask=$sph --sInputMask=$uem --sInput2Mask="./ref/%s.seg"  --doTuning=2 --doCEClustering  $show &> out.txt
java -Xmx2024m -jar $LOCALCLASSPATH --help --thresholds=1.5:2.5,2.5:3.5,250.0:300,0:3.0 --loadInputSegmentation --fInputMask=$sph --sInputMask=$uem  --doTuning=2 --doCEClustering  $show &> out.txt

#java -Xmx2024m -jar ./LIUM_SpkDiarization.jar --help --thresholds=1.5:2.5,2.5:3.5,250.0:300,0:3.0 --loadInputSegmentation --fInputMask=./Assets/Training/sph/%s.sph --sInputMask=./Assets/Training/sph/%s.uem.seg  --doTuning=2 --doCEClustering  train_1 &> out.txt
