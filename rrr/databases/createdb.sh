#!/bin/bash

# DATABASE
USERNAME="root"
PASSWORD=""
HOSTNAME=""

FN=${BASH_SOURCE%/*}/createdb.sql

read -p "All db data will be lost. Are you sure you want to do this? [yes/no]" yn
case $yn in
    [Yy]* )

        DBUSER=""
        if [ "$USERNAME" ]; then
            DBUSER="-u $USERNAME"
        fi

        DBPASS=""
        if [ "$PASSWORD" ]; then
            DBPASS="-p$PASSWORD"
        fi

        DBHOST=""
        if [ "$HOSTNAME" ]; then
            DBPASS="-h $HOSTNAME"
        fi

        if [ ! -z `ls $FN` ]; then
            mysql $DBUSER $DBPASS -f < $FN
        fi
    ;;

    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
esac

exit
