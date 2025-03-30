import pandas as pd
import json
import pymysql

# MySQL connection
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="athish2503",
    database="ocs_srms"
)
cursor = conn.cursor()

# Load CSV data
csv_file = "C:\\Users\\hathi\\Downloads\\Contacts.csv" 
df = pd.read_csv(csv_file)

VALID_SALUTATIONS = {"Mr.", "Ms.", "Mrs.", "Dr."}

# Function to preprocess customer data
def preprocess_customer_data(row):
    salutation = str(row.get("Salutation", "Mr.")).strip()
    if salutation not in VALID_SALUTATIONS:
        salutation = "Mr."  # Default value if invalid

    return (
        str(row.get("Customer ID", "")).strip()[:15],  # Ensure max 15 chars
        salutation,  # Use validated salutation
        str(row.get("First Name", "")).strip(),
        str(row.get("Last Name", "")).strip(),
        str(row.get("Email", "")).strip(),
        str(row.get("Phone Number", "")).strip() if pd.notna(row.get("Phone Number", "")) else None,
        json.dumps({
            "addressLine": str(row.get("Address Line", "")).strip(),
            "city": str(row.get("City", "")).strip(),
            "state": str(row.get("State", "")).strip(),
            "country": str(row.get("Country", "IN")).strip(),
            "zipCode": str(row.get("Zip Code", "")).strip(),
        }),
        str(row.get("Other Contacts", "[]")).strip(),
        str(row.get("Notes", "")).strip(),
        str(row.get("Company Name", "")).strip(),
        str(row.get("Display Name", "")).strip(),
        str(row.get("GSTIN", "")).strip(),
        str(row.get("Currency Code", "INR")).strip(),
        str(row.get("GST Treatment", "No GST")).strip(),
        str(row.get("Tax Preference", "Taxable")).strip(),
        str(row.get("Exemption Reason", "")).strip(),
        str(row.get("Customer Status", "Active")).strip(),
    )



# Prepare SQL query for inserting data
insert_query = """
INSERT INTO customers (
    customer_id, salutation, first_name, last_name, primary_email, primary_phone_number, 
    customer_address, other_contacts, notes, company_name, display_name, gst_in, 
    currency_code, gst_treatment, tax_preference, exemption_reason, customer_status
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Convert CSV rows into MySQL records
customer_data = [preprocess_customer_data(row) for _, row in df.iterrows()]

# Insert data into MySQL
if customer_data:
    cursor.executemany(insert_query, customer_data)
    conn.commit()
    print("Data successfully inserted into MySQL!")
else:
    print("No valid data found for insertion.")

# Close connection
cursor.close()
conn.close()
