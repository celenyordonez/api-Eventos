import express from "express";
 
import palestrantesRoutes from "./routes/palestrantesRoutes";
import eventosRoutes from "./routes/eventosRoutes";
 import relacao from "./routes/relacao"
const app = express();
 
app.use(express.json());
 
app.use("/palestrantes", palestrantesRoutes);
app.use("/eventos", eventosRoutes);
app.use("/relacao", relacao)
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});