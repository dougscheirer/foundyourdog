#!/bin/bash
CURL=$(which curl)
if [ "$CURL" == "" ]; then
	apt-get update && apt-get install -y wget curl git tig
fi

# grab java 8
JAVA=$(which java)
if [ "$JAVA" == '' ] || [[ $($JAVA -version | grep -q -F '1.8') -eq 1 ]]; then
	downloadlink=http://download.oracle.com/otn-pub/java/jdk/8u11-b12/jdk-8u11-linux-x64.tar.gz
	filename=jdk-8u11-linux-x64.tar.gz
	wget -q --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" -O /tmp/$filename $downloadlink
	mkdir -p /opt/java-oracle && tar -zxf /tmp/$filename -C /opt/java-oracle/
else
	echo "Java 1.8 already installed"
fi

if [[ ! $(grep -q -F 'jdk1.8.0_11' /home/vagrant/.bashrc) ]]; then
	echo "PATH=/opt/java-oracle/jdk1.8.0_11/bin:\$PATH" >> /home/vagrant/.bashrc
fi

JAVA_HOME=/opt/java-oracle/jdk1.8.0_11
update-alternatives --install /usr/bin/java java $JAVA_HOME/bin/java 20000 && update-alternatives --install /usr/bin/javac javac $JAVA_HOME/bin/javac 20000

# grab maven
if [ ! -e /opt/maven ]; then 
	wget -q -O /tmp/maven.tar.gz http://www.webhostingjams.com/mirror/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
	mkdir -p /opt/maven && tar -zxf /tmp/maven.tar.gz -C /tmp
	APACHEDIR=$(find /tmp -name apache-maven*)
	mv $APACHEDIR/* /opt/maven/
else
	echo "Maven already installed"
fi

if [[ ! $(grep -q -F 'maven' /home/vagrant/.bashrc) ]]; then
	echo "PATH=/opt/maven/bin:\$PATH" >> /home/vagrant/.bashrc
fi

# grab npm
NODE_VER=4

NPM=$(which npm)
if [ "$NPM" == "" ]; then
	curl -sL https://deb.nodesource.com/setup_$NODE_VER.x | sudo -E bash -
	apt-get install -y nodejs
else
	echo "npm already installed"
fi

# increase the user watches, webpack is greedy
echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

# install what's missing

# build the base JS file
# npm run build

# run this for continuous build 
# npm start

# TODO: docker install, grab and run postgres DB on localhost:5432
# also for some reason loading it into eclipse on my Mac made the vbox build issues go away,
# so probably figure that out