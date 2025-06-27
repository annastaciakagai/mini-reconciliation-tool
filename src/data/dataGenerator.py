import pandas as pd
import random

# Generate 300 rows of transaction data
num_rows = 300
transaction_data = []

for i in range(1, num_rows + 1):
    ref = f"TX{1000 + i}"
    amount = random.randint(100, 50000)
    status = random.choice(["success", "failed"])
    transaction_data.append((ref, amount, status))

# Create a DataFrame
df = pd.DataFrame(transaction_data, columns=["transaction_reference", "amount", "status"])

# Save to CSV
df.to_csv("provider.csv", index=False)

print("CSV file 'transactions.csv' has been created.")
