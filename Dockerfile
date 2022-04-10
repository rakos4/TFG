FROM tomcat:8.5-jre8-temurin-focal
RUN apt-get update && apt-get install -y net-tools iputils-ping zabbix-agent
CMD ["/usr/local/tomcat/bin/catalina.sh","run"]
