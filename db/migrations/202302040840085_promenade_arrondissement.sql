-- migrate:up
CREATE TABLE promenade_arrondissement (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(255) NOT NULL
);

-- migrate:down
DROP TABLE promenade_arrondissement;