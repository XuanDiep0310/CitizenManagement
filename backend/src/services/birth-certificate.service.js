const { getConnection, sql } = require('../config/database');
const logger = require('../utils/logger');

class BirthCertificateService {
  /**
   * Lay danh sach giay khai sinh
   */
  async getBirthCertificates(filters = {}) {
    try {
      const pool = await getConnection();
      const {
        page = 1,
        pageSize = 20,
        searchTerm = null,
        wardId = null,
        startDate = null,
        endDate = null,
      } = filters;

      const offset = (page - 1) * pageSize;
      const request = pool.request();

      request.input('pageSize', sql.Int, parseInt(pageSize));
      request.input('offset', sql.Int, offset);

      let whereConditions = [];

      if (searchTerm) {
        request.input('searchTerm', sql.NVarChar, `%${searchTerm}%`);
        whereConditions.push(
          '(bc.certificate_number LIKE @searchTerm OR child.full_name LIKE @searchTerm OR child.citizen_code LIKE @searchTerm)'
        );
      }

      if (wardId) {
        request.input('wardId', sql.Int, wardId);
        whereConditions.push('child.ward_id = @wardId');
      }

      if (startDate) {
        request.input('startDate', sql.Date, startDate);
        whereConditions.push('bc.registration_date >= @startDate');
      }

      if (endDate) {
        request.input('endDate', sql.Date, endDate);
        whereConditions.push('bc.registration_date <= @endDate');
      }

      const whereClause = whereConditions.length > 0
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM BirthCertificates bc
        INNER JOIN Citizens child ON bc.child_citizen_id = child.citizen_id
        ${whereClause}
      `;

      const countResult = await request.query(countQuery);
      const totalCount = countResult.recordset[0].total;

      // Data query
      const dataQuery = `
        SELECT
          bc.birth_cert_id,
          bc.certificate_number,
          bc.registration_date,
          child.citizen_id as child_id,
          child.citizen_code as child_citizen_code,
          child.full_name as child_name,
          child.date_of_birth as child_dob,
          child.gender as child_gender,
          father.full_name as father_name,
          mother.full_name as mother_name,
          bc.birth_place,
          bc.created_at
        FROM BirthCertificates bc
        INNER JOIN Citizens child ON bc.child_citizen_id = child.citizen_id
        LEFT JOIN Citizens father ON bc.father_citizen_id = father.citizen_id
        LEFT JOIN Citizens mother ON bc.mother_citizen_id = mother.citizen_id
        ${whereClause}
        ORDER BY bc.registration_date DESC, bc.created_at DESC
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
      logger.error('Get birth certificates failed:', error);
      throw error;
    }
  }

