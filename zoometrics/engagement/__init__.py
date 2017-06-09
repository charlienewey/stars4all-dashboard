def _active_weeks(last, first):
    delta = last - first
    return delta.days / 7.0

def project_appeal(dataframe, start_date,
        user_field="task_run__user_id"):
    # Number of users
    num_users = dataframe.groupby(user_field).count().shape[0]

    # Project's active time
    last = dataframe.sort_index().index[-1]
    active_weeks = _active_weeks(last, start_date)

    return num_users / (active_weeks ** 2)

def public_contribution(dataframe, start_date,
        user_field="task_run__user_id"):
    # Calculate classifications per user
    median_cpu = period.groupby(by=[user_field])[user_field].count().median()

    # Project's active time
    last = dataframe.sort_index().index[-1]
    active_weeks = _active_weeks(last, start_date)

    return median_cpu / (active_period ** 2)

def sustained_engagement(dataframe, start_date,
        user_field="task_run__user_id",
        time_field="task_run__created"):
    # First contribution for each user
    fst = pd.to_datetime(df.groupby(by=[user_field]).first()[time_field])
    fst = fst.reset_index().set_index(user_field)

    # Most recent contribution for each user
    lst = pd.to_datetime(dataframe.groupby(by=[user_field]).last()[time_field])
    lst = lst.reset_index().set_index(user_field)

    fst_lst = lst.join(fst, how="left", rsuffix="_fst")

    delta = fst_lst[time_field] - fst_lst[time_field + "_fst"]

    # Median user active period
    median_uap = delta.median(axis=0).total_seconds() / 604800.0

    # Project's active time
    last = dataframe.sort_index().index[-1]
    active_weeks = _active_weeks(last, start_date)

    return median_uap / (active_period ** 2)
