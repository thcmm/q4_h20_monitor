#!/usr/bin/env bash

dropdb probe_data_dev
dropdb probe_data_test
createdb probe_data_dev
createdb probe_data_test

