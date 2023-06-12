#!/bin/bash

# Change to your project directory
cd /path/to/your/project

# Get the list of uncommitted files
files=$(git status --porcelain | awk '{print $2}')

# Loop through each uncommitted file
for file in $files; do
  # Check if the file is not a directory
  if [[ -f $file ]]; then
    # Commit the file with an extension commit
    git add "$file"
    git commit -m "$(basename $file) commit"
  fi
done

# Push the changes to the remote repository
git push origin master
