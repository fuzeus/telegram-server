#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )";

ps -ef|grep VBox|grep -v grep|awk '{print $2}'|xargs -I {} sudo kill -9 {}

# install latest virtualbox
vboxLatest=$(curl -s http://download.virtualbox.org/virtualbox/LATEST.TXT)
wget http://download.virtualbox.org/virtualbox/$vboxLatest/VBoxGuestAdditions_$vboxLatest.iso \
     -O ~/Downloads/VBoxGuestAdditions_$vboxLatest.iso

curl -s http://download.virtualbox.org/virtualbox/$vboxLatest/|grep dmg \
     |perl -lpe 's/(.*)(href=")(VirtualBox-'$vboxLatest'-\d+-OSX.dmg)(".*)/$3/g' \
     | xargs -I {} wget http://download.virtualbox.org/virtualbox/$vboxLatest/{} -O ~/Downloads/vbox.dmg
hdiutil attach ~/Downloads/vbox.dmg
sudo installer -pkg /Volumes/VirtualBox/VirtualBox.pkg -target /
hdiutil detach /Volumes/VirtualBox/

# install latest vagrant
curl -s https://www.vagrantup.com/downloads.html|grep dmg \
     |perl -lpe 's/(.*)(href=")(.*.dmg)(.*)/$3/g'| xargs -I {} wget {} -O ~/Downloads/vagrant.dmg
hdiutil attach ~/Downloads/vagrant.dmg
sudo installer -pkg /Volumes/Vagrant/Vagrant.pkg -target /
hdiutil detach /Volumes/Vagrant/
