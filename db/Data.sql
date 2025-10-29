USE CitizenManagementDB;
GO

-- =============================================
-- INSERT 46 NEW CITIZENS (Total = 50)
-- All created by user_id = 2 (staff01)
-- All assigned to wards 1, 2, 3, or 4
-- =============================================

INSERT INTO Citizens (citizen_code, full_name, date_of_birth, gender, place_of_birth, ethnicity, occupation, permanent_address, ward_id, created_by) VALUES 
-- Family 1 (Ward 3)
(N'001070005001', N'Đặng Văn Hùng', '1970-01-20', 'Male', N'Ha Noi', N'Kinh', N'Kinh doanh', N'So 50 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001072005002', N'Bùi Thị Thu', '1972-03-15', 'Female', N'Ha Noi', N'Kinh', N'Noi tro', N'So 50 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001095005003', N'Đặng Minh Khang', '1995-07-10', 'Male', N'Ha Noi', N'Kinh', N'Sinh vien', N'So 50 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001098005004', N'Đặng Thị Anh', '1998-11-05', 'Female', N'Ha Noi', N'Kinh', N'Nhan vien van phong', N'So 50 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
-- Family 2 (Ward 4)
(N'001080006001', N'Hoàng Văn Nam', '1980-02-28', 'Male', N'Hai Phong', N'Kinh', N'Ky su', N'So 12 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
(N'001082006002', N'Phan Thị Mai', '1982-06-12', 'Female', N'Ha Noi', N'Kinh', N'Ke toan', N'So 12 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
(N'001105006003', N'Hoàng Gia Bảo', '2005-09-30', 'Male', N'Ha Noi', N'Kinh', N'Hoc sinh', N'So 12 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
-- Family 3 (Ward 1)
(N'001065007001', N'Vũ Đình Trọng', '1965-10-10', 'Male', N'Nam Dinh', N'Kinh', N'Giao vien', N'So 30 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001068007002', N'Lê Thị Hoa', '1968-04-22', 'Female', N'Ha Noi', N'Kinh', N'Noi tro', N'So 30 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001090007003', N'Vũ Anh Tuấn', '1990-12-01', 'Male', N'Ha Noi', N'Kinh', N'Bac si', N'So 30 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
-- Family 4 (Ward 2)
(N'001078008001', N'Trần Văn Long', '1978-08-08', 'Male', N'Ha Noi', N'Kinh', N'Lai xe', N'So 45 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001080008002', N'Nguyễn Thị Kim', '1980-01-19', 'Female', N'Ha Noi', N'Kinh', N'Tho may', N'So 45 Doi Can, Ba Dinh, Ha Noi', 2, 2),
-- Family 5 (Ward 3)
(N'001085009001', N'Lý Văn Hùng', '1985-07-14', 'Male', N'Cao Bang', N'Tay', N'Cong nhan', N'So 60 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001088009002', N'Triệu Thị Lan', '1988-09-03', 'Female', N'Cao Bang', N'Nung', N'Cong nhan', N'So 60 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001110009003', N'Lý Gia Huy', '2010-05-20', 'Male', N'Ha Noi', N'Tay', N'Hoc sinh', N'So 60 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
-- Family 6 (Ward 4)
(N'001060010001', N'Bùi Văn Kiên', '1960-11-30', 'Male', N'Ha Noi', N'Kinh', N'Huu tri', N'So 22 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
(N'001062010002', N'Đỗ Thị Minh', '1962-02-17', 'Female', N'Ha Noi', N'Kinh', N'Huu tri', N'So 22 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
-- Family 7 (Ward 1)
(N'001092011001', N'Phạm Minh Đức', '1992-04-05', 'Male', N'Hai Duong', N'Kinh', N'Lap trinh vien', N'So 18 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001093011002', N'Trần Thu Trang', '1993-08-16', 'Female', N'Ha Noi', N'Kinh', N'Thiet ke', N'So 18 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001117011003', N'Phạm Bảo Châu', '2017-10-25', 'Female', N'Ha Noi', N'Kinh', N'Tre em', N'So 18 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
-- Family 8 (Ward 2)
(N'001055012001', N'Nguyễn Văn An', '1955-06-20', 'Male', N'Ha Noi', N'Kinh', N'Huu tri', N'So 55 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001085012002', N'Nguyễn Thanh Tùng', '1985-03-12', 'Male', N'Ha Noi', N'Kinh', N'Giam doc', N'So 55 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001087012003', N'Võ Thị Bích', '1987-11-01', 'Female', N'Da Nang', N'Kinh', N'Truong phong', N'So 55 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001112012004', N'Nguyễn Hoàng Anh', '2012-07-07', 'Male', N'Ha Noi', N'Kinh', N'Hoc sinh', N'So 55 Doi Can, Ba Dinh, Ha Noi', 2, 2),
-- Family 9 (Ward 3)
(N'001077013001', N'Phan Văn Khải', '1977-12-12', 'Male', N'Ho Chi Minh', N'Kinh', N'Kien truc su', N'So 70 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001079013002', N'Huỳnh Ngọc Diệp', '1979-05-05', 'Female', N'Ho Chi Minh', N'Kinh', N'Noi tro', N'So 70 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
-- Family 10 (Ward 4)
(N'001096014001', N'Đinh Tiến Dũng', '1996-10-08', 'Male', N'Ninh Binh', N'Kinh', N'Marketing', N'So 30 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
(N'001097014002', N'Lê Ngọc Hà', '1997-01-23', 'Female', N'Ha Noi', N'Kinh', N'Content Creator', N'So 30 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
-- Family 11 (Ward 1)
(N'001083015001', N'Dương Văn Trung', '1983-09-15', 'Male', N'Ha Noi', N'Kinh', N'Nhan vien', N'So 25 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001085015002', N'Mai Thị Lan', '1985-04-18', 'Female', N'Ha Noi', N'Kinh', N'Y ta', N'So 25 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001108015003', N'Dương Minh Quân', '2008-03-02', 'Male', N'Ha Noi', N'Kinh', N'Hoc sinh', N'So 25 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001110015004', N'Dương Thảo My', '2010-11-20', 'Female', N'Ha Noi', N'Kinh', N'Hoc sinh', N'So 25 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
-- Family 12 (Ward 2)
(N'001073016001', N'Hồ Văn Cường', '1973-07-21', 'Male', N'Hue', N'Kinh', N'Dau bep', N'So 60 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001075016002', N'Trương Thị Lệ', '1975-10-09', 'Female', N'Hue', N'Kinh', N'Quan ly nha hang', N'So 60 Doi Can, Ba Dinh, Ha Noi', 2, 2),
(N'001099016003', N'Hồ Minh Triết', '1999-01-30', 'Male', N'Ha Noi', N'Kinh', N'Sinh vien', N'So 60 Doi Can, Ba Dinh, Ha Noi', 2, 2),
-- Family 13 (Ward 3)
(N'001091017001', N'Phạm Tuấn Anh', '1991-05-11', 'Male', N'Ha Noi', N'Kinh', N'Tai chinh', N'So 80 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001093017002', N'Vũ Ngọc Lan', '1993-02-14', 'Female', N'Ha Noi', N'Kinh', N'Ngan hang', N'So 80 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
(N'001118017003', N'Phạm Gia Hân', '2018-02-14', 'Female', N'Ha Noi', N'Kinh', N'Tre em', N'So 80 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2),
-- Family 14 (Ward 4 - Single)
(N'001098018001', N'Tô Văn Minh', '1998-07-07', 'Male', N'Ha Noi', N'Kinh', N'IT Support', N'So 35 Giang Vo, Ba Dinh, Ha Noi', 4, 2),
-- Family 15 (Ward 1 - Elderly)
(N'001052019001', N'Trần Văn Thắng', '1952-12-08', 'Male', N'Ha Noi', N'Kinh', N'Huu tri', N'So 40 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
(N'001054019002', N'Lê Thị Sen', '1954-01-25', 'Female', N'Ha Noi', N'Kinh', N'Huu tri', N'So 40 Dien Bien, Ba Dinh, Ha Noi', 1, 2),
-- Family 16 (Ward 2 - Single)
(N'001094020001', N'Nguyễn Thị Hồng', '1994-06-19', 'Female', N'Hai Phong', N'Kinh', N'Nha bao', N'So 70 Doi Can, Ba Dinh, Ha Noi', 2, 2),
-- Family 17 (Ward 4 - Elderly, one will pass away)
(N'001050021001', N'Ngô Văn Dũng', '1950-03-03', 'Male', N'Ha Noi', N'Kinh', N'Huu tri', N'So 18 Giang Vo, Ba Dinh, Ha Noi', 4, 2);

GO

-- =============================================
-- INSERT NEW HOUSEHOLDS (Starting from ID 3)
-- =============================================
-- Ghi chu: Citizen ID bat dau tu 5 (vi da co 4 sample)
-- (5-8)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-003', 5, N'So 50 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2);
-- (9-11)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-004', 9, N'So 12 Giang Vo, Ba Dinh, Ha Noi', 4, 2);
-- (12-14)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-005', 12, N'So 30 Dien Bien, Ba Dinh, Ha Noi', 1, 2);
-- (15-16)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-006', 15, N'So 45 Doi Can, Ba Dinh, Ha Noi', 2, 2);
-- (17-19)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-007', 17, N'So 60 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2);
-- (20-21)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-008', 20, N'So 22 Giang Vo, Ba Dinh, Ha Noi', 4, 2);
-- (22-24)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-009', 22, N'So 18 Dien Bien, Ba Dinh, Ha Noi', 1, 2);
-- (25-28)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-010', 25, N'So 55 Doi Can, Ba Dinh, Ha Noi', 2, 2);
-- (29-30)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-011', 29, N'So 70 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2);
-- (31-32)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-012', 31, N'So 30 Giang Vo, Ba Dinh, Ha Noi', 4, 2);
-- (33-36)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-013', 33, N'So 25 Dien Bien, Ba Dinh, Ha Noi', 1, 2);
-- (37-39)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-014', 37, N'So 60 Doi Can, Ba Dinh, Ha Noi', 2, 2);
-- (40-42)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-015', 40, N'So 80 Ngoc Ha, Ba Dinh, Ha Noi', 3, 2);
-- (43)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-016', 43, N'So 35 Giang Vo, Ba Dinh, Ha Noi', 4, 2);
-- (44-45)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-017', 44, N'So 40 Dien Bien, Ba Dinh, Ha Noi', 1, 2);
-- (46)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-018', 46, N'So 70 Doi Can, Ba Dinh, Ha Noi', 2, 2);
-- (47)
INSERT INTO Households (household_code, head_of_household_id, address, ward_id, created_by) VALUES 
(N'HK-HN-BA-019', 47, N'So 18 Giang Vo, Ba Dinh, Ha Noi', 4, 2);

GO

-- =============================================
-- INSERT HOUSEHOLD MEMBERS
-- (Household IDs start from 3)
-- =============================================
-- Household 3 (4 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(3, 5, N'Chủ hộ'),
(3, 6, N'Vợ'),
(3, 7, N'Con'),
(3, 8, N'Con');

-- Household 4 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(4, 9, N'Chủ hộ'),
(4, 10, N'Vợ'),
(4, 11, N'Con');

-- Household 5 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(5, 12, N'Chủ hộ'),
(5, 13, N'Vợ'),
(5, 14, N'Con');

-- Household 6 (2 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(6, 15, N'Chủ hộ'),
(6, 16, N'Vợ');

-- Household 7 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(7, 17, N'Chủ hộ'),
(7, 18, N'Vợ'),
(7, 19, N'Con');

-- Household 8 (2 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(8, 20, N'Chủ hộ'),
(8, 21, N'Vợ');

-- Household 9 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(9, 22, N'Chủ hộ'),
(9, 23, N'Vợ'),
(9, 24, N'Con');

-- Household 10 (4 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(10, 25, N'Chủ hộ'),
(10, 26, N'Con'),
(10, 27, N'Con dâu'),
(10, 28, N'Cháu');

-- Household 11 (2 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(11, 29, N'Chủ hộ'),
(11, 30, N'Vợ');

-- Household 12 (2 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(12, 31, N'Chủ hộ'),
(12, 32, N'Vợ');

-- Household 13 (4 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(13, 33, N'Chủ hộ'),
(13, 34, N'Vợ'),
(13, 35, N'Con'),
(13, 36, N'Con');

-- Household 14 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(14, 37, N'Chủ hộ'),
(14, 38, N'Vợ'),
(14, 39, N'Con');

-- Household 15 (3 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(15, 40, N'Chủ hộ'),
(15, 41, N'Vợ'),
(15, 42, N'Con');

-- Household 16 (1 member)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(16, 43, N'Chủ hộ');

-- Household 17 (2 members)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(17, 44, N'Chủ hộ'),
(17, 45, N'Vợ');

-- Household 18 (1 member)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(18, 46, N'Chủ hộ');

-- Household 19 (1 member)
INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head) VALUES 
(19, 47, N'Chủ hộ');

GO

-- =============================================
-- INSERT OPTIONAL DATA (Birth, Death, Temporary...)
-- =============================================

-- Insert 1 Birth Certificate
-- Child: Phạm Gia Hân (citizen_id 42, inserted above)
-- Father: Phạm Tuấn Anh (citizen_id 40)
-- Mother: Vũ Ngọc Lan (citizen_id 41)
INSERT INTO BirthCertificates (certificate_number, child_citizen_id, father_citizen_id, mother_citizen_id, birth_place, registration_date, registrar_name, created_by)
VALUES 
(N'GKS-2018-123', 42, 40, 41, N'Benh vien Phu san Ha Noi', '2018-02-20', N'Nguyen Van A', 2);
GO

-- Insert 1 Death Certificate
-- Citizen: Ngô Văn Dũng (citizen_id 47)
-- This will trigger 'trg_UpdateCitizenStatusOnDeath'
-- It will set status='Deceased' and remove him from Household 19
INSERT INTO DeathCertificates (certificate_number, citizen_id, date_of_death, place_of_death, cause_of_death, registration_date, registrar_name, created_by)
VALUES 
(N'GKT-2025-001', 47, '2025-10-15', N'Tai nha', N'Benh gia', '2025-10-16', N'Nguyen Van A', 2);
GO

-- Insert 1 Temporary Residence
-- Citizen: Đặng Minh Khang (citizen_id 7), thuong tru o Ward 3
-- Tam tru o Ward 1 de hoc tap
INSERT INTO TemporaryResidences (citizen_id, temporary_address, ward_id, reason, start_date, end_date, created_by)
VALUES 
(7, N'So 5, Pho Phan Dinh Phung, Dien Bien, Ha Noi', 1, N'Hoc tap', '2025-09-01', '2026-06-30', 2);
GO

-- Insert 1 Temporary Absence
-- Citizen: Hoàng Văn Nam (citizen_id 9), thuong tru o Ward 4
-- Tam vang di Da Nang cong tac
INSERT INTO TemporaryAbsences (citizen_id, destination_address, destination_ward_code, reason, start_date, expected_return_date, created_by)
VALUES 
(9, N'120 Nguyen Van Linh, Thanh pho Da Nang', N'DN-HC-01', N'Cong tac', '2025-11-01', '2025-11-15', 2);
GO

PRINT 'Successfully inserted 46 new citizens (Total 50).';
PRINT 'Successfully inserted 17 new households and corresponding members.';
PRINT 'Successfully inserted sample birth, death, and temporary records.';
GO