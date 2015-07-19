#!/bin/bash
function runTimedCommand
{
    echo "Running command: $@"
    start=$(date +"%s")
    sudo bash -c "$@"
    echo "...command complete."
    end=$(date +"%s")
    diff=$(($end-$start))
    echo "$(($diff / 60)) minutes and $(($diff % 60)) seconds elapsed"
}

runTimedCommand 'sudo apt-get update -y'
runTimedCommand 'sudo apt-get upgrade -y'
runTimedCommand 'sudo apt-get dist-upgrade -y'

