--
-- SETUP
--
DROP DATABASE IF EXISTS `test`;
CREATE DATABASE `test`;
USE `test`;

--
-- DDL
--

DROP TABLE IF EXISTS `trip_varchar`;
DROP TABLE IF EXISTS `trip_text`;
DROP TABLE IF EXISTS `trip_mediumtext`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `transaction`;
DROP TABLE IF EXISTS `card`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `bike`;
DROP TABLE IF EXISTS `bike_varchar`;

CREATE TABLE `bike`(
    `id` VARCHAR(6) NOT NULL,
    `city_id` VARCHAR(10) NOT NULL,
    `status_id` INT NOT NULL,
    `long` DECIMAL(9,7),
    `lat` DECIMAL(9,7),

    PRIMARY KEY (`id`)
);

CREATE TABLE `bike_varchar`(
    `id` VARCHAR(6) NOT NULL,
    `city_id` VARCHAR(10) NOT NULL,
    `status_id` INT NOT NULL,
    `geometry` VARCHAR(150),

    PRIMARY KEY (`id`)
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `hash` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
);

CREATE TABLE `card`(
    `user_id` INT NOT NULL,
    `cardnr` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE `transaction`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `amount` INT NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE `admin`(
    `user_id` INT NOT NULL,
    `access` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);


CREATE TABLE `trip_mediumtext`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `geojson` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
);

CREATE TABLE `trip_varchar`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `geojson` VARCHAR(16000) NOT NULL,

    PRIMARY KEY (`id`)
);


CREATE TABLE `trip_text`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `geojson` TEXT(65535) NOT NULL,

    PRIMARY KEY (`id`)
);

--
-- INSERT
--

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/user.csv'
INTO TABLE `user`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(@id,@username,@password,@hash) SET `id`=@id, `username`=@username, `hash`=@hash
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/card.csv'
INTO TABLE `card`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/transaction.csv'
INTO TABLE `transaction`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/admin.csv'
INTO TABLE `admin`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

--
-- VIEWS
--

DROP VIEW IF EXISTS v_user;

CREATE VIEW v_user AS
SELECT
    user.id,
    username,
    hash,
    cardnr,
    access
FROM `user`
LEFT JOIN
    `card`
    ON user.id = card.user_id
LEFT JOIN
    `admin`
    ON user.id = admin.user_id
;

INSERT INTO `bike`
    (`id`, `city_id`, `status_id`)
VALUES
    ('GOGOGO', 2, 1)
;

INSERT INTO `bike_varchar`
    (`id`, `city_id`, `status_id`)
VALUES
    ('GOGOGO', 2, 1)
;

UPDATE `bike`
SET `lat` = 1.003
WHERE `id` = 'GOGOGO';
