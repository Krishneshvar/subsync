import pandas as pd
import random
import re
import numpy as np

def generate_customer_import_csv(input_csv_path, output_csv_path="customers_for_import.csv"):
    """
    Generates a new CSV file with selected and transformed customer data
    from an existing CSV file.

    Args:
        input_csv_path (str): The path to the original CSV file (e.g., "Contacts.csv").
        output_csv_path (str): The path where the new CSV file will be saved.
    """
    try:
        # Load the original CSV file
        df = pd.read_csv(input_csv_path)
        print(f"Successfully loaded CSV from: {input_csv_path}")
    except FileNotFoundError:
        print(f"Error: Input CSV file not found at {input_csv_path}.")
        return
    except Exception as e:
        print(f"Error loading input CSV file: {e}")
        return

    # --- Step 1: Initialize/Combine Address Line and Rename Columns ---
    # Create the 'Address Line' by combining 'Billing Address' and 'Billing Street2'
    # Fill NaN values with empty strings before combining to avoid 'nan' in output
    df['Address Line'] = df['Billing Address'].fillna('').astype(str) + ' ' + \
                         df['Billing Street2'].fillna('').astype(str)
    df['Address Line'] = df['Address Line'].str.strip() # Clean up extra spaces

    # Define the new column names and their corresponding original columns
    # We will rename after selecting to work with consistent new names
    column_rename_map = {
        "Created Time": "Created Time",
        "Display Name": "Display Name",
        "Company Name": "Company Name",
        "Salutation": "Salutation",
        "First Name": "First Name",
        "Last Name": "Last Name",
        "Phone": "Phone",
        "EmailID": "Email", # Renaming "EmailID" to "Email"
        "Currency Code": "Currency Code",
        "Status": "Status",
        "Billing City": "City",
        "Billing State": "State",
        "Billing Country": "Country",
        "Billing Code": "Zip Code",
        "GST Treatment": "GST Treatment",
        "GST Identification Number (GSTIN)": "GSTIN", # Renaming
        "Taxable": "Taxable"
    }

    # Select only the required original columns for processing, then rename
    # Filter to ensure original column exists before trying to select
    cols_to_select = [col for col in column_rename_map.keys() if col in df.columns]
    new_df = df[cols_to_select].copy() # Use .copy() to avoid SettingWithCopyWarning
    
    # Add 'Address Line' which was newly created and is not part of the initial column_rename_map keys
    if 'Address Line' in df.columns and 'Address Line' not in new_df.columns:
        new_df['Address Line'] = df['Address Line']

    new_df = new_df.rename(columns=column_rename_map)


    # --- Step 2: Data Cleaning and Transformation ---

    # 1) Make the first letter of the "First Name" capital. And remove the record if there is no "First Name".
    new_df['First Name'] = new_df['First Name'].astype(str).str.strip()
    new_df = new_df[new_df['First Name'] != ''].copy() # Filter empty First Name
    
    # 9) If there is no "GSTIN", remove that record. (Do this before other GSTIN operations)
    new_df['GSTIN'] = new_df['GSTIN'].astype(str).str.strip()
    new_df = new_df[new_df['GSTIN'] != ''].copy() # Filter empty GSTIN

    # 2) If there are 2 names (John Doe) or names with initials (John D or D. John or D.John) in "First Name",
    #    move the second name (Doe) or the initial (D) to the "Last Name" field.
    def process_names(row):
        first_name = row['First Name'].strip()
        last_name = row['Last Name'].strip() if pd.notna(row['Last Name']) else ''

        parts = first_name.split(' ')
        if len(parts) > 1:
            # If there's already a last name, append the new part to it, or overwrite if it's an initial
            # For simplicity, if there are multiple parts in First Name, first part becomes new First Name, rest becomes Last Name
            if last_name: # If Last Name already exists, prioritize the new part found
                if len(parts[-1]) <= 2 or parts[-1].endswith('.'): # if it's an initial-like, prioritize
                    last_name = parts[-1]
                else: # if it's a full name, append
                    last_name = f"{last_name} {parts[-1]}".strip()
            else:
                last_name = parts[-1]
            first_name = ' '.join(parts[:-1]).strip()
        
        row['First Name'] = first_name.capitalize() # Capitalize first letter
        row['Last Name'] = last_name.capitalize() if last_name else '' # Capitalize last name too
        return row
    
    new_df = new_df.apply(process_names, axis=1)

    # 3) Correct all the phone numbers in "Phone". No spaces or symbols in between.
    # 4) If there is no phone number, then create a unique 10 digit number and store there.
    def clean_and_generate_phone(phone):
        cleaned_phone = re.sub(r'\D', '', str(phone)) # Remove all non-digits
        if not cleaned_phone:
            # Generate a unique 10-digit number (simple random for one-off)
            return ''.join(random.choices('0123456789', k=10))
        return cleaned_phone
    new_df['Phone'] = new_df['Phone'].apply(clean_and_generate_phone)

    # 5) If there is no email ID in "Email", create an email address out of the "First Name" and "Last Name"
    def generate_email(row):
        email = str(row['Email']).strip()
        if not email or email == 'nan': # Check for empty string or pandas NaN converted to 'nan' string
            first = re.sub(r'\W+', '', row['First Name'].lower()) # Remove non-alphanumeric
            last = re.sub(r'\W+', '', row['Last Name'].lower()) # Remove non-alphanumeric
            if first and last:
                return f"{first}{last}@gmail.com"
            elif first:
                return f"{first}@gmail.com"
            else: # Fallback if even first name is missing (shouldn't happen due to earlier filter)
                return f"unknown{random.randint(1000, 9999)}@gmail.com"
        return email
    new_df['Email'] = new_df.apply(generate_email, axis=1)

    # 6) The "Address Line", "City" "State" and "Country" should be capitalized.
    # Using .title() for proper noun capitalization, .upper() for full caps if preferred for Address Line, but title is more common.
    new_df['Address Line'] = new_df['Address Line'].astype(str).str.title()
    new_df['City'] = new_df['City'].astype(str).str.title()
    new_df['State'] = new_df['State'].astype(str).str.title()
    new_df['Country'] = new_df['Country'].astype(str).str.title()

    # 7) If there is no "Zip Code" or something other than a 4 digit or 6 digit code exists, then randomly assign a 6 digit zip code.
    def validate_and_generate_zip(zip_code):
        cleaned_zip = re.sub(r'\D', '', str(zip_code)) # Remove all non-digits
        if not cleaned_zip or (len(cleaned_zip) != 4 and len(cleaned_zip) != 6):
            return ''.join(random.choices('0123456789', k=6))
        return cleaned_zip
    new_df['Zip Code'] = new_df['Zip Code'].apply(validate_and_generate_zip)

    # 8) For "GST Treatment", assign any of the following values randomly to every record:
    #    'iGST', 'CGST & SGST', 'No GST', 'Zero Tax', 'SEZ'.
    gst_options = ['iGST', 'CGST & SGST', 'No GST', 'Zero Tax', 'SEZ']
    new_df['GST Treatment'] = [random.choice(gst_options) for _ in range(len(new_df))]

    # Ensure 'Taxable' column is boolean or string 'True'/'False' consistent with previous use
    # No explicit change requested for 'Taxable' content, just mapping.
    # If the original 'Taxable' was boolean, keep it. If string, convert to 'True'/'False'
    new_df['Taxable'] = new_df['Taxable'].apply(lambda x: 'Taxable' if x == True or str(x).lower() == 'true' else 'Tax Exempt')

    # 10) Finally, after all these, if there is an empty field any of the columns in "column_mapping", then remove that record.
    # This implies checking the final set of desired columns after all renames and creations.
    # We will use the 'final_columns_order' for this check.
    final_columns_order = [
        "Created Time", "Display Name", "Company Name", "Salutation", 
        "First Name", "Last Name", "Phone", "Email", "Currency Code", 
        "Status", "Address Line", "City", "State", "Country", "Zip Code", 
        "GST Treatment", "GSTIN", "Taxable"
    ]

    # Filter final columns to ensure they all exist in new_df before final check
    final_columns_order_filtered = [col for col in final_columns_order if col in new_df.columns]

    # Convert potential empty strings to NaN for reliable dropna
    for col in final_columns_order_filtered:
        new_df[col] = new_df[col].replace('', np.nan)

    # Drop rows with any NaN in the critical final columns
    initial_rows = len(new_df)
    new_df.dropna(subset=final_columns_order_filtered, inplace=True)
    rows_dropped_final_check = initial_rows - len(new_df)
    if rows_dropped_final_check > 0:
        print(f"Removed {rows_dropped_final_check} records due to empty required fields after all transformations.")

    # Reorder columns to match the requested sequence
    new_df = new_df[final_columns_order_filtered]

    # Save the new DataFrame to a CSV file
    try:
        new_df.to_csv(output_csv_path, index=False)
        print(f"Successfully generated new CSV file at: {output_csv_path}")
        print(f"Total records processed and saved: {len(new_df)}")
    except Exception as e:
        print(f"Error saving new CSV file: {e}")

# --- Script Execution ---
if __name__ == "__main__":
    # Define your input and output file paths
    input_file = "C:\\Users\\krish\\Desktop\\Programming\\Self Projects\\subsync\\web-app\\server\\Contacts.csv"
    output_file = "C:\\Users\\krish\\Desktop\\Programming\\Self Projects\\subsync\\web-app\\server\\filtered_customers_data.csv"

    generate_customer_import_csv(input_file, output_file)
