'use server';

import { getDbConnection } from '@/lib/db';

export async function registerStudent(
  username: string,
  passwordHash: string,
  fullName: string,
  email: string,
  gender: string,
  university: string,
  age: number
) {
  try {
    const pool = await getDbConnection();

    // Check if user already exists
    const checkUser = await pool.request()
      .input('username', username)
      .query('SELECT UserID FROM UserAccounts WHERE Username = @username');

    if (checkUser.recordset.length > 0) {
      return { success: false, error: 'Username is already taken.' };
    }

    // Begin transaction to create student first, then link to user account
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // 1. Insert Student profile
      const studentRes = await transaction.request()
        .input('fullName', fullName)
        .input('email', email)
        .input('gender', gender)
        .input('university', university)
        .input('age', age)
        .query(`
          INSERT INTO Students (FullName, Email, Gender, University, Age)
          VALUES (@fullName, @email, @gender, @university, @age);
          SELECT SCOPE_IDENTITY() as StudentID;
        `);

      const studentId = studentRes.recordset[0].StudentID;

      // 2. Insert User account
      await transaction.request()
        .input('username', username)
        .input('passwordHash', passwordHash)
        .input('studentId', studentId)
        .query(`
          INSERT INTO UserAccounts (Username, PasswordHash, Role, StudentID)
          VALUES (@username, @passwordHash, 'Student', @studentId)
        `);

      await transaction.commit();
      return { success: true };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    return { success: false, error: error.message || 'Failed to register student.' };
  }
}

export async function registerOwner(
  username: string,
  passwordHash: string,
  businessName: string,
  contactPerson: string,
  email: string
) {
  try {
    const pool = await getDbConnection();

    // Check if user already exists
    const checkUser = await pool.request()
      .input('username', username)
      .query('SELECT UserID FROM UserAccounts WHERE Username = @username');

    if (checkUser.recordset.length > 0) {
      return { success: false, error: 'Username is already taken.' };
    }

    // Begin transaction to create owner first, then link to user account
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // 1. Insert Owner profile
      const ownerRes = await transaction.request()
        .input('businessName', businessName)
        .input('contactPerson', contactPerson)
        .input('email', email)
        .query(`
          INSERT INTO Owners (BusinessName, ContactPerson, Email)
          VALUES (@businessName, @contactPerson, @email);
          SELECT SCOPE_IDENTITY() as OwnerID;
        `);

      const ownerId = ownerRes.recordset[0].OwnerID;

      // 2. Insert User account
      await transaction.request()
        .input('username', username)
        .input('passwordHash', passwordHash)
        .input('ownerId', ownerId)
        .query(`
          INSERT INTO UserAccounts (Username, PasswordHash, Role, OwnerID)
          VALUES (@username, @passwordHash, 'Owner', @ownerId)
        `);

      await transaction.commit();
      return { success: true };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    return { success: false, error: error.message || 'Failed to register owner.' };
  }
}
