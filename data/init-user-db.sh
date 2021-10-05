#!/bin/bash
set -e

PGPASSWORD="$POSTGRES_PASSWORD"
BACKUPFILE=/docker-entrypoint-initdb.d/db.backup

if test -f "$BACKUPFILE"; then
    pg_restore --verbose --no-acl --no-owner -d postgres $BACKUPFILE
fi
