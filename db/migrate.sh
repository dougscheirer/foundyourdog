#!/bin/bash
# migrate -p PASSWORD [-e ENV (default is dev)] [-d (drop the DB first)]

function die
{
	echo "$1" && exit 1
}

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

if [ "$DROP" == "drop" ]; then
	psql -U postgres -h localhost -c "DROP DATABASE foundyourdog_$ENV"
fi

# init is the only thing ATM
sed -e 's/\$PASSWD\$/'$PASSWORD'/g' -e 's/\$ENV\$/'$ENV'/g' ./init.db | psql -U postgres -h localhost