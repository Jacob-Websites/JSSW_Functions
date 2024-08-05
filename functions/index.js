const express=require('express');
const app=express();
const mysql=require('mysql');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const port=5000;



const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'btzothksikyd0tv6zljh-mysql.services.clever-cloud.com',
    user: 'ub4bzrramjnmzuys',
    password: 'jRKyeDjwQ7E5WNNLWpwU',
    database: 'btzothksikyd0tv6zljh',
    connectTimeout: 10000,
    acquireTimeout: 10000,
  });
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting database connection: ', err);
  
    } else {
      console.log("DB Connected")
    }
  })

  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: "Welcome to JSSW MINISTRIES"
    })
  
  })
  app.use(express.json());
  
  app.post('/api/addorganization', (req, res) => {
    const data = req.body;
    pool.query(
      'INSERT INTO Organization (id,name,address,phone_number,email,image,isdeleted) VALUES (uuid(),?, ?, ?, ?, ?, 0)',
      [
        data.name,
        data.address,
        data.phonenumber,
        data.email,
        data.image
      ],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting new record: ' + error.stack);
          res.status(500).json({ message: 'Error inserting new record' });
          return;
        }
        console.log('New record inserted with ID:', results.insertId);
        res.status(200).json({ message: 'Registered Successfully' });
      }
    );
  
  });
  app.put('/api/updateOrganization', (req, res) => {
    const data = req.body;
    pool.query(
      `update Organization set name=?, address=?, phonenumber=?,email=? where id=?`,
      [
        data.name,
        data.address,
        data.phonenumber,
        data.email,
        data.image,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting new record: ' + error.stack);
          res.status(500).json({ message: 'Error inserting new record' });
          return;
        }
        console.log('New record inserted with ID:', results.insertId);
        res.status(200).json({ message: 'Updated Successfully' });
      }
    );
  
  });
  
  app.delete('/api/deleteOrganization',(req,res)=>{
    const data=req.body.id
    pool.query(`update Organization set isdeleted=1 where id=?`,[data],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Organization deleted Successfully'
        })
      }
    })
  })
  
  
  
  
  app.get('/api/Organization', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,address,phone_number as PhoneNumber,email,image FROM Organization where isdeleted=0 LIMIT ? OFFSET ? `;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Organization where isdeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Organization Count");
        return res.json({
          status: 403,
          error: "Error Fetching Records"
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    });
  });
  
  app.get('/api/getbyIdOrganization/:id', (req, res) => {
    const data = req.params.id;
    const sqlQuery = 'SELECT id, name, Address, Phone_number as PhoneNumber, email, image FROM Organization WHERE id = ?';
  
    pool.query(sqlQuery, [data], (err, results) => {
      if (err) {
        res.status(500).json({
          error: err
        });
      } else {
        res.json({
          status: 200,
          data: results
        });
      }
    });
  });
  
  app.post('/api/addAbout', (req, res) => {
    const data = req.body;
    pool.query(`insert into About (id,title,description,OrgId,IsDeleted) values (uuid(), ?, ? , ?,0)`, [
      data.title,
      data.description,
      data.orgId,
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.put('/api/updateAbout',(req,res)=>{
    const data=req.body;
    pool.query(`update About set title=?, description=? where id=?`,[data.title, data.description, data.id],(err,res)=>{
      if(err){
        console.error("Error updating data",err)
      }else{
        res.json({
          status:200,
          message:res
        })
      }
    })
  })
  
  app.delete('/api/deleteAbout',(req,res)=>{
    const data=req.body.id;
    pool.query(`update About set IsDeleted=1 where id=${data}`,(err,res)=>{
      if(err){
        console.error("Error Inserting record",err)
      }else{
        res.json({
          status:200,
          message:'About Data Deleted Successfully'
        })
      }
    })
  })
  
  app.get('/api/about', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,title,description,OrgId as OrganizationId FROM About where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM About where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching About Count");
        return res.json({
          status: 403,
          error: "Error Fetching Records"
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/addContact', (req, res) => {
    const data = req.body;
    pool.query(`insert into Contact (id,name,email,message,OrgId,IsDeleted) values (uuid(), ?, ?, ? , ?,0)`, [
      data.name,
      data.email,
      data.message,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  })
  
  
  app.get('/api/getContact', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,email,message,OrgId as OrganizationId FROM Contact where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Contact where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Contact Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/addFounders', (req, res) => {
    const data = req.body;
    pool.query(`insert into Founders (id,name,Designation,Image,OrgId,IsDeleted) values (uuid(), ?, ?, ? , ?,0)`, [
      data.name,
      data.email,
      data.message,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.put('/api/updateFounders',(req,res)=>{
    const data=req.body;
    pool.query(`update Founders set name=?, Designation=? where id=?`,[data.name, data.designation, data.id],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:res
        })
      }
    })
  })
  
  app.delete('/api/deleteFounders',(req,res)=>{
    const data = req.body.id;
    pool.query(`update Founders set IsDeleted=1 where id=${data}`,(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Deleted SuccessFully'
        })
      }
    })
  })
  
  app.get('/api/getFounders', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,Designation,Image,OrgId as OrganizationId FROM Founders where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Founders where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Founders Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/addMission', (req, res) => {
    const data = req.body;
    pool.query(`insert into Missions (id,title,description,OrgId,IsDeleted) values (uuid(), ?, ? , ?,0)`, [
      data.title,
      data.email,
      data.description,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.put('/api/updateMission',(req,res)=>{
    const data= req.body;
    pool.query(`update Missions set title=?, description=? where id=?`,[data.title, data.description,data.id ],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Mission Updated Successfully'
        })
      }
    })
  })
  
  app.delete('/api/deleteMission',(req,res)=>{
    const data= req.body.id;
    pool.query(`update Missions set IsDeleted=1 where id=?`,[data],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Mission Deleted Successfully'
        })
      }
    })
  })
  
  app.get('/api/getMission', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,title,description,OrgId as OrganizationId FROM Missions where IsDeleted=0  LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Missions where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Mission Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/addMissionImages', (req, res) => {
    const data = req.body;
    pool.query(`insert into MissionImages (id,name,images,missionid,OrgId,IsDeleted) values (uuid(), ?, ? ,?, ?,0)`, [
      data.name,
      data.images,
      data.missionid,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.get('/api/getMissionImages', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,images,missionid,OrgId as OrganizationId FROM MissionImages where IsDeleted=0 where LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM MissionImages where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching MissionImages Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  app.delete('/api/deleteMissionImage',(req,res)=>{
    const data = req.body.id;
    pool.query(`update MissionImages set IsDeleted=1 where id=?`,[data],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Images Deleted Successfully'
        })
      }
    })
  })
  app.post('/api/addProject', (req, res) => {
    const data = req.body;
    pool.query(`insert into projects (id,name,description,bibleverse,OrgId,IsDeleted) values (uuid(), ?, ?,?, ?,0)`, [
      data.title,
      data.email,
      data.description,
      data.bibleverse,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.put('/api/updateProject',(req,res)=>{
    const data = req.body;
    pool.query(`update projects set name = ?, description=?, bibleverse=? where id=?`,[data.name,
      data.description, data.bibleverse,data.id],(err,res)=>{
        if(err){
          console.error(err)
        }else{
          res.json({
            status:200,
            message:'Project Details Updated Successfully'
          })
        }
      })
  });
  
  app.delete('/api/deleteProject',(req,res)=>{
    const data = req.body.id;
    pool.query(`delete projects set IsDeleted=1 where id=?`,[data],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Project Deleted Successfully'
        })
      }
    })
  })
  
  app.get('/api/getProjects', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,description,bibleverse,orgId as OrganizationId FROM projects where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM projects where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching projects Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  app.post('/api/addSocialEvents', (req, res) => {
    const data = req.body;
    pool.query(`insert into SocialEvents (id,name,description,image,OrgId,IsDeleted) values (uuid(), ?, ?,?, ?,0)`, [
      data.name,
      data.description,
      data.image,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  app.delete('/api/deleteSocialEvents',(req,res)=>{
    const data = req.body.id
    pool.query(`update SocialEvents set IsDeleted=1 where id=?`,[data],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Social Events Deleted Successfully'
        })
      }
    })
  })
  
  app.get('/api/getSocialEvents', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,description,image,OrgId as OrganizationId FROM SocialEvents where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM SocialEvents where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching SocialEvents Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  app.post('/api/addUsers', (req, res) => {
    const data = req.body;
    pool.query(`insert into Users (id,username,password,OrgId,IsDeleted) values (uuid(), ?,?, ?,0)`, [
      data.username,
      data.password,
      data.orgId
    ], (err, results, fields) => {
      if (err) {
        console.error('Error inserting new record: ' + err.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Registered Successfully' });
    })
  });
  
  app.put('/api/updateusers',(req,res)=>{
    const data = req.body;
    pool.query(`update Users set username = ?, password = ? where id=?`,[data.username, data.password, data.id],(err,results)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Users Updated Successfully'
        })
      }
    })
  });
  
  app.delete('/api/deleteUsers',(req,res)=>{
    const data = req.body.id;
    pool.query(`update Users set IsDeleted=1 where id=?`,[data],(err,results)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Users Deleted Successfully'
        })
      }
    })
  })
  app.get('/api/getUsers', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,username,password,OrgId as OrganizationId FROM Users where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Users where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Users Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/Addadminusers',(req,res)=>{
    const data=req.body;
    pool.query(`insert into AdministrationUsers (id, name, username, password,IsDeleted) values (uuid(), ?, ?,?,0)`,[data.name,
      data.username, data.password],(err,results)=>{
        if(err){
          res.status(403).json({
            error:err
          })
        }else{
          res.json({
            status:200,
            data:'Admin User Registered Successfully'
          })
        }
      })
  });
  
  app.get('/api/getAdminUsers',(req,res)=>{
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,username,password FROM AdministrationUsers where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM AdministrationUsers where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Admin Users Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  
  app.post('/api/addRoutes',(req,res)=>{
    const data=req.body;
    pool.query(`insert into Routes (id,name,link,OrgId,IsDeleted) values (uuid(),?,?,?,0)`,[data.name,data.link,data.orgId],(err,results)=>{
      if(err){
        console.log(err)
        res.status(500).json({
          message:err
        })
      }else{
        res.status(200).json({
          data:"Route added Successfully"
        })
      }
    })
  });
  
  app.get('/api/GetRoutes',(req,res)=>{
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
  
    const offset = (currentPage - 1) * pageSize;
  
    const query = `SELECT id,name,link,OrgId FROM Routes where IsDeleted=0 LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) AS total FROM Routes where IsDeleted=0`;
  
    pool.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error Fetching Admin Users Count");
        return res.json({
          status: 403,
          error: err
        });
      } else {
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        pool.query(query, [pageSize, offset], (err, result) => {
          if (err) {
            return res.json({
              status: 403,
              error: err
            });
          } else {
            res.json({
              status: 200,
              data: {
                result,
                totalRecords,
                totalPages,
                currentPage: currentPage,
                pageSize
              },
  
            });
          }
        });
      }
    })
  });
  



app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });