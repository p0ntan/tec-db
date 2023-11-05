#!/usr/bin/env bash
#
# Bash script for working with routes on server
#
# Exit values:
#  0 on success
#  1 on failure
#

# Name of the script
SCRIPT=$( basename "$0" )

# Current version
VERSION="1.0.0"

# Port
PORT="1337"

# Server, default is localhost
if [ -f "server.txt" ]; then
    SERVER="$( cat server.txt )"
else
    SERVER="express-server"
fi

# Domain
DOMAIN="http://$SERVER"

#
# Message to display for usage and help.
#
function usage
{
    local txt=(
""
"Script $SCRIPT is used to work with log-data."
"Usage: $SCRIPT [options] <command> [arguments]"
""
"Commands:"
""
"   url                    Get url to view the server in browser."
"   server                 See current server"
"   use <server>           Set the servername (bthloggen-server or other service name)."
"   read                   Test read data through api, default is MariaDB."
"      --mongo             Uses MongoDB"
"   rupdate                Test update data through api, default is MariaDB."
"      --mongo             Uses MongoDB"
""
""
"Options:"
""
"   -h, --help      Display the menu"
"   -v, --version   Display the current version"
"   -c, --count     Display the number of rows returned using view command"
""
    )

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display when bad usage.
#
function badUsage
{
    local message="$1"
    local txt=(
"For an overview of the command, execute:"
"$SCRIPT -h, --help"
    )

    [[ -n $message ]] && printf "%s\\n" "$message"

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display for version.
#
function version
{
    local txt=(
"$SCRIPT version $VERSION"
    )

    printf "%s\\n" "${txt[@]}"
}

#
# Function to see current server
#
function app-server
{
    echo "Server is now: $SERVER"
}

#
# Function to set the server to use
#
function app-use
{
    echo "$1" > "server.txt"
    SERVER="$1"
    echo "Server is now: $SERVER"
}

#
# Function to get the url to use in a browser
#
function app-url
{
    echo "http://localhost:1337"
}

#
# Function to test read
#
function app-read
{
    local flag
    local url
    local dbname

    flag="$*"
    dbname="mariadb"

    if [ "$flag" == "--mongo" ]; then
        dbname="mongodb"
    fi

    oha -c 10000 "$DOMAIN:$PORT/$dbname/usersview"
}

#
# Function to test update
#
function app-update
{
    local flag
    local url
    local dbname

    flag="$*"
    dbname="mariadb"

    if [ "$flag" == "--mongo" ]; then
        dbname="mongodb"
    fi

    oha -c 10000 "$DOMAIN:$PORT/$dbname/update/users"
}

#
# Process options
#
function main
{
    while (( $# ))
    do
        case "$1" in

            --help | -h)
                usage
                exit 0
            ;;

            --version | -v)
                version
                exit 0
            ;;

            url            \
            | server       \
            | read         \
            | update)
                command="$1"
                shift
                app-"$command" "$@"
                exit 0
            ;;

            *)
                badUsage "Option/command not recognized."
                exit 1
            ;;

        esac
    done

    badUsage
    exit 1
}

main "$@"
