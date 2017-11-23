#!/usr/bin/env python
# F-Measure Computation
# Used to access the Accuracy of Diarization of Segmentation files

import sys

def takeThird(elem):
   if elem.split()[0] == ';;':
      return 0
   else:
      return int(elem.split()[2])

# Generate Array from list
def genArray(List):
   z = int(0)
   while z < len(List):
      line = List[z]
      while line[0:2] == ";;":
         List.pop(z)
         line = List[z]
      z += 1
         
   array = [[0 for x in range(3)] for y in range(len(List))]
   for x in range(0, len(List)):
      line = List[x]
      showName, channelNum, start, length, gender, band, env, spkLabel = line.split(' ')
      array[x] = [spkLabel, int(start), int(int(start) + int(length))]
   return array
   

B = int (sys.argv[3])

# Create Sorted Arrays
orgSeg = open(sys.argv[1], 'r')
orgList = orgSeg.read().splitlines()
orgList.sort(key=takeThird)
orgArray = genArray(orgList)

newSeg = open(sys.argv[2], 'r')
newList = newSeg.read().splitlines()
newList.sort(key=takeThird)
newArray = genArray(newList)

orgSeg.close()
newSeg.close()

orgStart = int(0)
orgEnd = int(0)
newStart = int(0)
newEnd = int(0)
orgSpkLabel = ""
newSpkLabel = ""
orgSpkLabel2 = ""
newSpkLabel2 = ""

orgNum1 = int(0)
newNum1 = int(0)
orgNum2 = int(0)
newNum2 = int(0)
chunkEnd = int(0)


TP = int(0) # True Positive
TN = int(0) # True Negative
FP = int(0) # False Positive
FN = int(0) # False Negative

while (len(orgArray) > orgNum1) or (len(newArray) > newNum1):
   # Check if in bounds
   if (orgEnd == chunkEnd):
      if int(orgArray[orgNum1][1]) > int(orgEnd):
         orgSpkLabel = "null"
         orgEnd = orgArray[orgNum1][1]
      else:
         orgSpkLabel = orgArray[orgNum1][0]
         orgStart = orgArray[orgNum1][1]
         orgEnd = orgArray[orgNum1][2]
         orgNum1 += 1
         
         
   if (newEnd == chunkEnd):
      if int(newArray[newNum1][1]) > int(newEnd):
         newSpkLabel = "null"
         newEnd = newArray[newNum1][1]
      else:
         newSpkLabel = newArray[newNum1][0]
         newStart = newArray[newNum1][1]
         newEnd = newArray[newNum1][2]
         newNum1 += 1

   #find minimum of end times
   chunkEnd = min(int(orgEnd), int(newEnd))
   chunkSize = (int(chunkEnd) - int(orgStart))
   orgStart = chunkEnd
   newStart = chunkEnd

   orgNum2 = int(0)
   newNum2 = int(0)
   orgStart2 = int(0)
   orgLength2 = int(-1)
   newStart2 = int(0)
   newLength2 = int(-1)

   orgEnd2 = int(0)
   newEnd2 = int(0)
   chunkEnd2 = int(0)
   while (len(orgArray) > orgNum2) or (len(newArray) > newNum2):
      # Set new start/end times
      if (orgEnd2 == chunkEnd2):
         if int(orgArray[orgNum2][1]) > int(orgEnd2):
            orgSpkLabel2 = "null"
            orgEnd2 = orgArray[orgNum2][1]
         else:
            orgSpkLabel2 = orgArray[orgNum2][0]
            orgStart2 = orgArray[orgNum2][1]
            orgEnd2 = orgArray[orgNum2][2]
            orgNum2 += 1
            
            
      if (newEnd2 == chunkEnd2):
         if int(newArray[newNum2][1]) > int(newEnd2):
            newSpkLabel2 = "null"
            newEnd2 = newArray[newNum2][1]
         else:
            newSpkLabel2 = newArray[newNum2][0]
            newStart2 = newArray[newNum2][1]
            newEnd2 = newArray[newNum2][2]
            newNum2 += 1

      #find minimum of end times
      chunkEnd2 = min(int(orgEnd2), int(newEnd2))

      # Award Points
      chunkSize2 = (int(chunkEnd2) - int(orgStart2))
      orgStart2 = chunkEnd2
      newStart2 = chunkEnd2
      if (orgSpkLabel == orgSpkLabel2):
         if (newSpkLabel == newSpkLabel2):
            TP += int(int(chunkSize) * int(chunkSize2))
         else:
            FN += int(int(chunkSize) * int(chunkSize2))
      else:
         if (newSpkLabel == newSpkLabel2):
            FP += int(int(chunkSize) * int(chunkSize2))
         else:
            TN += int(int(chunkSize) * int(chunkSize2))
   
print("True Positive:   " + str(TP) + "\n" +
      "False Positive:  " + str(FP) + "\n" + 
      "False Negative:  " + str(FN) + "\n" +
      "True Negative:   " + str(TN))

precRate = float(TP) / (TP + FP) # Precision Rate
recRate = float(TP) / (TP + FN) # Recall Rate
print("Precision Rate:  " + str(precRate) + "\n" +
      "Recall Rate:     " + str(recRate))
      
F = float ((B**2 + 1) * precRate * recRate / (B**2 * precRate + recRate))
print("F-Measure:       " + str(F))
