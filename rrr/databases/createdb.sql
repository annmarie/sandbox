-- db setup
DROP DATABASE recibes_dev;

CREATE DATABASE recibes_dev;

USE recibes_dev;

 CREATE TABLE user (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_digest VARCHAR(255),
  admin TINYINT(1),
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
 ) ENGINE=MyISAM;

CREATE INDEX email_ix ON user (email);

CREATE TRIGGER user_create_at BEFORE INSERT ON `user`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE recipe (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rcp_headline VARCHAR(255) NOT NULL,
  rcp_body MEDIUMTEXT,
  rcp_notes MEDIUMTEXT,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE INDEX rcp_headline_ix ON recipe (rcp_headline);

CREATE TRIGGER recipe_create BEFORE INSERT ON `recipe`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE user_recipe (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usr_id INT(10) NOT NULL,
  rcp_id INT(10) NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE TRIGGER user_recipe_create BEFORE INSERT ON `user_recipe`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE ingredient (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ingr_item VARCHAR(255) UNIQUE NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE INDEX ingr_item_ix ON ingredient (ingr_item);

CREATE TRIGGER ingredient_create BEFORE INSERT ON `ingredient`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE recipe_ingredient (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rcp_id INT(10) NOT NULL,
  ingr_id INT(10) NOT NULL,
  ingr_amount VARCHAR(100),
  ingr_notes MEDIUMTEXT,
  ingr_order INT(10) DEFAULT 0,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE TRIGGER recipe_ingredient_create BEFORE INSERT ON `recipe_ingredient`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE tag (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tag_item VARCHAR(255) UNIQUE NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE INDEX tag_item_ix ON tag (tag_item);

CREATE TRIGGER tag_create BEFORE INSERT ON `tag`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE recipe_tag (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rcp_id INT(10) NOT NULL,
  tag_id INT(10) NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE TRIGGER recipe_tag_create BEFORE INSERT ON `recipe_tag`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE image (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  img_filepath VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) ENGINE=MyISAM;

CREATE TRIGGER image_create BEFORE INSERT ON `image`
FOR EACH ROW SET NEW.updated_at = NOW();

CREATE TABLE word (
   id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   word_item VARCHAR(100) NOT NULL DEFAULT ''
) ENGINE=MyISAM;

CREATE INDEX word_item_ix ON word (word_item);

CREATE TABLE occurrence (
   id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   word_id INT(10) UNSIGNED NOT NULL default '0',
   rcp_id INT(10) UNSIGNED NOT NULL default '0'
) ENGINE=MyISAM;
