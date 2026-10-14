def longest_increasing_streak(temperatures):
    max_len = 1
    current = 1

    for i in range(1, len(temperatures)):
        if temperatures[i] > temperatures[i-1]:
            current +=1
            max_len = max(max_len, current)
        else:
            current = 1
    return max_len