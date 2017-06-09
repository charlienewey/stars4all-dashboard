import pandas as pd

# Import functions for calculating metrics
import contribution
import engagement

class Dataset(object):
    def __init__(path, index="task_run__finish_time"):
        self.df = pd.read_csv(path).set_index(index)


    # use df.agg([appeal, contribution, effort, engagement]) to get dataframe

    def get_metrics(frequency="month"):
        # Set parameters for time grouping
        if frequency == "year":
            time_group = "AS"
        elif frequency == "month":
            time_group = "MS"
        elif frequency == "week":
            time_group = "W-MON":
        elif frequency == "day":
            time_group = "D"

        # Store metrics here
        metrics = {
            "years": [],
            "appeal": [],
            "contribution": [],
            "effort": [],
            "engagement": []
        }

        # Group data periodically using TimeGrouper and offset aliases:
        # http://pandas.pydata.org/pandas-docs/stable/timeseries.html#offset-aliases
        project_start_date = df.sort_index().index[0]
        periods = df.groupby(by=pd.TimeGrouper(time_group, closed="left"))

        # Return new DataFrame with columns
        pipeline = {
            "ProjectAppeal": lambda x: project_appeal(x, project_start_date),
            "PublicContribution": lambda x: public_contribution(x, project_start_date),
            "SustainedEngagement": lambda x: sustained_engagement(x, project_start_date),
            "DistributionOfEffort": distribution_of_effort
        ]

        metrics = periods.agg(pipeline)

    """
        # Go through each year's data
        user_field = "task_run__user_id"
        time_field = "task_run__created"
        start_date = df.sort_index().index[0]
        for timestamp in sorted(periods.groups.keys()):
            year = timestamp.year
            period = df[df.index.year == year]

            # Calculate classifications per user
            cpu = period.groupby(by=[user_field])[user_field].count()

            # Project's active time
            delta = period.sort_index().index[-1] - start_date
            active_weeks = delta.days / 7.0

            # Number of users
            num_users = period.groupby(user_field).count().shape[0]

            # Median classifications per user
            median_cpv = cpu.median()

            # Median volunteer active period
            fst = pd.to_datetime(df.groupby(by=[user_field]).first()[time_field])
            fst = fst.reset_index().set_index(user_field)

            lst = pd.to_datetime(period.groupby(by=[user_field]).last()[time_field])
            lst = lst.reset_index().set_index(user_field)

            fst_lst = lst.join(fst, how="left", rsuffix="_fst")

            delta = fst_lst[time_field] - fst_lst[time_field + "_fst"]
            median_vap = delta.median(axis=0).total_seconds() / 604800.0

            # Calculate metrics
            metrics["timestamp"].append(str(timestamp))
            metrics["appeal"].append(project_appeal(num_users, active_weeks))
            metrics["contribution"].append(public_contribution(median_cpv, active_weeks))
            metrics["effort"].append(distribution_of_effort(cpu))
            metrics["engagement"].append(sustained_engagement(median_vap, active_weeks))

        return metrics
    """
