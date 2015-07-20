# telegram-server

## pre-requisites

* MacPorts
	Run `00-macports.sh` to install for Yosemite

* VirtualBox and Vagrant
	Run `vboxVagrant.sh` to install for OSX

## running
Get VM up:
```
vagrant up
```

In terminal window 1:
```
vagrant ssh
cd ~/telegram-server; node index.js
```

In terminal window 2:
```
vagrant ssh
cd ~/telegram-client; ember server
```

Your web client should be then available at http://localhost:4200