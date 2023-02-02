-- migrate:up
CREATE TABLE community_image (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  post_detail_id INT NOT NULL,
  point_x INT NULL,
  point_y INT NULL,
  product_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_detail_id) REFERENCES community_post_details (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- migrate:down
DROP TABLE community_image;