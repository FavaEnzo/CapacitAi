import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import pgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pg from "pg"; 
import sequelize from "./config/database.js";
import User from "./models/User.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();

const app = express();
const PgSession = pgSimple(session);

// VOLTEI A SUA LISTA ESPECÍFICA AQUI
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://capacitai.onrender.com'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'senha',
    passReqToCallback: true
  }, 
  async (req, email, senha, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return done(null, false, { message: 'Email não cadastrado.' });
      
      if (req.body.nome && user.nome) {
          if (req.body.nome.trim().toLowerCase() !== user.nome.trim().toLowerCase()) {
              return done(null, false, { message: 'Nome não confere.' });
          }
      }

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

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API CapacitaAí Online");
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => console.error(err));