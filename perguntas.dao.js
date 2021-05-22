class PerguntasDAO {
    constructor() {
        const perguntas = [
            {
                id: 1,
                categoria: "Condicionais",
                dificuldade: 1,
                enunciadoHTML: "Substitua o <b>??</b> com a estrutura condicional para entrar no IF:\nif (49 ?? 55) {\n    return true;\n}",
                alternativas: ["<", ">", "<=", ">="],
                indiceResposta: 0,
                info: "Isso mesmo, a resposta certa é:\n\nif (49 <b>&lt</b> 55) {\n    return true;\n}"
            },
            {
                id: 2,
                categoria: "Condicionais",
                dificuldade: 1,
                enunciadoHTML: "Qual o tipo da variável declarada na seguinte expressão:\nvar numero = '123'",
                alternativas: ["number", "string", "boolean", "NaN"],
                indiceResposta: 1,
                info: "Isso mesmo, apesar do nome da váriavel ser 'numero' como seu valor é passado com aspas ele na verdade é uma <b>string</b>"
            },
            {
                id: 3,
                categoria: "Condicionais",
                dificuldade: 1,
                enunciadoHTML: "Qual a seguinte opção reflete regras e boas práticas para nome de variaveis?",
                alternativas: ["const last_name = 'Souza'", "var 0-first-name = 'Maria'", "const loveCoffe = false", "let 1234 = 'numeros'"],
                indiceResposta: 2,
                info: "Isso mesmo, PENDENTE"
            },
            {
                id: 4,
                categoria: "Condicionais",
                dificuldade: 1,
                enunciadoHTML: "Substitua o ?? da estrutura de repetição:\n??(var i = 0; i &lt 9; i++){\n console.log(i);\n }",
                alternativas: ["function", "const", "let", "for"],
                indiceResposta: 3,
                info: "Isso mesmo, PENDENTE"
            },
            {
                id: 5,
                categoria: "Condicionais",
                dificuldade: 1,
                enunciadoHTML: "lalallalal Substitua o ?? da estrutura de repetição:\n??(var i = 0; i &lt 9; i++){\n console.log(i);\n }",
                alternativas: ["function", "const", "let", "for"],
                indiceResposta: 3,
                info: "Isso mesmo, PENDENTE"
            }
        ];

        this.consultarTodasAsPerguntas = () => [...perguntas];

        this.consultarPerguntaPorId = (id) => {
            return perguntas.find(x => x.id === id);
        };
    }
}

module.exports = {
    PerguntasDAO: PerguntasDAO
}