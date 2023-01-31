-- migrate:up
CREATE TABLE community_images (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  community_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_width INT NOT NULL,
  image_height INT NOT NULL,
  point_x INT NOT NULL,
  point_y INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (community_id) REFERENCES community_posts (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- migrate:down
DROP TABLE community_images;
