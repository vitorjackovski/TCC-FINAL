const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ✅ Registrar Usuário (Apenas admin)
const registrar = async (req, res) => {
    const { nome, email, senha, role } = req.body;
    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const novoUsuario = await db.query(
            'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, role',
            [nome, email, hashSenha, role]
        );
        res.status(201).json(novoUsuario.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao registrar usuário', detalhe: error.message });
    }
};

// ✅ Login
const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = resultado.rows[0];

        if (!usuario) return res.status(401).json({ mensagem: 'Email ou senha inválidos' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ mensagem: 'Email ou senha inválidos' });

        const token = jwt.sign(
            { id: usuario.id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no login', detalhe: error.message });
    }
};

// ✅ Listar todos usuários (Admin)
const listar = async (req, res) => {
    try {
        const resultado = await db.query('SELECT id, nome, email, role FROM usuarios');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar usuários', detalhe: error.message });
    }
};

// ✅ Buscar usuário por ID
const buscarPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT id, nome, email, role FROM usuarios WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
    }
};

// ✅ Atualizar usuário (Admin)
const atualizar = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;
    try {
        let hashSenha;
        if (senha) {
            hashSenha = await bcrypt.hash(senha, 10);
        }

        const query = `
            UPDATE usuarios SET
                nome = COALESCE($1, nome),
                email = COALESCE($2, email),
                senha = COALESCE($3, senha),
                role = COALESCE($4, role)
            WHERE id = $5
            RETURNING id, nome, email, role
        `;

        const values = [
            nome || null,
            email || null,
            senha ? hashSenha : null,
            role || null,
            id
        ];

        const resultado = await db.query(query, values);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso', usuario: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
    }
};

// ✅ Deletar usuário (Admin)
const deletar = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar usuário', detalhe: error.message });
    }
};

module.exports = { registrar, login, listar, buscarPorId, atualizar, deletar };
