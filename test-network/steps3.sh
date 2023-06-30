#!/bin/bash

chmod +x steps3.sh

sudo apt update
sudo apt install nodejs npm
export PATH="$PATH:/usr/local/bin"


export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
npm install
