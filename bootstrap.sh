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

# optional if you want to run the latest and greatest packages
# runTimedCommand 'sudo apt-get update -y'
# runTimedCommand 'sudo apt-get upgrade -y'
# runTimedCommand 'sudo apt-get dist-upgrade -y'

runTimedCommand 'sudo apt-get install nginx nodejs npm mongodb -y'
runTimedCommand 'sudo npm install -g ember-cli'
runTimedCommand 'sudo ln -s /usr/bin/nodejs /usr/bin/node' 
runTimedCommand 'cd /home/vagrant/telegram-server; sudo -u vagrant npm install' 