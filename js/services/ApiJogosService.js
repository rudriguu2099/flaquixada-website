const API_BASE_URL = 'http://localhost:4000/api';

export async function fetchJogos() {
    try {
        const response = await fetch(`${API_BASE_URL}/fixtures/calendar`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success || !data.data) {
            return [];
        }

        const rawGames = data.data;

        // Processa e adapta os jogos para o formato esperado pelo frontend
        const jogosAdaptados = rawGames.map(jogo => {
            const dateObj = new Date(jogo.dataIso);
            
            // Formatadores
            const diaSemana = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase();
            // Ex: "24 DE MAIO"
            const dia = dateObj.getDate().toString().padStart(2, '0');
            const mes = dateObj.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();
            const dataExtenso = `${dia} DE ${mes}`;
            const dataFormatada = dateObj.toLocaleDateString('pt-BR'); // dd/mm/yyyy
            const horario = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let statusTipo = 'notstarted';
            if (jogo.placar && jogo.placar.status === 'Encerrado') statusTipo = 'finished';
            else if (jogo.placar) statusTipo = 'inprogress';

            let escudoMandante = jogo.mandante.logo;
            let escudoVisitante = jogo.visitante.logo;
            let nomeMandante = jogo.mandante.nome;
            let nomeVisitante = jogo.visitante.nome;
            
            // Força o escudo oficial do Flamengo se for um logo genérico do Cartola
            const urlEscudoOficial = 'https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png';

            if (nomeMandante.toUpperCase().includes('FLAMENGO')) {
                escudoMandante = urlEscudoOficial;
            }
            if (nomeVisitante.toUpperCase().includes('FLAMENGO')) {
                escudoVisitante = urlEscudoOficial;
            }

            let placarFinal = jogo.placar;

            // Se o Flamengo for visitante, invertemos as posições para que ele apareça sempre primeiro
            if (nomeVisitante.toUpperCase().includes('FLAMENGO') && !nomeMandante.toUpperCase().includes('FLAMENGO')) {
                // Inverte nomes e escudos
                let tempNome = nomeMandante;
                nomeMandante = nomeVisitante;
                nomeVisitante = tempNome;

                let tempEscudo = escudoMandante;
                escudoMandante = escudoVisitante;
                escudoVisitante = tempEscudo;

                // Inverte o placar, se existir
                if (placarFinal) {
                    placarFinal = {
                        casa: jogo.placar.visitante,
                        visitante: jogo.placar.casa,
                        status: jogo.placar.status
                    };
                }
            }

            return {
                id: jogo.id,
                timeCasa: nomeMandante,
                escudoCasa: escudoMandante,
                timeFora: nomeVisitante,
                escudoFora: escudoVisitante,
                campeonato: jogo.campeonato || 'Campeonato',
                faseRodada: jogo.rodada || 'Rodada',
                horario: horario,
                diaSemana: diaSemana,
                dataExtenso: dataExtenso,
                dataFormatada: dataFormatada,
                statusTipo: statusTipo,
                placar: placarFinal // null ou invertido se Fla for visitante
            };
        });

        const emAndamento = jogosAdaptados.filter(j => j.statusTipo === 'inprogress');
        const naoIniciados = jogosAdaptados.filter(j => j.statusTipo === 'notstarted').sort((a, b) => new Date(a.dataIso) - new Date(b.dataIso));
        const encerrados = jogosAdaptados.filter(j => j.statusTipo === 'finished').sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso));

        // Junta tudo com a prioridade correta
        const listaCompleta = [...emAndamento, ...naoIniciados, ...encerrados];

        // Filtra apenas jogos do Flamengo
        const jogosFlamengo = listaCompleta.filter(jogo => 
            jogo.timeCasa.toUpperCase().includes('FLAMENGO') || 
            jogo.timeFora.toUpperCase().includes('FLAMENGO')
        );

        // Pega os outros jogos do Brasileirão que NÃO são do Flamengo
        const outrosJogos = listaCompleta.filter(jogo => 
            !jogo.timeCasa.toUpperCase().includes('FLAMENGO') && 
            !jogo.timeFora.toUpperCase().includes('FLAMENGO')
        );

        // Junta tudo: Flamengo primeiro, depois os outros
        const listaMista = [...jogosFlamengo, ...outrosJogos];

        // Limita a exibição para no máximo 4 jogos totais (1 destaque + 3 na sanfona)
        return listaMista.slice(0, 4);

    } catch (error) {
        console.error("Erro ao buscar jogos da API:", error);
        return [];
    }
}
