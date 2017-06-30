#! /usr/bin/env python3

import argparse
import sys

import zoometrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process some citizen science project metrics.")
    parser.add_argument(dest="path", type=str, help="path to a CSV file with Zooniverse metrics")
    parser.add_argument(dest="frequency", default="month", type=str,
                        help="a frequency to group by. one of: year, month, week, day")
    parser.add_argument(dest="dest", type=str, help="destination CSV file containing metrics")
    args = parser.parse_args()

    dataset = zoometrics.Dataset(path=args.path)
    metrics = dataset.get_metrics(frequency=args.frequency)

    metrics.dropna(how="any").to_csv(args.dest)
