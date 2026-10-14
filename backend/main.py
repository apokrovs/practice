def latest_temperature(readings):
    latest_temp = {}
    recent_time = {}

    for r in readings:
        if r[0] in recent_time:
            if recent_time[r[0]] < r[1]:
                recent_time[r[0]] = r[1]
                latest_temp[r[0]] = r[2]
        else:
            recent_time[r[0]] = r[1]
            latest_temp[r[0]] = r[2]
    return latest_temp

def average_temperatures(readings):
    averages = {}

    for r in readings:
        if r[1] < 15:
            continue
        if r[0] in averages:
            sum,count = averages[r[0]][0], averages[r[0]][1]
            sum += r[2]
            count +=1
            averages[r[0]] = (sum, count)

        else:
            averages[r[0]] = (r[2], 1)
        result = {}

    for a in averages:
        result[a] = averages[a][0] / averages[a][1]
    return result
    