const { getConnection, sql } = require('../config/database');
const logger = require('../utils/logger');

class HouseholdService {
  /**
   * Lay danh sach ho khau
   */
  async getHouseholds(filters = {}) {
    try {
      const pool = await getConnection();
      const {
        page = 1,
        pageSize = 20,
        searchTerm = null,
        wardId = null,
      } = filters;

      const offset = (page - 1) * pageSize;
      const request = pool.request();

      request.input('pageSize', sql.Int, parseInt(pageSize));
      request.input('offset', sql.Int, offset);

      let whereConditions = [];

      if (searchTerm) {
        request.input('searchTerm', sql.NVarChar, `%${searchTerm}%`);
        whereConditions.push(
          '(h.household_code LIKE @searchTerm OR c.full_name LIKE @searchTerm)'
        );
      }

      if (wardId) {
        request.input('wardId', sql.Int, wardId);
        whereConditions.push('h.ward_id = @wardId');
      }

      const whereClause = whereConditions.length > 0
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM Households h
        INNER JOIN Citizens c ON h.head_of_household_id = c.citizen_id
        ${whereClause}
      `;

      const countResult = await request.query(countQuery);
      const totalCount = countResult.recordset[0].total;

      // Data query
      const dataQuery = `
        SELECT
          h.household_id,
          h.household_code,
          h.address,
          h.member_count,
          h.registration_date,
          c.citizen_code as head_citizen_code,
          c.full_name as head_full_name,
          c.phone as head_phone,
          w.ward_name,
          d.district_name,
          p.province_name
        FROM Households h
        INNER JOIN Citizens c ON h.head_of_household_id = c.citizen_id
        INNER JOIN Wards w ON h.ward_id = w.ward_id
        INNER JOIN Districts d ON w.district_id = d.district_id
        INNER JOIN Provinces p ON d.province_id = p.province_id
        ${whereClause}
        ORDER BY h.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `;

      const dataResult = await request.query(dataQuery);

      return {
        data: dataResult.recordset,
        totalCount,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      };
    } catch (error) {
      logger.error('Get households failed:', error);
      throw error;
    }
  }

  /**
   * Lay chi tiet ho khau
   */
  async getHouseholdById(householdId) {
    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input('householdId', sql.Int, householdId)
        .query(`
          SELECT
            h.*,
            c.citizen_code as head_citizen_code,
            c.full_name as head_full_name,
            c.date_of_birth as head_date_of_birth,
            c.phone as head_phone,
            w.ward_name,
            w.ward_code,
            d.district_name,
            d.district_code,
            p.province_name,
            p.province_code
          FROM Households h
          INNER JOIN Citizens c ON h.head_of_household_id = c.citizen_id
          INNER JOIN Wards w ON h.ward_id = w.ward_id
          INNER JOIN Districts d ON w.district_id = d.district_id
          INNER JOIN Provinces p ON d.province_id = p.province_id
          WHERE h.household_id = @householdId
        `);

      if (result.recordset.length === 0) {
        throw new Error('Khong tim thay ho khau');
      }

      return result.recordset[0];
    } catch (error) {
      logger.error('Get household by id failed:', error);
      throw error;
    }
  }

  /**
   * Tao ho khau moi
   */
  async createHousehold(householdData, createdBy) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // Kiem tra chu ho co hop le khong (phai tren 18 tuoi)
      const citizenCheck = await transaction
        .request()
        .input('citizenId', sql.Int, householdData.head_of_household_id)
        .query(`
          SELECT
            citizen_id,
            full_name,
            DATEDIFF(YEAR, date_of_birth, GETDATE()) as age,
            ward_id
          FROM Citizens
          WHERE citizen_id = @citizenId AND is_active = 1
        `);

      if (citizenCheck.recordset.length === 0) {
        throw new Error('Chu ho khong ton tai');
      }

      const headOfHousehold = citizenCheck.recordset[0];

      if (headOfHousehold.age < 18) {
        throw new Error('Chu ho phai tu 18 tuoi tro len');
      }

      // Kiem tra chu ho da la chu ho khac chua
      const existingHead = await transaction
        .request()
        .input('citizenId', sql.Int, householdData.head_of_household_id)
        .query(`
          SELECT household_id
          FROM Households
          WHERE head_of_household_id = @citizenId
        `);

      if (existingHead.recordset.length > 0) {
        throw new Error('Cong dan nay da la chu ho cua mot ho khau khac');
      }

      // Tao ma so ho khau tu dong
      const codeResult = await transaction
        .request()
        .input('wardId', sql.Int, householdData.ward_id)
        .query(`
          SELECT
            w.ward_code,
            COUNT(h.household_id) as household_count
          FROM Wards w
          LEFT JOIN Households h ON w.ward_id = h.ward_id
          WHERE w.ward_id = @wardId
          GROUP BY w.ward_code
        `);

      const { ward_code, household_count } = codeResult.recordset[0];
      const householdCode = `HK-${ward_code}-${String(household_count + 1).padStart(4, '0')}`;

      // Tao ho khau
      const insertResult = await transaction
        .request()
        .input('household_code', sql.NVarChar, householdCode)
        .input('head_of_household_id', sql.Int, householdData.head_of_household_id)
        .input('address', sql.NVarChar, householdData.address)
        .input('ward_id', sql.Int, householdData.ward_id)
        .input('household_type', sql.NVarChar, householdData.household_type || 'Thuong tru')
        .input('notes', sql.NVarChar, householdData.notes || null)
        .input('created_by', sql.Int, createdBy)
        .query(`
          INSERT INTO Households (
            household_code, head_of_household_id, address, ward_id,
            household_type, notes, created_by
          )
          OUTPUT INSERTED.household_id
          VALUES (
            @household_code, @head_of_household_id, @address, @ward_id,
            @household_type, @notes, @created_by
          )
        `);

      const householdId = insertResult.recordset[0].household_id;

      // Them chu ho vao thanh vien ho khau
      await transaction
        .request()
        .input('household_id', sql.Int, householdId)
        .input('citizen_id', sql.Int, householdData.head_of_household_id)
        .input('relationship', sql.NVarChar, 'Chu ho')
        .query(`
          INSERT INTO HouseholdMembers (
            household_id, citizen_id, relationship_to_head
          )
          VALUES (@household_id, @citizen_id, @relationship)
        `);

      await transaction.commit();
      logger.info(`Household created: ${householdId} by user ${createdBy}`);

      return await this.getHouseholdById(householdId);
    } catch (error) {
      await transaction.rollback();
      logger.error('Create household failed:', error);
      throw error;
    }
  }

  /**
   * Lay danh sach thanh vien ho khau
   */
  async getHouseholdMembers(householdId) {
    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input('householdId', sql.Int, householdId)
        .query(`
          SELECT
            hm.member_id,
            hm.household_id,
            c.citizen_id,
            c.citizen_code,
            c.full_name,
            c.date_of_birth,
            DATEDIFF(YEAR, c.date_of_birth, GETDATE()) as age,
            c.gender,
            c.phone,
            hm.relationship_to_head,
            hm.join_date,
            hm.leave_date,
            hm.is_current_member
          FROM HouseholdMembers hm
          INNER JOIN Citizens c ON hm.citizen_id = c.citizen_id
          WHERE hm.household_id = @householdId
          ORDER BY
            CASE
              WHEN hm.relationship_to_head = 'Chu ho' THEN 1
              WHEN hm.relationship_to_head LIKE 'Vo%' OR hm.relationship_to_head LIKE 'Chong%' THEN 2
              ELSE 3
            END,
            c.date_of_birth
        `);

      return result.recordset;
    } catch (error) {
      logger.error('Get household members failed:', error);
      throw error;
    }
  }

  /**
   * Them thanh vien vao ho khau
   */
  async addHouseholdMember(householdId, memberData) {
    try {
      const pool = await getConnection();

      // Kiem tra ho khau ton tai
      const household = await this.getHouseholdById(householdId);

      // Kiem tra so luong thanh vien
      if (household.member_count >= 15) {
        throw new Error('Ho khau da dat so luong thanh vien toi da (15 nguoi)');
      }

      // Kiem tra cong dan ton tai
      const citizenCheck = await pool
        .request()
        .input('citizenId', sql.Int, memberData.citizen_id)
        .query(`
          SELECT citizen_id
          FROM Citizens
          WHERE citizen_id = @citizenId AND is_active = 1
        `);

      if (citizenCheck.recordset.length === 0) {
        throw new Error('Cong dan khong ton tai');
      }

      // Kiem tra cong dan da thuoc ho khau khac chua
      const existingMember = await pool
        .request()
        .input('citizenId', sql.Int, memberData.citizen_id)
        .query(`
          SELECT household_id
          FROM HouseholdMembers
          WHERE citizen_id = @citizenId AND is_current_member = 1
        `);

      if (existingMember.recordset.length > 0) {
        throw new Error('Cong dan da thuoc mot ho khau khac');
      }

      // Them thanh vien
      await pool
        .request()
        .input('household_id', sql.Int, householdId)
        .input('citizen_id', sql.Int, memberData.citizen_id)
        .input('relationship', sql.NVarChar, memberData.relationship_to_head)
        .query(`
          INSERT INTO HouseholdMembers (
            household_id, citizen_id, relationship_to_head
          )
          VALUES (@household_id, @citizen_id, @relationship)
        `);

      logger.info(`Member added to household ${householdId}`);

      return await this.getHouseholdMembers(householdId);
    } catch (error) {
      logger.error('Add household member failed:', error);
      throw error;
    }
  }

  /**
   * Xoa thanh vien khoi ho khau
   */
  async removeHouseholdMember(householdId, citizenId) {
    try {
      const pool = await getConnection();

      // Kiem tra khong duoc xoa chu ho
      const household = await this.getHouseholdById(householdId);

      if (household.head_of_household_id === citizenId) {
        throw new Error('Khong the xoa chu ho. Vui long chuyen chu ho truoc');
      }

      // Danh dau thanh vien da roi khoi ho
      await pool
        .request()
        .input('householdId', sql.Int, householdId)
        .input('citizenId', sql.Int, citizenId)
        .query(`
          UPDATE HouseholdMembers
          SET
            is_current_member = 0,
            leave_date = CAST(GETDATE() AS DATE),
            updated_at = GETDATE()
          WHERE household_id = @householdId
            AND citizen_id = @citizenId
            AND is_current_member = 1
        `);

      logger.info(`Member removed from household ${householdId}`);
    } catch (error) {
      logger.error('Remove household member failed:', error);
      throw error;
    }
  }
}

module.exports = new HouseholdService();