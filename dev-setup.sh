#!/bin/bash

# grab java 8
downloadlink=http://download.oracle.com/otn-pub/java/jdk/8u11-b12/jdk-8u11-linux-x64.tar.gz
filename=jdk-8u11-linux-x64.tar.gz
wget --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" -O /tmp/$filename $downloadlink
mkdir /opt/java-oracle && tar -zxf /tmp/$filename -C /opt/java-oracle/
PATH=/opt/java-oracle/jdk1.8.0_11/bin:$PATH
JAVA_HOME=/opt/java-oracle/jdk1.8.0_11
update-alternatives --install /usr/bin/java java $JAVA_HOME/bin/java 20000 && update-alternatives --install /usr/bin/javac javac $JAVA_HOME/bin/javac 20000

# grab maven
wget -O /tmp/maven.tar.gz http://www.webhostingjams.com/mirror/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
mkdir /opt/maven && tar -zxf /tmp/maven.tar.gz -C /tmp
APACHEDIR=$(find /tmp -name apache-maven*)
mv $APACHEDIR/* /opt/maven/
PATH=/opt/maven/bin:$PATH

# grab npm
NODE_VER=4

curl -sL https://deb.nodesource.com/setup_$NODE_VER.x | sudo -E bash -
apt-get install -y nodejs

# install what's missing
npm install
# build the base JS file
npm run build
# run this for continuous build 
# npm start
