--
-- SETUP
--
DROP DATABASE IF EXISTS `test`;
CREATE DATABASE `test`;
USE `test`;

--
-- DDL
--
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `transaction`;
DROP TABLE IF EXISTS `card`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `hash` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
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

-- --
-- -- SELECT
-- --

-- SELECT * FROM v_user;
-- SELECT * FROM transaction;
