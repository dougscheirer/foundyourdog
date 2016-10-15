#!/bin/bash
# migrate -p PASSWORD [-i (init)] [-s (seed)] [-d (drop the DB first)] [-e ENV (default is dev)] 

function die
{
	echo "$1" && exit 1
}

if [ "$1" == "" ]; then
	die "migrate.sh [-p password] [-e environment] [-d (drop)] [-i (init)] [-s (seed)]"
fi

while [[ $# -gt 0 ]]; do
	key="$1"
	echo "key is $key"
	case $key in
    	-p)
		    PASSWORD="$2"
		    shift # past argument
		    ;;
	    -e)
		    ENV="$2"
		    shift # past argument
		    ;;
	    -d)
		    DROP="drop"
		    ;;
		-i)
			INIT="init"
			;;
		-s)
			SEED="seed"
			;;
    	*)
            die "unknown option $key"
    ;;
	esac
	shift # past argument or value
done

if [ "$ENV" == "" ]; then
	ENV="dev"
fi

if [ "$PASSWORD" == "" ]; then
	if [ "$ENV" != dev ]; then
		die "password required in non-development environments ($ENV)"
	fi
	PASSWORD="password"
fi

if [ "$DROP" != "" ]; then
	psql -U postgres -h localhost -c "DROP DATABASE foundyourdog_$ENV"
fi

# init is the only thing ATM
if [ "$INIT" != "" ]; then
	sed -e 's/\$PASSWD\$/'$PASSWORD'/g' -e 's/\$ENV\$/'$ENV'/g' ./init.sql | psql -U postgres -h localhost
fi

if [ "$SEED" != "" ]; then
	sed -e 's/\$PASSWD\$/'$PASSWORD'/g' -e 's/\$ENV\$/'$ENV'/g' ./seed.sql | psql -U postgres -h localhost
fi
