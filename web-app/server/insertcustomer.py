import pandas as pd
import json
import pymysql
from datetime import datetime

# MySQL connection
# Retaining hardcoded credentials as per your specific instruction for a one-off script.
conn = None
cursor = None
try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="ocs_srms"
    )
    cursor = conn.cursor()
    print("Successfully connected to the database.")
except pymysql.Error as e:
    print(f"Error connecting to MySQL database: {e}")
    # Exit if connection fails, as further operations would fail
    exit(1) 

# Function to generate customer ID using a provided datetime object
def generate_customer_id(dt_object):
    # Format the provided datetime object as "CIDYYMMDDHHMMSS"
    return dt_object.strftime("CID%y%m%d%H%M%S")

# Mapping for full country names to 2-letter ISO codes
# Add any other countries from your CSV that are not in this list
COUNTRY_NAME_TO_CODE = { "India": "IN", "South Africa": "ZA", "United Arab Emirates": "AE", }

# Load CSV
CSV_FILE_PATH = "C:\\Users\\krish\\Desktop\\Programming\\Self Projects\\subsync\\web-app\\server\\generate_filtered_csv.csv"
df = None
try:
    df = pd.read_csv(CSV_FILE_PATH)
    print(f"Successfully loaded CSV from: {CSV_FILE_PATH}")
except FileNotFoundError:
    print(f"Error: CSV file not found at {CSV_FILE_PATH}. Please ensure the file exists.")
    if cursor: cursor.close()
    if conn: conn.close()
    exit(1)
except Exception as e:
    print(f"Error loading CSV file: {e}")
    if cursor: cursor.close()
    if conn: conn.close()
    exit(1)

# --- Data Preprocessing (before iterating for efficiency and correctness) ---
# It's better to parse 'Created Time' here as a datetime object directly using the known format.
# This ensures it's a datetime object before we use it for generating customer_id and for DB insert.
df['Created Time_Parsed'] = pd.to_datetime(df['Created Time'], format="%d-%m-%Y %H:%M:%S", errors='coerce')
df['Last Modified Time_Parsed'] = pd.to_datetime(df['Last Modified Time'], errors='coerce') # General parse for last modified

# Iterate and insert into DB
processed_count = 0
skipped_count = 0
for index, row in df.iterrows():
    # Skip if essential fields are missing
    if pd.isna(row['First Name']) or pd.isna(row['EmailID']) or \
       pd.isna(row['Phone']) or pd.isna(row['GST Identification Number (GSTIN)']):
        print(f"Skipping row {index+2} due to missing essential fields (First Name, EmailID, Phone, GSTIN).") # +2 for header and 0-index
        skipped_count += 1
        continue

    # Determine the datetime object to use for customer_id generation
    # Use the parsed 'Created Time' if valid, otherwise fallback to current time
    customer_id_datetime = row['Created Time_Parsed'] if pd.notna(row['Created Time_Parsed']) else datetime.now()
    customer_id = generate_customer_id(customer_id_datetime)

    salutation = row['Salutation'] if pd.notna(row['Salutation']) else 'Mr.'
    first_name = row['First Name']
    last_name = row['Last Name'] if pd.notna(row['Last Name']) else ''
    primary_email = row['EmailID']
    
    # Store phone number as string after cleaning, handle potential empty string
    primary_phone_number_str = ''.join(filter(str.isdigit, str(row['Phone'])))
    
    company_name = row['Company Name'] if pd.notna(row['Company Name']) else row['Display Name']
    display_name = row['Display Name']
    gst_in = row['GST Identification Number (GSTIN)']
    
    # Ensure currency_code is a string and truncate
    currency_code = str(row['Currency Code'])[:3].upper() if pd.notna(row['Currency Code']) else 'INR' 
    
    # Ensure proper string comparison for validation
    gst_treatment_val = str(row['GST Treatment']).strip() if pd.notna(row['GST Treatment']) else ''
    gst_treatment = gst_treatment_val if gst_treatment_val in ['iGST', 'CGST & SGST', 'No GST'] else 'iGST'
    
    # Handle boolean for 'Taxable'
    tax_preference = 'Taxable' if row['Taxable'] == True else 'Tax Exempt' 
    exemption_reason = '' if tax_preference == 'Taxable' else 'Exempt as per record'
    
    customer_status_val = str(row['Status']).strip() if pd.notna(row['Status']) else ''
    customer_status = customer_status_val if customer_status_val in ['Active', 'Inactive'] else 'Active'
    
    # Use the parsed datetime objects for database insertion
    created_at = row['Created Time_Parsed'] if pd.notna(row['Created Time_Parsed']) else None
    updated_at = row['Last Modified Time_Parsed'] if pd.notna(row['Last Modified Time_Parsed']) else None
    
    # Get raw country name from CSV and map to 2-letter ISO code
    raw_country = str(row['Billing Country']).strip() if pd.notna(row['Billing Country']) else ''
    country_code = COUNTRY_NAME_TO_CODE.get(raw_country, 'IN') # Default to 'IN' if not found

    notes = '' if pd.isna(row['Notes']) else str(row['Notes']) # Ensure notes is string

    # Create address JSON
    address = {
        "addressLine": str(row['Billing Address']) if pd.notna(row['Billing Address']) else "",
        "city": str(row['Billing City']) if pd.notna(row['Billing City']) else "",
        "state": str(row['Billing State']) if pd.notna(row['Billing State']) else "",
        "country": str(country_code), # Use the 2-letter code here
        "zipCode": str(row['Billing Code']) if pd.notna(row['Billing Code']) else ""
    }

    customer_address_json = json.dumps(address)
    other_contacts_json = json.dumps([]) # Assuming this is always an empty array for now

    # SQL insert
    sql = """
    INSERT INTO customers (
        customer_id, salutation, first_name, last_name, primary_email, primary_phone_number,
        customer_address, other_contacts, notes, company_name, display_name, gst_in,
        currency_code, gst_treatment, tax_preference, exemption_reason, customer_status,
        created_at, updated_at, country_code
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        customer_id, salutation, first_name, last_name, primary_email, primary_phone_number_str, # Use string for phone number
        customer_address_json, other_contacts_json, notes, company_name, display_name, gst_in,
        currency_code, gst_treatment, tax_preference, exemption_reason, customer_status,
        created_at, updated_at, country_code
    )

    try:
        cursor.execute(sql, values)
        conn.commit()
        processed_count += 1
    except pymysql.err.IntegrityError as e:
        print(f"Skipping row {index+2} (GSTIN: {gst_in}) due to duplicate or invalid data: {e}")
        skipped_count += 1
    except pymysql.Error as e:
        print(f"Database error for row {index+2} (GSTIN: {gst_in}): {e}")
        conn.rollback() # Rollback the current transaction on other DB errors
        skipped_count += 1
    except Exception as e:
        print(f"An unexpected error occurred for row {index+2} (GSTIN: {gst_in}): {e}")
        skipped_count += 1

# Close connections (only if they were successfully opened)
if cursor:
    cursor.close()
if conn:
    conn.close()

print(f"\nData import complete. Total rows processed: {processed_count}. Total rows skipped: {skipped_count}.")
