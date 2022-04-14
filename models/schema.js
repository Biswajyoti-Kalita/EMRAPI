//alter table pharmacist add column name VARCHAR(255);
//alter table pharmacist add column hospital_pharmacy_id INT;

module.exports = {
  getSchemaStr: function () {
    return [
      `
            CREATE TABLE IF NOT EXISTS hospital (
				id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                street_address VARCHAR(255),
                city VARCHAR(255),
                zip VARCHAR(255),
                state VARCHAR(255),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `,
      `
            CREATE TABLE IF NOT EXISTS pharmacy (
				id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                street_address VARCHAR(255),
                city VARCHAR(255),
                zip VARCHAR(255),
                state VARCHAR(255),
                hospital_pharmacy_id INT,
                hospital_id INT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS  pharmacist(
				id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                hospital_pharmacist_id INT,
                hospital_pharmacy_id INT,
                hospital_id INT REFERENCES hospital(id),
                pharmacy_id INT REFERENCES pharmacy(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS disease (
				id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                semantic_brand_name VARCHAR(255),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS doctor (
				id SERIAL PRIMARY KEY,
                hospital_doctor_id INT,
                first_name VARCHAR(255),
                middle_name VARCHAR(255),
                last_name VARCHAR(255),
                gender VARCHAR(255),
                photo TEXT,
                signature TEXT,
                street_address VARCHAR(255),
                city VARCHAR(255),
                zip VARCHAR(255),
                state VARCHAR(255),
                hospital_id INT REFERENCES hospital(id),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS drug (
				id SERIAL PRIMARY KEY,
                drug_code VARCHAR(255),
                drug_name VARCHAR(255),
                semantic_brand_name VARCHAR(255),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS drug_disease_ref (
				id SERIAL PRIMARY KEY,
                drug_code VARCHAR(255),
                disease_id INT REFERENCES disease(id),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS message (
				id SERIAL PRIMARY KEY,
                sender_id INT,
                receiver_id INT,
                sender_type INT,
                receiver_type INT,
                message TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS patient  (
				id SERIAL PRIMARY KEY,
                hospital_patient_id INT,
                first_name varchar(255),
                middle_name VARCHAR(255),
                last_name VARCHAR(255),
                gender VARCHAR(255),
                photo TEXT,
                signature TEXT,
                street_address VARCHAR(255),
                city VARCHAR(255),
                zip VARCHAR(255),
                state VARCHAR(255),
                hospital_id INT REFERENCES hospital(id),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS prescription (
				id SERIAL PRIMARY KEY,
                hospital_patient_id INT,
                hospital_doctor_id INT,
                hospital_prescription_id INT,
                hospital_pharmacy_id INT,
                patient_id INT REFERENCES patient(id),
                doctor_id INT REFERENCES doctor(id),
                pharmacy_id INT REFERENCES pharmacy(id),
                hospital_id INT REFERENCES hospital(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS prescription_drug (
				id SERIAL PRIMARY KEY,
                frequency INT,
                duration INT,
                refills INT,
                refills_balance INT,
                hospital_prescription_id INT,
                hospital_id INT REFERENCES hospital(id),
                prescription_id INT REFERENCES prescription(id), 
                drug_code VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )            
            `,
      `
            CREATE TABLE IF NOT EXISTS admin (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255),
				email VARCHAR(255),
				password VARCHAR(255),
				access_token VARCHAR(255),
				admin_type INT,
				hospital_id INT REFERENCES hospital(id),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
			)
		    `,
    ];
  },
};
