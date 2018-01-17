INSTALL VAGRANT
==================

First install VirtualBox:
https://www.virtualbox.org/wiki/Downloads

Then after installation install the Extension Pack you can find
on the same page.

After installing the extensions then you need to install Vagrant:
https://www.vagrantup.com/downloads.html

Then you need to install a Vagrant plugin by running the following command:

vagrant plugin install vagrant-hostmanager


RUN VAGRANT
===============

vagrant up   - starts vagrant box (first time will take a while)

vagrant reload  - reinitialize the box

vagrant destroy  - destroys the box

vagrant halt - shutdown the box

vagrant ssh - ssh to the box

SET UP VAGRANT BOX
======================

* vagrant up
* vagrant ssh
* sudo vi /etc/mysql/my.cnf  <-- set bind 0.0.0.0
* sudo vi /etc/redis/redis.conf <-- set bind 0.0.0.0
* need to edit nginx conf to point to node webserver
* exit
