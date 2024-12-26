require('dotenv').config(); 
const app = require('./src/index'); 

const PORT = process.env.PORT || 3001; 

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
