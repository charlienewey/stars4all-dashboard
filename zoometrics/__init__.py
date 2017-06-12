import pandas as pd

# Import functions for calculating metrics
from zoometrics.contribution import *
from zoometrics.engagement import *

class Dataset(object):
    def __init__(self, path, index="task_run__finish_time"):
        self.df = pd.read_csv(path)
        self.df[index] = pd.to_datetime(self.df[index])
        self.df = self.df.set_index(index)
        self.index = index

    def get_metrics(self, frequency="month"):
        # Set parameters for time grouping
        if frequency == "year":
            time_group = "AS"
        elif frequency == "month":
            time_group = "MS"
        elif frequency == "week":
            time_group = "W-MON"
        elif frequency == "day":
            time_group = "D"
        else:
            raise ValueError("Frequency must be one of: year, month, week, day")

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
        project_start_date = self.df.sort_index().index[0]
        periods = self.df.groupby(by=pd.TimeGrouper(time_group, closed="left"))

        # Calculate first contribution for each user
        user_field = "task_run__user_id"
        fst = self.df.reset_index().groupby(user_field).first()[self.index]

        # Return new DataFrame with columns
        pipeline = {
            "task_run__user_id": {
                "ProjectAppeal": lambda x: project_appeal(x, project_start_date),
                "PublicContribution": lambda x: public_contribution(x, project_start_date),
                "DistributionOfEffort": distribution_of_effort,
                "SustainedEngagement": lambda x: sustained_engagement(x, fst, project_start_date)
            }
        }

        #return periods.apply([lambda x: project_appeal(x, project_start_date))

        result = periods.agg(pipeline)
        result.columns = result.columns.droplevel(0)

        return result
