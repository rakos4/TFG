FROM tomcat:8.5-jre8-temurin-focal
RUN apt-get update && apt-get install -y ssh systemctl net-tools iputils-ping
CMD ["/bin/bash"]
