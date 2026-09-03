#!/bin/bash
/usr/bin/clash-verge-service-uninstall

. /etc/os-release

if [ "$ID" = "deepin" ] && [ -f "/usr/share/applications/meeting.desktop" ]; then
    rm -vf "/usr/share/applications/meeting.desktop"
fi
