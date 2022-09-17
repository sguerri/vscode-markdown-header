#!/bin/bash

function getVersion()
{
    file="./package.json"
    local line=$(grep "version" $file)
    version=$(echo $line | cut -d':' -f 2)
    version=$(echo $version | cut -d',' -f 1)
    version=$(echo $version | cut -d'"' -f 2)
    local line=$(grep "name = " $file)
    name=$(echo $line | cut -d'=' -f 2)
    name=$(echo $name | cut -d'"' -f 2)
    local line=$(grep "authors = " $file)
    author=$(echo $line | cut -d'=' -f 2)
    author=$(echo $author | cut -d'"' -f 2)
}

function getVersionParts()
{
    major=$(echo $version | cut -d'.' -f 1)
    minor=$(echo $version | cut -d'.' -f 2)
    patch=$(echo $version | cut -d'.' -f 3)
}

function updateVersion()
{
    local action="$1"
    if [[ $action == major ]]
    then
        major=$(echo $major + 1 | bc)
        minor=0
        patch=0
    elif [[ $action == minor ]]
    then
        minor=$(echo $minor + 1 | bc)
        patch=0
    elif [[ $action == patch ]]
    then
        patch=$(echo $patch + 1 | bc)
    fi
    new_version="$major.$minor.$patch"
}

if [[ $1 == major ]] || [[ $1 == minor ]] || [[ $1 == patch ]]
then
    getVersion
    getVersionParts
    updateVersion $1
    sed -i "s/\"version\" : \"$version/\"version\" : \"$new_version/" $file
    sed -i "s/APP_VERSION: \"$version/APP_VERSION: \"$new_version/" "./.github/workflows/build.yml"
    #sed -i "s/$name_$version/$name_$new_version/" "./README.md"
    #sed -i "s/Build\/v$version/Build\/v$new_version/" "./README.md"
    echo $new_version
elif [[ $1 == get ]]
then
    getVersion
    echo $version
else
    echo "Usage: bump-version.sh major|minor|patch|get"
fi



