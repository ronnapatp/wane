CREATE OR REPLACE DATABASE schedule;
USE schedule;
CREATE OR REPLACE TABLE Monday(
    ord int,
    Person int,
    PRIMARY KEY (ord)
);
CREATE OR REPLACE TABLE Tuesday(
    ord int NOT NULL AUTO_INCREMENT,
    Person int NOT NULL,
    PRIMARY KEY (ord)
);
CREATE OR REPLACE TABLE Wednesday(
    ord int NOT NULL AUTO_INCREMENT,
    Person int NOT NULL,
    PRIMARY KEY (ord)
);
CREATE OR REPLACE TABLE Thursday(
    ord int NOT NULL AUTO_INCREMENT,
    Person int NOT NULL,
    PRIMARY KEY (ord)
);
CREATE OR REPLACE TABLE Friday(
    ord int NOT NULL AUTO_INCREMENT,
    Person int NOT NULL,
    PRIMARY KEY (ord)
);
