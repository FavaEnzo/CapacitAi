import { Router } from "express";
import passport from "passport";
import { registrar } from "../controllers/UserController.js";

const router = Router();

router.post("/register", registrar);

// ROTA DE LOGIN COM LOG DE ERRO DETALHADO
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // Se houver erro técnico (banco fora do ar, erro de código, etc)
        if (err) {
            console.error("🔴 ERRO CRÍTICO NO LOGIN:", err); // ISSO VAI APARECER NO TERMINAL
            return res.status(500).json({ message: "Erro interno no servidor: " + err.message });
        }
        
        // Se o usuário não for encontrado ou senha errada
        if (!user) {
            console.warn("⚠️ Falha de Login:", info ? info.message : "Motivo desconhecido");
            return res.status(401).json({ message: info.message || "Credenciais inválidas." });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("🔴 ERRO AO SALVAR SESSÃO:", err);
                return res.status(500).json({ message: "Erro ao criar sessão." });
            }
            
            console.log("✅ Login Sucesso:", user.email);
            return res.json({ 
                message: "Login realizado!", 
                user: { 
                    id: user.id,
                    nome: user.nome, 
                    email: user.email 
                } 
            });
        });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Erro ao terminar sessão." });
        
        req.session.destroy(); 
        res.clearCookie("connect.sid"); 
        
        return res.json({ message: "Sessão terminada com sucesso." });
    });
});

// Verifica se está logado
router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

export default router;