#!/bin/bash
# This script is used to redeploy the application
# It will stop the application, pull the latest code from the repository, and start the application again

pm2 stop $PK_NAME
pm2 delete $PK_NAME
cd ~/ecomshop
git pull
npm run build
pm2 start npm --name $PK_NAME -- start
