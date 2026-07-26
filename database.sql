-- Office Manager Database Schema & Seed Data Script

CREATE DATABASE IF NOT EXISTS office_manager;
USE office_manager;

-- Drop tables if they already exist (child tables first)
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS department_heads;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS admins;

-- 1. Admins Table
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Departments Table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  profile_image VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Department Heads Table
CREATE TABLE department_heads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  employee_number VARCHAR(50) NOT NULL UNIQUE,
  age INT,
  profile_image VARCHAR(255),
  profile_description TEXT,
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Employees Table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  employee_number VARCHAR(50) NOT NULL UNIQUE,
  age INT,
  profile_image VARCHAR(255),
  profile_description TEXT,
  department_id INT,
  report_to_head_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (report_to_head_id) REFERENCES department_heads(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin Account
-- Email: admin@officemanager.com
-- Password: Admin@123
INSERT INTO admins (name, email, password_hash) VALUES
('System Administrator', 'admin@officemanager.com', '$2a$10$3ETyGslMLPk7vMQQzU53Te4COK.GgrQA/upVL6Gh.9o1ms7qSBQFS');

-- Seed Departments (At least 4)
INSERT INTO departments (id, name, profile_image, description) VALUES
(1, 'Emergency & Transport', '/assets/department-logos/ambulance.png', 'Rapid response unit handling critical medical transport, initial trauma stabilization, and 24/7 mobile emergency support Services.'),
(2, 'Cardiology & Critical Care', '/assets/department-logos/heart-with-electrocardiogram.png', 'Advanced cardiac diagnostics, intensive care monitoring, heart failure management, and post-surgical recovery.'),
(3, 'Neurology & Brain Research', '/assets/department-logos/human-brain.png', 'Comprehensive brain and nerve research center offering neuro-diagnostic testing, stroke intervention, and cognitive therapy.'),
(4, 'Pharmacy & Diagnostics', '/assets/department-logos/pills-bottle.png', 'Central pharmaceutical dispensary, specialized compounding, automated drug distribution, and clinical laboratory analytics.');

-- Seed Department Heads (At least 4)
INSERT INTO department_heads (id, name, employee_number, age, profile_image, profile_description, department_id) VALUES
(1, 'Dr. Sarah Jenkins', 'HD-1001', 45, '/assets/department-heads/cm-profile1.jpg', 'Board-certified emergency physician with over 18 years of experience leading high-velocity response teams and field medicine.', 1),
(2, 'Dr. Robert Chen', 'HD-1002', 52, '/assets/department-heads/cm-profile2.jpg', 'Senior Cardiologist and Clinical Researcher specializing in non-invasive electrophysiology and cardiovascular rehabilitation.', 2),
(3, 'Dr. Elena Rostova', 'HD-1003', 48, '/assets/department-heads/cm-profile3.jpg', 'Director of Neurosciences with expertise in neurodegenerative disorders, MRI interpretation, and cognitive recovery protocols.', 3),
(4, 'Dr. Marcus Vance', 'HD-1004', 50, '/assets/department-heads/cm-profile4.jpg', 'Chief Pharmacologist overseeing institutional drug safety, laboratory automation, and precision diagnostic assays.', 4);

-- Seed Employees (At least 10)
INSERT INTO employees (id, name, employee_number, age, profile_image, profile_description, department_id, report_to_head_id) VALUES
(1, 'Emily Watson', 'EMP-2001', 29, '/assets/employees/offemp1.jpg', 'Lead Paramedic managing emergency transport dispatch and high-acuity patient stabilization.', 1, 1),
(2, 'Michael Chang', 'EMP-2002', 34, '/assets/employees/offemp2.jpg', 'Cardiac Sonographer executing specialized echocardiograms and vascular Doppler scans.', 2, 2),
(3, 'Sophia Martinez', 'EMP-2003', 31, '/assets/employees/offemp3.jpg', 'EEG Technologist operating high-density brainwave mapping and epilepsy monitoring systems.', 3, 3),
(4, 'David Miller', 'EMP-2004', 38, '/assets/employees/offemp4.jpg', 'Clinical Pharmacist overseeing oncology medication preparation and sterile compounding.', 4, 4),
(5, 'Anna Kowalski', 'EMP-2005', 27, '/assets/employees/offemp5.jpg', 'Trauma Triage Nurse facilitating immediate ER patient assessment and resuscitation support.', 1, 1),
(6, 'James Wilson', 'EMP-2006', 33, '/assets/employees/offemp6.jpg', 'ICU Care Specialist managing mechanical ventilation and continuous hemodynamic monitoring.', 2, 2),
(7, 'Olivia Taylor', 'EMP-2007', 30, '/assets/department-heads/cm-profile5.jpg', 'Cognitive Rehabilitation Therapist designing personalized neuro-recovery therapy plans.', 3, 3),
(8, 'Daniel Anderson', 'EMP-2008', 35, '/assets/department-heads/cm-profile6.jpg', 'Diagnostic Lab Scientist analyzing complex blood, tissue, and molecular diagnostic panels.', 4, 4),
(9, 'Isabella Garcia', 'EMP-2009', 28, '/assets/department-logos/drop-with-hospital-symbol.png', 'Emergency Fleet Dispatcher directing medical transport routes and telemetry communication.', 1, 1),
(10, 'William Thomas', 'EMP-2010', 36, '/assets/department-logos/test-tubes.png', 'Cardiac Cath Lab Assistant supporting angioplasty procedures and emergency stent placements.', 2, 2);