  /**
   * Lay chi tiet giay khai sinh
   */
  async getBirthCertificateById(certId) {
    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input('certId', sql.Int, certId)
        .query(`
          SELECT
            bc.*,
            child.citizen_id as child_id,
            child.citizen_code as child_citizen_code,
            child.full_name as child_name,
            child.date_of_birth as child_dob,
            child.gender as child_gender,
            child.ethnicity as child_ethnicity,
            child.nationality as child_nationality,
            father.citizen_id as father_id,
            father.citizen_code as father_citizen_code,
            father.full_name as father_name,
            father.date_of_birth as father_dob,
            mother.citizen_id as mother_id,
            mother.citizen_code as mother_citizen_code,
            mother.full_name as mother_name,
            mother.date_of_birth as mother_dob,
            w.ward_name,
            d.district_name,
            p.province_name
          FROM BirthCertificates bc
          INNER JOIN Citizens child ON bc.child_citizen_id = child.citizen_id
          LEFT JOIN Citizens father ON bc.father_citizen_id = father.citizen_id
          LEFT JOIN Citizens mother ON bc.mother_citizen_id = mother.citizen_id
          LEFT JOIN Wards w ON child.ward_id = w.ward_id
          LEFT JOIN Districts d ON w.district_id = d.district_id
          LEFT JOIN Provinces p ON d.province_id = p.province_id
          WHERE bc.birth_cert_id = @certId
        `);

      if (result.recordset.length === 0) {
        throw new Error('Khong tim thay giay khai sinh');
      }

      return result.recordset[0];
    } catch (error) {
      logger.error('Get birth certificate by id failed:', error);
      throw error;
    }
  }

  /**
   * Tim giay khai sinh theo so
   */
  async getBirthCertificateByNumber(certNumber) {
    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input('certNumber', sql.NVarChar, certNumber)
        .query(`
          SELECT bc.birth_cert_id
          FROM BirthCertificates bc
          WHERE bc.certificate_number = @certNumber
        `);

      if (result.recordset.length === 0) {
        throw new Error('Khong tim thay giay khai sinh');
      }

      return await this.getBirthCertificateById(result.recordset[0].birth_cert_id);
    } catch (error) {
      logger.error('Get birth certificate by number failed:', error);
      throw error;
    }
  }

  /**
   * Tao giay khai sinh
   */
  async createBirthCertificate(certData, createdBy) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // Kiem tra tre da co giay khai sinh chua
      const existingCert = await transaction
        .request()
        .input('childId', sql.Int, certData.child_citizen_id)
        .query('SELECT birth_cert_id FROM BirthCertificates WHERE child_citizen_id = @childId');

      if (existingCert.recordset.length > 0) {
        throw new Error('Tre nay da co giay khai sinh');
      }

      // Kiem tra tre co ton tai va hop le khong
      const childCheck = await transaction
        .request()
        .input('childId', sql.Int, certData.child_citizen_id)
        .query(`
          SELECT
            citizen_id,
            full_name,
            date_of_birth,
            DATEDIFF(DAY, date_of_birth, GETDATE()) as days_old,
            status,
            ward_id
          FROM Citizens
          WHERE citizen_id = @childId AND is_active = 1
        `);

      if (childCheck.recordset.length === 0) {
        throw new Error('Tre khong ton tai trong he thong');
      }

      const child = childCheck.recordset[0];

      if (child.status !== 'Active') {
        throw new Error('Tre phai o trang thai Active');
      }

      // Kiem tra thoi gian khai sinh (phai trong vong 60 ngay)
      if (child.days_old > 60) {
        throw new Error('Qua thoi han khai sinh (60 ngay ke tu ngay sinh)');
      }

      // Kiem tra cha/me (it nhat 1 nguoi)
      if (!certData.father_citizen_id && !certData.mother_citizen_id) {
        throw new Error('Phai co it nhat cha hoac me');
      }

      // Kiem tra cha (neu co)
      if (certData.father_citizen_id) {
        const fatherCheck = await transaction
          .request()
          .input('fatherId', sql.Int, certData.father_citizen_id)
          .query(`
            SELECT citizen_id, gender, status
            FROM Citizens
            WHERE citizen_id = @fatherId AND is_active = 1
          `);

        if (fatherCheck.recordset.length === 0) {
          throw new Error('Cha khong ton tai');
        }

        if (fatherCheck.recordset[0].gender !== 'Male') {
          throw new Error('Cha phai la gioi tinh nam');
        }

        if (fatherCheck.recordset[0].status === 'Deceased') {
          throw new Error('Cha da mat');
        }
      }

      // Kiem tra me (neu co)
      if (certData.mother_citizen_id) {
        const motherCheck = await transaction
          .request()
          .input('motherId', sql.Int, certData.mother_citizen_id)
          .query(`
            SELECT citizen_id, gender, status
            FROM Citizens
            WHERE citizen_id = @motherId AND is_active = 1
          `);

        if (motherCheck.recordset.length === 0) {
          throw new Error('Me khong ton tai');
        }

        if (motherCheck.recordset[0].gender !== 'Female') {
          throw new Error('Me phai la gioi tinh nu');
        }

        if (motherCheck.recordset[0].status === 'Deceased') {
          throw new Error('Me da mat');
        }
      }

      // Tao so giay khai sinh tu dong
      const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
      const countResult = await transaction
        .request()
        .query(`
          SELECT COUNT(*) as count
          FROM BirthCertificates
          WHERE YEAR(registration_date) = YEAR(GETDATE())
            AND MONTH(registration_date) = MONTH(GETDATE())
        `);

      const certNumber = `KS-${yearMonth}-${String(countResult.recordset[0].count + 1).padStart(5, '0')}`;

      // Tao giay khai sinh
      const insertResult = await transaction
        .request()
        .input('certificate_number', sql.NVarChar, certNumber)
        .input('child_citizen_id', sql.Int, certData.child_citizen_id)
        .input('father_citizen_id', sql.Int, certData.father_citizen_id || null)
        .input('mother_citizen_id', sql.Int, certData.mother_citizen_id || null)
        .input('birth_place', sql.NVarChar, certData.birth_place || null)
        .input('registrar_name', sql.NVarChar, certData.registrar_name || null)
        .input('notes', sql.NVarChar, certData.notes || null)
        .input('created_by', sql.Int, createdBy)
        .query(`
          INSERT INTO BirthCertificates (
            certificate_number, child_citizen_id, father_citizen_id, mother_citizen_id,
            birth_place, registrar_name, notes, created_by
          )
          OUTPUT INSERTED.birth_cert_id
          VALUES (
            @certificate_number, @child_citizen_id, @father_citizen_id, @mother_citizen_id,
            @birth_place, @registrar_name, @notes, @created_by
          )
        `);

      const certId = insertResult.recordset[0].birth_cert_id;

      // Neu co cha/me, them tre vao ho khau cua ho (neu chua co)
      if (certData.father_citizen_id || certData.mother_citizen_id) {
        const parentId = certData.father_citizen_id || certData.mother_citizen_id;

        // Tim ho khau cua cha/me
        const householdCheck = await transaction
          .request()
          .input('parentId', sql.Int, parentId)
          .query(`
            SELECT hm.household_id
            FROM HouseholdMembers hm
            WHERE hm.citizen_id = @parentId AND hm.is_current_member = 1
          `);

        if (householdCheck.recordset.length > 0) {
          const householdId = householdCheck.recordset[0].household_id;

          // Kiem tra tre da co trong ho khau chua
          const childInHousehold = await transaction
            .request()
            .input('householdId', sql.Int, householdId)
            .input('childId', sql.Int, certData.child_citizen_id)
            .query(`
              SELECT member_id
              FROM HouseholdMembers
              WHERE household_id = @householdId AND citizen_id = @childId
            `);

          // Neu chua co thi them vao
          if (childInHousehold.recordset.length === 0) {
            await transaction
              .request()
              .input('householdId', sql.Int, householdId)
              .input('childId', sql.Int, certData.child_citizen_id)
              .query(`
                INSERT INTO HouseholdMembers (household_id, citizen_id, relationship_to_head)
                VALUES (@householdId, @childId, 'Con')
              `);
          }
        }
      }

      await transaction.commit();
      logger.info(`Birth certificate created: ${certId} by user ${createdBy}`);

      return await this.getBirthCertificateById(certId);
    } catch (error) {
      await transaction.rollback();
      logger.error('Create birth certificate failed:', error);
      throw error;
    }
  }

  /**
   * Cap nhat giay khai sinh
   */
  async updateBirthCertificate(certId, certData) {
    try {
      const pool = await getConnection();

      // Kiem tra giay khai sinh co ton tai khong
      const cert = await this.getBirthCertificateById(certId);
      if (!cert) {
        throw new Error('Khong tim thay giay khai sinh');
      }

      const request = pool.request();
      request.input('certId', sql.Int, certId);

      let updateFields = [];

      if (certData.birth_place !== undefined) {
        request.input('birth_place', sql.NVarChar, certData.birth_place);
        updateFields.push('birth_place = @birth_place');
      }
      if (certData.registrar_name !== undefined) {
        request.input('registrar_name', sql.NVarChar, certData.registrar_name);
        updateFields.push('registrar_name = @registrar_name');
      }
      if (certData.notes !== undefined) {
        request.input('notes', sql.NVarChar, certData.notes);
        updateFields.push('notes = @notes');
      }

      if (updateFields.length === 0) {
        return await this.getBirthCertificateById(certId);
      }

      updateFields.push('updated_at = GETDATE()');

      const updateQuery = `
        UPDATE BirthCertificates
        SET ${updateFields.join(', ')}
        WHERE birth_cert_id = @certId
      `;

      await request.query(updateQuery);
      logger.info(`Birth certificate updated: ${certId}`);

      return await this.getBirthCertificateById(certId);
    } catch (error) {
      logger.error('Update birth certificate failed:', error);
      throw error;
    }
  }

  /**
   * Xoa giay khai sinh (chi Admin)
   */
  async deleteBirthCertificate(certId) {
    try {
      const pool = await getConnection();

      // Kiem tra giay khai sinh co ton tai khong
      const cert = await this.getBirthCertificateById(certId);
      if (!cert) {
        throw new Error('Khong tim thay giay khai sinh');
      }

      // Xoa giay khai sinh
      await pool
        .request()
        .input('certId', sql.Int, certId)
        .query('DELETE FROM BirthCertificates WHERE birth_cert_id = @certId');

      logger.info(`Birth certificate deleted: ${certId}`);
    } catch (error) {
      logger.error('Delete birth certificate failed:', error);
      throw error;
    }
  }

  /**
   * Thong ke khai sinh theo thang/nam
   */
  async getStatsByPeriod(year, month = null, wardId = null) {
    try {
      const pool = await getConnection();
      const request = pool.request();

      request.input('year', sql.Int, year);

      let whereConditions = ['YEAR(bc.registration_date) = @year'];

      if (month) {
        request.input('month', sql.Int, month);
        whereConditions.push('MONTH(bc.registration_date) = @month');
      }

      if (wardId) {
        request.input('wardId', sql.Int, wardId);
        whereConditions.push('child.ward_id = @wardId');
      }

      const whereClause = 'WHERE ' + whereConditions.join(' AND ');

      const query = `
        SELECT
          COUNT(*) as total_births,
          SUM(CASE WHEN child.gender = 'Male' THEN 1 ELSE 0 END) as male_count,
          SUM(CASE WHEN child.gender = 'Female' THEN 1 ELSE 0 END) as female_count,
          MONTH(bc.registration_date) as month
        FROM BirthCertificates bc
        INNER JOIN Citizens child ON bc.child_citizen_id = child.citizen_id
        ${whereClause}
        GROUP BY MONTH(bc.registration_date)
        ORDER BY MONTH(bc.registration_date)
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      logger.error('Get birth stats failed:', error);
      throw error;
    }
  }
}

module.exports = new BirthCertificateService();