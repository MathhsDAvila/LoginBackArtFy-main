// src/controllers/admin/adminController.js
export const getDashboardStats = async (req, res) => {
    try {
        res.json({
            message: "Painel administrativo acessado com sucesso",
            user: req.userId
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};