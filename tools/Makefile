shell = bash

originalseg = ./Assets/Testing/original.seg
newseg = ./Assets/Testing/new.seg
B = 1

version = 0
jar = ./LIUM_SpkDiarization.jar
d = something

comparetest: compare_seg.py
	python compare_seg.py $(originalseg) $(newseg) $(B)

trainthresholds: train_thresholds.sh
	$(shell) ./train_thresholds.sh

trainubm: make_ubm.sh
	$(shell) ./make_ubm.sh $version $jar $d

traingender: make_gender.sh
	$(shell) ./make_gender.sh $version $jar $d

trainspeaker: make_speakers.sh
	$(shell) ./make_speakers.sh $version $jar $d

diarization: diarization.sh
	$(shell) ./diarization.sh $input $output

