#!/bin/bash

sudo su

# Site config
cp /var/www/vagrant-resources/xdebug.ini /etc/php5/mods-available/xdebug.ini
cp /var/www/vagrant-resources/php.ini /etc/php5/apache2/php.ini
cp /var/www/vagrant-resources/my.cnf /etc/mysql/my.cnf
cp /var/www/vagrant-resources/apache/default /etc/apache2/sites-available/default
cp /var/www/vagrant-resources/apache/default-ssl /etc/apache2/sites-available/default-ssl
cp /var/www/vagrant-resources/site-files/gulpfile.js /var/www/gulpfile.js
rm -f /var/www/index.html

chmod -R 775 /var/www/*

service mysql restart
service apache2 restart

cd /var/www/recibes

