const ADMINS_LOCAL_KEY = 'fla_quixada_admins';

const adminPadrao = [
    {
        id: '1',
        nome: 'Higor Silva',
        email: 'higor@flaquixada.com.br',
        senha: 'admin'
    }
];

export function obterAdminsLocal() {
    const dados = localStorage.getItem(ADMINS_LOCAL_KEY);
    if (!dados) {
        salvarAdminsLocal(adminPadrao);
        return [...adminPadrao];
    }
    try {
        return JSON.parse(dados);
    } catch (e) {
        console.error("Erro ao fazer parse dos admins", e);
        return [...adminPadrao];
    }
}

export function salvarAdminsLocal(admins) {
    localStorage.setItem(ADMINS_LOCAL_KEY, JSON.stringify(admins));
}
