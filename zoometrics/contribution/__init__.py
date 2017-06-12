import numpy as np

def distribution_of_effort(series):
    # Calculate classifications per user
    cpu = series.groupby(by=series).count()
    return 1 - gini(cpu)


def gini(arr):
    """
    Return Gini coefficient) of array.

    https://en.wikipedia.org/wiki/Gini_coefficient
    http://neuroplausible.com/gini

    Args:
        arr (np.array): An array containing "income" data.
    Returns:
        float: The Gini coefficient (inequality measure).
    """
    arr = np.sort(np.ravel(arr))
    ind = np.arange(1, len(arr) + 1)
    return np.sum((((2 * ind) - len(arr) - 1) * arr)) / float(len(arr) * np.sum(arr))
