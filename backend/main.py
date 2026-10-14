def max_average(temperatues, k):
    current_sum = 0

    for i in range(k):
        current_sum += temperatues[i]

    max_average = current_sum / k

    for i in range(k, len(temperatues)):
        current_sum -= temperatues[i-k] 
        current_sum += temperatues[i]
        max_average = max(max_average, current_sum/k)
    return max_average
