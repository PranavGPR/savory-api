CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    pincode VARCHAR(20)
);

CREATE TABLE restaurants (
    id VARCHAR(36) PRIMARY KEY,
    menuid VARCHAR(36),
    name VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(100),
    pincode VARCHAR(20),
    cuisines JSON,
    opening_time TIME,
    closing_time TIME,
    popular_dishes JSON,
    people_say JSON,
    more_info JSON,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    customerid VARCHAR(36) NOT NULL,
    restaurantid VARCHAR(36) NOT NULL,
    status ENUM('ordered', 'picked up', 'delivered') NOT NULL,
    delivered_on DATETIME,
    ordered_item VARCHAR(255),
    amount DECIMAL(10,2),
    payment_mode VARCHAR(50),
    FOREIGN KEY (customerid) REFERENCES customers(id),
    FOREIGN KEY (restaurantid) REFERENCES restaurants(id)
);