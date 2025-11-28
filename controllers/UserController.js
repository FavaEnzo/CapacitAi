import User from "../models/User.js";

export const registrar = async (req, res) => {
    try {
        const { nome, sobrenome, idade, email, senha } = req.body;


        if (idade < 14 || idade > 24) {
            return res.status(400).json({ message: "Você não está na faixa etária de jovem aprendiz!" });
        }

        const userExiste = await User.findOne({ where: { email } });
        if (userExiste) {
            return res.status(400).json({ message: "Este email já está registrado." });
        }

        const novoUser = await User.create({
            nome,
            sobrenome,
            idade,
            email,
            senha
        });

        res.status(201).json({
            message: "Usuário criado com sucesso! Faça login.",
            user: { id: novoUser.id, email: novoUser.email }
        });

    } catch (error) {
        console.error("Erro ao registrar:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};