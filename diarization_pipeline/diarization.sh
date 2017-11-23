#!/bin/bash

PATH=$PATH:..:.

input=$3
output=$4
BICSegThreshold=$6
BICClusThreshold=$7
ViterbiDecodicThreshold=$8
CLRClusteringThreshold=$9

mem=$2
show=`basename $input .sph`
show=`basename $show .wav`

echo $show

#need JVM 1.6
java=java

datadir=$5/${show}

pmsgmm=${10}/sms.gmms
sgmm=${10}/s.gmms
ggmm=${10}/gender.gmms
ubm=${10}/ubm.gmm

#uem=./sph/$show.uem.seg

LOCALCLASSPATH=$1

echo "#####################################################"
echo "#   $show"
echo "#####################################################"

mkdir -p $datadir >& /dev/null

features=$datadir/%s.mfcc
fDescStart="audio16kHz2sphinx,1:1:0:0:0:0,13,0:0:0"
fDesc="sphinx,1:1:0:0:0:0,13,0:0:0"
fDescD="sphinx,1:3:2:0:0:0,13,0:0:0:0"
fDescLast="sphinx,1:3:2:0:0:0,13,1:1:0:0"
fDescCLR="sphinx,1:3:2:0:0:0,13,1:1:300:4"



echo compute the MFCC
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.tools.Wave2FeatureSet --help --fInputMask=$input --fInputDesc=$fDescStart --fOutputMask=$features --fOutputDesc=$fDesc $show

echo check the MFCC 
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MSegInit   --help --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$uem --sOutputMask=$datadir/%s.i.seg  $show

echo BIC based segmentation, make small segments
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MSeg   --kind=FULL --sMethod=BIC -sThr=$BICSegThreshold  --help --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$datadir/%s.i.seg --sOutputMask=$datadir/%s.s.seg  $show

echo BIC linear clustering
l=2
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MClust    --help --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$datadir/%s.s.seg --sOutputMask=$datadir/%s.l.seg --cMethod=l --cThr=$BICClusThreshold $show

echo BIC hierarchical clustering
h=3
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MClust    --help --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$datadir/%s.l.seg --sOutputMask=$datadir/%s.h.$h.seg --cMethod=h --cThr=$BICClusThreshold $show

echo  initialize GMM
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MTrainInit   --help --nbComp=8 --kind=DIAG --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$datadir/%s.h.$h.seg --tOutputMask=$datadir/%s.init.gmms $show

echo  EM computation
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MTrainEM   --help  --nbComp=8 --kind=DIAG --fInputMask=$features --fInputDesc=$fDesc --sInputMask=$datadir/%s.h.$h.seg --tOutputMask=$datadir/%s.gmms  --tInputMask=$datadir/%s.init.gmms  $show 

echo Viterbi decoding
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MDecode    --help --fInputMask=${features} --fInputDesc=$fDesc --sInputMask=$datadir/%s.h.$h.seg --sOutputMask=$datadir/%s.d.$h.seg --dPenality=250  --tInputMask=$datadir/%s.gmms $show

echo ----------------
echo Speech/Music/Silence segmentation
pmsseg=$datadir/$show.pms.seg
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MDecode  --help  --fInputDesc=$fDescD --fInputMask=$features --sInputMask=$datadir/%s.i.seg --sOutputMask=$pmsseg --dPenality=10,10,50 --tInputMask=$pmsgmm $show

echo filter spk segmentation according pms segmentation
fltseg=$datadir/$show.flt.$h.seg
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.tools.SFilter --help  --fInputDesc=$fDescD --fInputMask=$features --fltSegMinLenSpeech=150 --fltSegMinLenSil=25 --sFilterClusterName=j --fltSegPadding=25 --sFilterMask=$pmsseg --sInputMask=$datadir/%s.d.$h.seg --sOutputMask=$fltseg $show

echo Set gender and bandwith
gseg=$datadir/$show.g.$h.seg
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MScore --help  --sGender --sByCluster --fInputDesc=$fDescLast --fInputMask=$features --sInputMask=$fltseg --sOutputMask=$gseg --tInputMask=$ggmm $show

#CLR clustering
# Features contain static and delta and are centered and reduced (--fdesc)
echo CLR Clustering
spkseg=$datadir/$show.c.$h.seg
java -Xmx2048m -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MClust  --help --trace --fInputMask=$features --fInputDesc=$fDescCLR --sInputMask=$gseg --sOutputMask=$spkseg --cMethod=ce --cThr=$CLRClusteringThreshold --tInputMask=$ubm --emCtrl=1,5,0.01 --sTop=5,$ubm --tOutputMask=$datadir/$show.c.gmm $show

sleep 0.3

cp $spkseg $output
