#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )";

# NINJA: continue to prompt until command line tools install has completed
while [ $(xcode-select -p 2>&1|grep error|wc -l) -gt 0 ]; do
	xcode-select --install
	echo
	read -n1 -r -p "After the install is done, press any key to try again..."
	echo
done

# NINJA: automatically accept xcode license
/usr/bin/expect<<EOF
spawn sudo xcodebuild -license              
expect {
     "*Press 'space' for more, or 'q' to quit*" {
         send "q";
     }
     timeout {
         send_error "\nExpect failed first expect\n";
         exit 1;
     }
}
expect {
    "*By typing 'agree' you are agreeing" {
        send "agree\r"; 
        send_error "\nUser agreed to EULA\n";
     }
     timeout {
         send_error "\nExpect failed second expect\n";
         exit 1;
     }
}
EOF

latest=$(curl -sL http://www.macports.org|grep Latest|perl -p -e 's/(.*: )(.*)(<\/b>.*)/$2/g')

curl -sL https://distfiles.macports.org/MacPorts/MacPorts-$latest-10.10-Yosemite.pkg > ~/Downloads/macports.pkg
sudo installer -pkg ~/Downloads/macports.pkg -target /

# NINJA: export path immediately so things are usable
export PATH=$PATH:/opt/local/bin
sudo port selfupdate
sudo port install ncftp fswatch subversion +tools maven2 wireshark +libgcrypt git +svn +doc +bash_completion wget unrar subversion-javahlbindings xmlstarlet ntfs-3g py-pip getopt
sudo port select --set python python27
sudo port select --set maven maven2
sudo port select --set pip pip27

# NINJA: check if update was already made to ~/.bash_profile
if [ ! -f ~/.bash_profile ] || [ $(cat ~/.bash_profile|grep /opt/local/bin|wc -l) -lt 1 ]; then
	echo -e '\nexport PATH=/opt/local/bin:$PATH' >> ~/.bash_profile
fi

# TODO: fix wireshark (https://trac.macports.org/ticket/46850)
	# Start X11
	# export DISPLAY=:0; wireshark
# TODO: add and configure mysql
# TODO: add and configure tomcat
# TODO: add and configure nginx
# TODO: add and configure apache2