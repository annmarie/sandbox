
DROP DATABASE testbox;

CREATE DATABASE testbox;

USE testbox;

CREATE TABLE notes (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rcp_notes MEDIUMTEXT,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP
);

CREATE TRIGGER notes_create BEFORE INSERT ON `notes`
FOR EACH ROW SET NEW.updated = NOW();

