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

runTimedCommand 'apt-get install nginx nodejs npm mongodb git -y'
runTimedCommand 'ln -s /usr/bin/nodejs /usr/bin/node' 
runTimedCommand 'npm install -g ember-cli bower'
runTimedCommand 'ember update'

rm -Rf /home/vagrant/telegram-server/node_modules
rm -Rf /home/vagrant/telegram-client/node_modules
rm -Rf /home/vagrant/telegram-client/bower_components
rm -Rf /home/vagrant/telegram-client/dist
rm -Rf /home/vagrant/telegram-client/tmp

sudo -u vagrant bash -c "cd /home/vagrant/telegram-server; export HOME=/home/vagrant; set; npm install"
sudo -u vagrant bash -c "cd /home/vagrant/telegram-client; export HOME=/home/vagrant; set; npm install"
sudo -u vagrant bash -c "cd /home/vagrant/telegram-client; export HOME=/home/vagrant; set; bower install"
sudo -u vagrant bash -c "cd /home/vagrant/telegram-client; export HOME=/home/vagrant; set; ember build"