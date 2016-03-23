#!/bin/bash
funWithReturn(){
	echo "The function is to get the sum of two numbers"
	echo -n "Input first number"
	read aNum
	echo -n "Input second number"
	read bNum
	echo "the result is "
	return $(($aNum+$bNum))

}
funWithReturn
ret=$?
echo "sum is $ret"