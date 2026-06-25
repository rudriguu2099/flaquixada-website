# Consulado Fla-Quixadá — Website

Site oficial do **Consulado Fla-Quixadá**, a torcida organizada do Flamengo em Quixadá/CE. A plataforma centraliza informações e funcionalidades para os membros do consulado: calendário de jogos ao vivo, bolão de palpites, cardápio do bar, loja de produtos e notícias — além de um painel administrativo para gestão do conteúdo.

---

## Visite o site em: https://flaquixada-website.vercel.app/index.html

---

## Funcionalidades

- **Calendário de jogos** — próximos e últimos jogos do Flamengo, com escalações, via integração com a API da Cartola/Globo
- **Bolão** — sistema de apostas por sorteio com gerenciamento de slots, pagamentos e resultado
- **Cardápio** — menu do bar com preços diferenciados para associados e não-associados
- **Loja** — catálogo de produtos com foto e gestão de estoque
- **Notícias** — publicação e listagem de notícias do consulado
- **Painel Admin** — CRUD completo de todas as entidades, com autenticação JWT e perfis `admin` / `super-admin`

---

## Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla ES6+), Web Components API |
| Backend | Node.js, Express.js v5 |
| Banco de dados | MongoDB (driver nativo) |
| Validação | Zod |
| Autenticação | JWT + bcrypt |
| Upload de arquivos | Multer |
| Ícones | RemixIcon |

---

## Estrutura do Projeto

```
flaquixada-website/
├── backend/                  # API REST (Express.js)
│   ├── src/
│   │   ├── app.js            # Entry point do servidor
│   │   ├── config/           # Conexão com MongoDB e índices
│   │   ├── controllers/      # Handlers das rotas
│   │   ├── models/           # Modelos com validação Zod
│   │   ├── routes/           # Definição das rotas
│   │   ├── services/         # Lógica de negócio e scraping da API Globo
│   │   └── middlewares/      # Autenticação JWT
│   └── .env.example
│
├── admin/                    # Painel administrativo (frontend estático)
│   ├── index.html
│   └── js/ css/
│
├── js/
│   ├── components/           # Web Components reutilizáveis
│   ├── pages/                # Scripts por página
│   ├── services/             # Camada de chamadas à API
│   └── utils/
│
├── css/                      # Folhas de estilo
├── public/                   # Assets estáticos (imagens, fontes)
├── index.html                # Home pública
├── bolao.html
├── cardapio.html
├── loja.html
├── noticias.html
└── login.html
```
## Disclaimer:
Este projeto é um trabalho da disciplina de Desenvolvimento de Software para Web. O propósito foi consolidar os conhecimentos básicos de HTML, CSS e JavaScript. Com foco em demonstrar o domínio sobre as tecnologias essenciais da web.
