const mysql = require('mysql2');
const dotenv = require('dotenv');
const collegePredictorModer = require('../models/collegePredictorModer');

dotenv.config();

const pool=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    
}).promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

const tables=['All','DeemedUniversity','AndhraPradesh','Bihar','Chattisgarh','Haryana','Jharkhand','Karnataka','Kerala','MP','Odisha','Pondicherry','Rajasthan_Boys','Rajasthan_Girls','UP','Uttarakhand','WB']

const fetchDatabaseMarks=async(req,res,next)=> {

    const {marks,category,roundMark,amount} = req.body;
    console.log('Connected');

    var query='';
    if(category=='All'){
        var result={};
        for(let i=1;i<tables.length;i++){
                    query = `
            SELECT COUNT(*) AS total_count
            FROM \`${tables[i]}\`
            WHERE \`${roundMark}\` <= ${marks} 
            AND \`${roundMark}\` != 0
            AND CAST(REPLACE(TutionFees, ',', '') AS UNSIGNED) <= ${amount};
            `;
                try {
                    const [rows] = await pool.query(query);
                    result[tables[i]]=rows[0]['total_count'];
                } catch (err) {
                    console.error('Error querying the database:', err);
                } 
        }
        res.json(result);
    }else{
        query = `
  SELECT * FROM ${category} 
  WHERE \`${roundMark}\` <= ${marks} 
    AND \`${roundMark}\` != 0
    AND CAST(REPLACE(TutionFees, ',', '') AS UNSIGNED) <= ${amount}
ORDER BY \`${roundMark}\` DESC
`;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Error querying the database:', err);
    }
}


    
}

const fetchDatabaseRanks=async(req,res,next)=> {

    const {rank,category,roundRank,amount} = req.body;
  

    var query='';
    if(category=='All'){
        
        var result={};
        for(let i=1;i<tables.length;i++){
                    query = `
            SELECT COUNT(*) AS total_count
            FROM \`${tables[i]}\`
            WHERE \`${roundRank}\` >= ${rank} 
            AND \`${roundRank}\` != 0
            AND CAST(REPLACE(TutionFees, ',', '') AS UNSIGNED) <= ${amount};
            `;
                try {
                    const [rows] = await pool.query(query);
                    result[tables[i]]=rows[0]['total_count'];
                } catch (err) {
                    console.error('Error querying the database:', err);
                } 
        }
        res.json(result);
    }else{
        query = `
  SELECT * FROM ${category} 
  WHERE \`${roundRank}\` >= ${rank} 
    AND \`${roundRank}\` != 0
    AND CAST(REPLACE(TutionFees, ',', '') AS UNSIGNED) <= ${amount}
ORDER BY \`${roundRank}\` DESC
`;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Error querying the database:', err);
    }
}


    
}


const collegePredictorSendData = async (req, res) => {
    const {name,email,phone,marks} = req.body;
    try {
        const request =await collegePredictorModer.create({
                    name,email,phone,marks})
        
        res.status(201).json({
            success: true,
            message: 'Consultation request created successfully',
            data:request
        });
    } catch (error) {
        console.error('Error creating consultation request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating consultation request',
            error: error.message
        });
    }
}

module.exports={fetchDatabaseMarks,fetchDatabaseRanks,collegePredictorSendData}