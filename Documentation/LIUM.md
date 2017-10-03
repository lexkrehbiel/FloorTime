# LIUM Notes

## Resources
Santa Barbara Corpus<br>
http://www.linguistics.ucsb.edu/research/santa-barbara-corpus#SBC001

Java 1.8 appears to have some problems with JDK 1.8 (Check below for project with new build script)<br>
https://github.com/ahmetaa/lium-diarization<br>
Build command: ant -d stand-alone-jar (requires that ant be installed)

## LIUM File Restrictions
Audio can be in Sphere format or Wave format (16kHz / 16bit PCM mono) [Auto-detected by extension]<br>
*.seg is the output file containing the segmentation

Script to convert audio to proper Wave format (16kHz/16bit PCM mono)<br>
ffmpeg -i test1.wav -acodec pcm_s16le -ac 1 -ar 16000 test2.wav

Tool Files
Input:
Diarization file (*.seg? File)
File containing acoustic vector or an audio file.


Diarization parameters (segmentation files)
Input
--sInputMask=<path> (Diarization file)
Can be
absolute path:					/home/myseg.seg
relative path from the current directory:	seg/myseg.seg
a path where the %s is substituted:		seg/%s.seg (%s is substituted by the show name param)

--sInputFormat

Output
-sOutputMask
-sOutputFormat


Feature Parameters (sound files)
Input:
-fInputMask
absolute path:			/home/myfile.mfcc
relative path:			file/myfile.wav
%s is substituted:		./file/%s.sph (like ./file/myshow.sph)

-fInputDesc=type[:deltatype] (e.g. ="audio16kHz2sphinx,1:3:2:0:0:0,13,1:1:300:4")


Output:
-fOutputMask
-fOutputDesc

![image](http://www-lium.univ-lemans.fr/diarization/lib/exe/fetch.php/diarization.png?cache=&w=584&h=700)

## Example of Model Creation Steps
#=fr.lium.spkDiarization<br>
Compute the MFCC (#.tools.Wave2FeatureSet)
* Convert .wav to .mfcc in test_out/t001/%s.mfcc<br>

Check the MFCC (#.programs.MsegInit)
* Performs safety checks on generated file<br>

GLR based segmentation, make small segments (#.programs.Mseg)
* Segmentation detection softare that finds instantaneous change point corresponding to segment boundaries. <br>

Segmentation: linear clustering (#.programs.MClust)
* Hierarchical agglomerative clustering. Using Gaussians only.<br>

hierarchical clustering (#.programs.MClust)<br>
initialize GMM (programs.MtrainInit)
* Initialize the GMMs<br>

EM computation (programs.MtrainEM)
* Train of a GMM using the EM algorithm<br>

Viterbi decoding (programs.MDecode)
* Basic Viterbi decoder using a set of GMMs<br>

Speech/Music/Silence segmentation (programs.MDecode)<br>
filter spk segmentation according pms segmentation (tools.Sfilter)
* <br>

Set gender and bandwith (programs.Mscore)
* A program that computes the likelihood scores given a set of GMMs<br>

ILP Clustering (programs.ivector.ILPClustering)


**Wave2FeatureSet**<br>
--fInputMask=./test_wav/t001-1.wav<br>
–fInputDesc=audio16kHz2sphinx,1:1:0:0:0:0,13,0:0:0<br>
--fOutputMask=././test_out/t001-1/%s.mfcc<br>
--fOutputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>

**MSegInit**<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=<br>
--sOutputMask=././test_out/t001-1/%s.i.seg<br>

**MSeg**<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=././test_out/t001-1/%s.i.seg<br>
--sOutputMask=././test_out/t001-1/%s.s.seg<br>

**MClust**<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=././test_out/t001-1/%s.s.seg<br>
--sOutputMask=././test_out/t001-1/%s.l.seg<br>

**MTrainInit**<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=././test_out/t001-1/%s.h.3.seg<br>
--tOutputMask=././test_out/t001-1/%s.init.gmms<br>

**MTrainEM**<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=././test_out/t001-1/%s.h.3.seg<br>
--tOutputMask=././test_out/t001-1/%s.gmms<br>
--tInputMask=././test_out/t001-1/%s.init.gmms<br>

**MDecode**
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--fInputDesc=sphinx,1:1:0:0:0:0,13,0:0:0<br>
--sInputMask=././test_out/t001-1/%s.h.3.seg<br>
--sOutputMask=././test_out/t001-1/%s.d.3.seg<br>
--tInputMask=./test_out/t001-1/%s.gmms<br>

**MDecode**
--fInputDesc=sphinx,1:3:2:0:0:0,13,0:0:0:0<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--sInputMask=././test_out/t001-1/%s.i.seg<br>
--sOutputMask=././test_out/t001-1/t001-1.pms.seg<br>
--tInputMask=./models/sms.gmms<br>

**SFilter**
--fInputDesc=sphinx,1:3:2:0:0:0,13,0:0:0:0<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--sFilterMask=././test_out/t001-1/t001-1.pms.seg<br>
--sInputMask=././test_out/t001-1/%s.d.3.seg<br>
--sOutputMask=././test_out/t001-1/t001-1.flt.3.seg<br>

**MScore**
--fInputDesc=sphinx,1:3:2:0:0:0,13,1:1:0:0<br>
--fInputMask=././test_out/t001-1/%s.mfcc<br>
--sInputMask=././test_out/t001-1/t001-1.flt.3.seg<br>
--sOutputMask=././test_out/t001-1/t001-1.g.3.seg<br>
--tInputMask=./models/gender.gmms<br>

## LIUM Website Example
echo  initialize GMM
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MTrainInit   --help --nbComp=8 --kind=DIAG --fInputMask=$features --fInputDesc=$fDesc --sInputMask=./$datadir/%s.h.$h.seg --tOutputMask=./$datadir/%s.init.gmms $show

echo  EM computation
java -Xmx$mem -classpath "$LOCALCLASSPATH" fr.lium.spkDiarization.programs.MTrainEM   --help  --nbComp=8 --kind=DIAG --fInputMask=$features --fInputDesc=$fDesc --sInputMask=./$datadir/%s.h.$h.seg --tOutputMask=./$datadir/%s.gmms  --tInputMask=./$datadir/%s.init.gmms  $show
