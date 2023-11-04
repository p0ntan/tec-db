-- 
-- Create the database `test`
-- 

DROP DATABASE IF EXISTS `test`;

CREATE DATABASE `test`;

USE `test`;

-- First drop table
DROP TABLE IF EXISTS `customer`;

--
-- Table `customer`
--
CREATE TABLE `customer` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `age` INT NOT NULL,
    `occupation` VARCHAR(45),
    `hometown` VARCHAR(10),
    `single` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
);

--
-- Insert into customer
--
INSERT INTO `customer` (name, age, occupation, hometown, single) VALUES
    ('Bill', 13, 'Student', 'Örebro', TRUE),
    ('Bob', 16, 'Plumber', 'Stockholm', TRUE),
    ('Jens', 18, 'Plumber', 'Jönköping', FALSE),
    ('Carl', 20, 'Artist', 'Stockholm', TRUE)
;
