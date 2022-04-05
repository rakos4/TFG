#!/bin/bash

apt-get update -y
apt-get install net-tools -y
apt-get install iputils-ping -y
apt-get install ssh -y
apt-get install zabbix-agent -y

cp /usr/share/scripts/zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf

service zabbix-agent restart
