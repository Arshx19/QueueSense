import pandas as pd
import random

data = []


for _ in range(500):
    length = random.randint(1, 100)         
    service_rate = random.randint(1, 10) 

    
    base_wait = length / service_rate
    noise = random.uniform(-2, 2)           
    wait_time = max(0, base_wait + noise)   

    data.append({
        "length": length,
        "serviceRate": service_rate,
        "waitTime": round(wait_time, 2)
    })

# create dataframe
df = pd.DataFrame(data)

# save file
df.to_csv("dataset.csv", index=False)

print("✅ Dataset generated: dataset.csv")