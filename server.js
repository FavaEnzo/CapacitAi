import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import pgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pg from "pg"; 
import sequelize from "./api/config/database.js";
import User from "./api/models/User.js";
import userRoutes from "./api/routes/UserRoutes.js";

dotenv.config();

const app = express();
const PgSession = pgSimple(session);

// --- Configuração do CORS ---
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://capacitai.vercel.app' ], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuração da Sessão no Banco ---
const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
});

app.use(session({
    store: new PgSession({
        pool: pgPool,
        tableName: 'session', 
        createTableIfMissing: true 
    }),
    secret: process.env.SESSION_SECRET || 'segredo_padrao_dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
        httpOnly: true, 
        secure: false, // Em localhost é false
        sameSite: 'lax' 
    }
}));

// --- Configuração do Passport (Login) ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, 
  async (email, senha, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return done(null, false, { message: 'Email não cadastrado.' });

      const match = await bcrypt.compare(senha, user.senha);
      if (!match) return done(null, false, { message: 'Senha incorreta.' });

      return done(null, user); 
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --- Rotas ---
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API CapacitaAí Rodando e Recriando Tabelas!");
});

const PORT = process.env.PORT || 3000;

// --- A MÁGICA ACONTECE AQUI ---
// O force: true apaga a tabela velha e cria a nova com a coluna Email
sequelize.sync({ force: true }) 
    .then(() => {
        console.log("⚠️ TABELA RECIADA! (O force: true está ativo)");
        console.log("✅ Banco Sincronizado!");
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })

    .catch(err => console.error("❌ Erro ao conectar ao banco:", err));
