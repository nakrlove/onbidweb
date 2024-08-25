 CREATE TABLE `zipcode` (
  `postno` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '구역번호(우편번호)',
  `city_kr` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시도',
  `city_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시도영문',
  `country_kr` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시군구',
  `country_en` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시군구영문',
  `town_kr` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '읍면',
  `town_en` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '읍면영문',
  `road_cd` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '도로명코드',
  `road_kr` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '도로명',
  `road_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '도로명영문',
  `under_flag` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '지하여부 (0:지상,1:지하)',
  `building_no` int NOT NULL COMMENT '건물번호본번',
  `building_subno` int NOT NULL COMMENT '건물번호부번',
  `building_mgmt_no` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '건물관리번호',
  `bulk_deli_nm` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '다량배달처명(NULL)',
  `building_nm` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시군구용건물명',
  `legal_cd` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '법정동코드',
  `legal_nm_kr` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '법정동명',
  `li` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '리명',
  `dong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '행정동명',
  `san_flag` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '산여부(0:토지, 1:산)',
  `gibun_no` int NOT NULL COMMENT '지번본번',
  `town_dong_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '읍면동일련번호',
  `gibun_subno` int NOT NULL COMMENT '지번부번',
  `postno_old` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '구우편번호(NULL)',
  `postno_serial` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '우편번호일련번호',
  KEY `postno_idx` (`postno`),
  KEY `building_nm_idx` (`building_nm`),
  KEY `building_ngmt_no_idx` (`building_mgmt_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 
 
 CREATE INDEX postno_idx ON zipcode (postno);
 CREATE INDEX building_nm_idx ON zipcode (building_nm);
 CREATE INDEX building_ngmt_no_idx ON zipcode (building_mgmt_no);





 CREATE TABLE `zip_code_chg` (
  `postno` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '구역번호(우편번호)',
  `city_kr` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시도',
  `country_kr` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시군구',
  `town_kr` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '읍면',
  `road_cd` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '도로명코드',
  `road_kr` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '도로명',
  `under_flag` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '지하여부 (0:지상,1:지하)',
  `building_no` int NOT NULL COMMENT '건물번호본번',
  `building_subno` int NOT NULL COMMENT '건물번호부번',
  `building_mgmt_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '건물관리번호',
  `bulk_deli_nm` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '다량배달처명(NULL)',
  `building_nm` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '시군구용건물명',
  `legal_cd` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '법정동코드',
  `legal_nm_kr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '법정동명',
  `li` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '리명',
  `dong` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '행정동명',
  `san_flag` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '산여부(0:토지, 1:산)',
  `gibun_no` int NOT NULL COMMENT '지번본번',
  `gibun_subno` int NOT NULL COMMENT '지번부번',
  `reason_cd` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '이동사유코드',
  `be_serialno` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '변경전읍면동일련번호',
  `af_serialno` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '변경후읍면동일련번호',
  `change_date` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '연계일시(YYYYMMDDHH24MISS)',
  `postno_old` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '구우편번호(NULL)',
  `postno_serial` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '우편번호일련번호'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




//데이터파일 작업
LOAD DATA INFILE '/var/lib/mysql-files/chg.txt'
INTO TABLE zip_code_chg
FIELDS TERMINATED BY '|'
ENCLOSED BY ''
ESCAPED BY '\\'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
( `zip_code_chg`.`postno`,
    `zip_code_chg`.`city_kr`,
    `zip_code_chg`.`country_kr`,
    `zip_code_chg`.`town_kr`,
    `zip_code_chg`.`road_cd`,
    `zip_code_chg`.`road_kr`,
    `zip_code_chg`.`under_flag`,
    `zip_code_chg`.`building_no`,
    `zip_code_chg`.`building_subno`,
    `zip_code_chg`.`building_mgmt_no`,
    `zip_code_chg`.`bulk_deli_nm`,
    `zip_code_chg`.`building_nm`,
    `zip_code_chg`.`legal_cd`,
    `zip_code_chg`.`legal_nm_kr`,
    `zip_code_chg`.`li`,
    `zip_code_chg`.`dong`,
    `zip_code_chg`.`san_flag`,
    `zip_code_chg`.`gibun_no`,
    `zip_code_chg`.`gibun_subno`,
    `zip_code_chg`.`reason_cd`,
    `zip_code_chg`.`be_serialno`,
    `zip_code_chg`.`af_serialno`,
    `zip_code_chg`.`change_date`,
    `zip_code_chg`.`postno_old`,
    `zip_code_chg`.`postno_serial`
  );