#!/bin/bash
#

#!/usr/bin/env awk

sed -En 's/^([^,]+),([^,]+),([^,]+$)/("\1","\2",FALSE),/p' user.csv >> test.sql
