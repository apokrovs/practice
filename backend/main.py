def longest_subarray_k_distinct(temperatures, k):
    freqs = {}

    left = 0
    max_length = 0

    for right, t in enumerate(temperatures):
        if t in freqs:
           freqs[t]+=1
        else:
            freqs[t] = 1

        while len(freqs) > k:
            freqs[temperatures[left]] -= 1
        
            if freqs[temperatures[left]] == 0:
                freqs.pop(temperatures[left])

            left+=1
        max_length = max(max_length, right-left+1)
            
           
    return max_length
                
