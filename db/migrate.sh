#!/bin/bash
# migrate PASSWORD ENV (default is dev)

function die
{
	echo "$1" && exit 1
}

PASSWORD="$1"
ENV="$2"

if [ "$ENV" == "" ]; then
	ENV="dev"
fi

if [ "$PASSWORD" == "" ]; then
	if [ "$ENV" != dev ]; then
		die "password required in non-development environments ($ENV)"
	fi
	PASSWORD="password"
fi

# init is the only thing ATM
sed -e 's/\$PASSWD\$/'$PASSWORD'/g' -e 's/\$ENV\$/'$ENV'/g' ./init.db | psql -U postgres -h localhost