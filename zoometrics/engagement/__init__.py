import datetime

def _active_weeks(last, first):
    delta = last - first
    weeks = delta.days / 7.0

    if weeks == 0:
        return 1
    return weeks

def project_appeal(series, project_start_date):
    # Number of users
    num_users = series.groupby(series).count().shape[0]

    # Project's active time
    last = series.sort_index().index[-1]
    active_weeks = _active_weeks(last, project_start_date)

    return num_users / (active_weeks ** 2)

def public_contribution(series, project_start_date):
    # Calculate classifications per user
    median_cpu = series.groupby(series).count().median()

    # Project's active time
    last = series.sort_index().index[-1]
    active_weeks = _active_weeks(last, project_start_date)

    return median_cpu / (active_weeks ** 2)

def sustained_engagement(series, fst, project_start_date,
                         time_field="task_run__finish_time",
                         user_field="task_run__user_id"):

    # Put DataFrames together
    first = fst.reset_index()
    period = series.reset_index()

    # Calculate most recent contributions this year for each user
    last = period.groupby(period.columns[-1]).last().reset_index()
    first_last = first.merge(last, left_on=user_field, right_on=last.columns[0], how="right")

    # Calculate median user active period (in weeks)
    user_weeks = first_last["index"] - first_last[time_field]
    median_uap = (user_weeks / datetime.timedelta(days=7)).median()

    # Project's active time
    last = series.index[-1]
    active_weeks = _active_weeks(last, project_start_date)

    return median_uap / (active_weeks ** 2)
