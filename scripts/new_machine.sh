#!/bin/bash

# Name arguments
MACHINE_NAME_ARG=$1

# AWS config directory
AWS_CONFIG_FILE=~/.aws/credentials

# Grab AWS credentials for the 0xproject profile
function getPersonalCredentials {
    grep -A 2 "\[personal\]" $AWS_CONFIG_FILE
}
AWS_ACCESS_KEY_ID=$(getPersonalCredentials | grep "aws_access_key_id" | cut -d'=' -f2 | sed 's/[^0-9A-Z]*//g')
AWS_SECRECT_ACCESS_KEY=$(getPersonalCredentials | grep "aws_secret_access_key" | cut -d'=' -f2 | sed 's/[^0-9A-Za-z/+=]*//g')

# Use docker-machine to create a new instance provisioned for docker with neptune secruity group settings
docker-machine create \
--driver amazonec2 \
--amazonec2-vpc-id vpc-71ed110b \
--amazonec2-access-key $AWS_ACCESS_KEY_ID \
--amazonec2-secret-key $AWS_SECRECT_ACCESS_KEY \
--amazonec2-instance-type t2.micro \
$MACHINE_NAME_ARG