import express, { json } from 'express'

import sql from 'mssql'


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('port',3050);

app.listen(app.get('port'),()=>{console.log(`server ready ${app.get('port')}`)});



const sqlConfig = {
  user: "timoteo",
  password: "12345",
  database: "tp1",
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};
//CONEXION
async function getConnection(){
  try{
  const pool = await sql.connect(sqlConfig);
  // const result = await sql.query(`SELECT * FROM ISMST_PERSONAS`);
  // console.log(result);
    return pool;
  } catch(err){
      console.log(err);
  }
};

//QUERYS
const queries = {
  getAllProductos :"select * from ismst_producto",
  getPersonasById : "select * from ismst_producto where COD_PRODUCTO = @ID",
  postProducto: "insert into ISMST_PRODUCTO (COD_PRODUCTO,TIPO_PRODUCTO,DESCRIPCION,JOB_ID,COD_UNIDAD_MEDIDA) values ( @COD_PRODUCTO,@TIPO_PRODUCTO,@DESCRIPCION,@JOB_ID,@COD_UNIDAD_MEDIDA)",
  deleteById: "delete from ISMST_PRODUCTO where COD_PRODUCTO = @idelete"
};

//AAAAAAAACCION
app.set('view engine','ejs');
const getProductos = async(req,res)=>{
  const pool = await getConnection();
  const result = await pool
                      .request()
                      .query(queries.getAllProductos);
    
  res.render('index', {
                        
                        record: result.recordset 
                        
                         }); 
  
  // console.log(result.recordset[1]);                   
}

const postProductos = async (req,res)=>{

  const {COD_PRODUCTO,TIPO_PRODUCTO,DESCRIPCION,JOB_ID,COD_UNIDAD_MEDIDA} = req.body;
  console.log(COD_PRODUCTO,TIPO_PRODUCTO,DESCRIPCION,JOB_ID,COD_UNIDAD_MEDIDA);
  

  //NO VALIDO DATOS PQ SON MUCHOS PERO HASTA ACA  COMPILA TODO
  const pool = await getConnection();
  await pool 
        .request()
        .input("COD_PRODUCTO",sql.Char,COD_PRODUCTO)
        .input("TIPO_PRODUCTO",sql.Char,TIPO_PRODUCTO)
        .input("DESCRIPCION",sql.Char,DESCRIPCION)
        .input("JOB_ID",sql.Numeric,JOB_ID)
        .input("COD_UNIDAD_MEDIDA",sql.Char,COD_UNIDAD_MEDIDA)
        .query(queries.postProducto);
 
             
  res.json('nuevo post');
                      
}


const getId = async (req,res)=>{

  const {ID} = req.body;
  console.log(ID);
  

  //NO VALIDO DATOS PQ SON MUCHOS PERO HASTA ACA  COMPILA TODO
  const pool = await getConnection();
  const result = await pool 
                  .request()
                  .input("ID",sql.Char,ID)
                  .query(queries.getPersonasById);
    
             
  res.json(result.recordset);
                      
}


const getIdelete = async (req,res)=>{

  const {Idelete} = req.body;
  console.log(Idelete);
  

  //NO VALIDO DATOS PQ SON MUCHOS PERO HASTA ACA  COMPILA TODO
   const pool = await getConnection();
   const result = await pool 
                   .request()
                   .input("Idelete",sql.Char,Idelete)
                   .query(queries.deleteById);
    
             
  res.json("Borrado");
                      
}





//RUTA
app.get('/consultaGet',getProductos);

app.post('/consultaPost',postProductos);

app.get('/consultaId',getId);

app.delete('/consultaBorrar',getIdelete);



// getConnection();