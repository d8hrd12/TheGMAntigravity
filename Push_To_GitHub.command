#!/bin/bash
echo "---------------------------------------------------"
echo "        BASKETBALL MANAGER - GITHUB UPLOADER       "
echo "---------------------------------------------------"
echo ""
echo "Reseting git remote to ensure correctness..."
cd "$(dirname "$0")"
git remote remove origin
git remote add origin https://github.com/d8hrd12/TheGMAntigravity.git

echo ""
echo "Pushing to GitHub..."
echo "NOTE: If asked for username/password, please enter them."
echo "      (Password will be invisible when you type it)"
echo ""

git push -u origin main

echo ""
echo "---------------------------------------------------"
echo "DONE! If you see 'Branch setup to track', it worked."
echo "You can close this window now."
echo "---------------------------------------------------"
read -n 1 -s
