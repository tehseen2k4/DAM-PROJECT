import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: 'localhost',
  database: process.env.DB_DATABASE || 'HostelDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    instanceName: 'SQLEXPRESS',
    connectTimeout: 30000,
  },
  port: 1433, // Default SQL Server port
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export const getDbConnection = async () => {
  if (poolPromise) return poolPromise;

  poolPromise = sql.connect(config)
    .then(pool => {
      console.log('✅ Connected to SQL Server');
      return pool;
    })
    .catch(err => {
      poolPromise = null;
      console.error('❌ Database Connection Failed!', err);
      throw err;
    });

  return poolPromise;
};
