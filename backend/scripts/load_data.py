import pandas as pd
import pymongo
from pymongo import MongoClient
import json
import os
from datetime import datetime

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce_chatbot']

def load_csv_to_mongodb(csv_file, collection_name):
    """Load CSV data into MongoDB collection"""
    try:
        # Read CSV file
        df = pd.read_csv(f'data/{csv_file}')
        
        # Convert DataFrame to dict
        records = df.to_dict('records')
        
        # Handle date columns
        for record in records:
            for key, value in record.items():
                if 'at' in key.lower() and pd.notna(value):
                    try:
                        record[key] = pd.to_datetime(value).to_pydatetime()
                    except:
                        pass
        
        # Insert into MongoDB
        collection = db[collection_name]
        collection.delete_many({})  # Clear existing data
        
        if records:
            collection.insert_many(records)
            print(f"✓ Loaded {len(records)} records into {collection_name}")
        else:
            print(f"✗ No records found in {csv_file}")
            
    except Exception as e:
        print(f"✗ Error loading {csv_file}: {str(e)}")

def main():
    """Load all CSV files into MongoDB"""
    print("Starting data loading process...")
    
    csv_files = [
        ('distribution_centers.csv', 'distributioncenters'),
        ('inventory_items.csv', 'inventoryitems'),
        ('order_items.csv', 'orderitems'),
        ('orders.csv', 'orders'),
        ('products.csv', 'products'),
        ('users.csv', 'users')
    ]
    
    for csv_file, collection_name in csv_files:
        load_csv_to_mongodb(csv_file, collection_name)
    
    print("\nData loading completed!")
    print("You can now start the backend server.")

if __name__ == "__main__":
    main()