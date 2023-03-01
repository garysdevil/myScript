-- CREATE DATABASE gary
CREATE DATABASE filecoin;

\c filecoin;

CREATE TABLE `network_power_tb` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `block_height` int(10) DEFAULT NULL,
  `miner_count` int(10) DEFAULT NULL,
  `raw_power` int(20) DEFAULT NULL,
  `valid_power` int(20) DEFAULT NULL,
  `total_power` int(20) DEFAULT NULL,
  
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;