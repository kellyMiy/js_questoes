class PerguntasDAO {
    constructor() {
        const perguntas = [
            {
                id: 1,
                enunciadoHTML: "Substitua o <b>??</b> com a estrutura condicional para entrar no IF:\nif (49 ?? 55) {\n    return true;\n}",
                alternativas: ["<", ">", "<=", ">="],
                indiceResposta: 0,
                info: "Isso mesmo, a resposta certa é:\n\nif (49 <b>&lt</b> 55) {\n    return true;\n}"
            },
            {
                id: 2,
                enunciadoHTML: "Qual o tipo da variável declarada na seguinte expressão:\nvar numero = '123'",
                alternativas: ["number", "string", "boolean", "NaN"],
                indiceResposta: 1,
                info: "Isso mesmo, apesar do nome da váriavel ser 'numero' como seu valor é passado com aspas ele na verdade é uma <b>string</b>"
            },
            {
                id: 3,
                enunciadoHTML: "Qual a seguinte opção reflete as boas práticas para nome de variaveis?",
                alternativas: ["const last#name = Souza", "var 0-first-name = 'Maria'", "const loveCoffe = false", "let 1234 = 'numeros'"],
                indiceResposta: 2,
                info: "Isso mesmo, a resposta correta é const loveCoffe = false pois ela não utiliza caracteres especiais e numeros."
            },
            {
                id: 4,
                enunciadoHTML: "Substitua o ?? da estrutura de repetição:\n<b>??</b>(var i = 0; i &lt 9; i++){\n console.log(i);\n }",
                alternativas: ["function", "const", "let", "for"],
                indiceResposta: 3,
                info: "Isso mesmo, a resposta correta é a estrutura de repetição: <b>for</b>(var i = 0; i &lt 9; i++){\n console.log(i);\n }"
            },
            {
                id: 5,
                enunciadoHTML: "O que está faltando na expressão abaixo?\nfunction(){\n console.log('exibir');\n }",
                alternativas: ["nome da variável", "declaração de parametro", "nome da função", "retorno da função"],
                indiceResposta: 3,
                info: "Isso mesmo, toda função precisa de um nome."
            },
            {
                id: 6,
                enunciadoHTML: "o que irá aparecer no seu console?\n var first_name = 'Hello';\n var last_name = 'Word';\n   console.log(first_name + last_name);\n ",
                alternativas: ["HelloWord", "Hello Word", "hello word", "helloWord"],
                indiceResposta: 0,
                info: "Isso mesmo, quando foi feita a concatenção não foi atibuido o espaço."
            },
            {
                id: 7,
                enunciadoHTML: "Quais alternativas abaixo aparece apenas estruturas de iteração?",
                alternativas: [ "function e for","for e while", "if e while", "switch e function"],
                indiceResposta: 1,
                info: "Isso mesmo, function, if e switch <b>NÃO</b> são estruturas de iteração. "
            },
            {
                id: 8,
                enunciadoHTML: "Qual o resultado dessa expressão:\n var idade = 16;\n var idade = 18;\n console.log('idade: ' + idade);",
                alternativas: [ "idade:18","idade:16", "idade: 16", "idade: 18"],
                indiceResposta: 3,
                info: "Isso mesmo, a resposta correta é idade: 18 pois o JavaScript sobrescreve a variável quando ela é redeclarada."
            },
            {
                id: 9,
                enunciadoHTML: "Qual é a saida?\n const numeros = { a: 'um', b:'dois' , a: 'quatro'}\n  console.log(numeros);",
                alternativas: [
                    "{ a: 'um', b: 'dois', a: 'um'}","{ a: 'quatro', b: 'dois'}", "{ a: 'um', b: 'dois'}", "{ a: 'quatro', b: 'um'}"],
                indiceResposta: 1,
                info: "Isso mesmo, assim como variaveis o JavaScript também sobrescreve propriedade de objetos quando redeclarados"
            },
            {
                id: 10,
                enunciadoHTML: "Qual o resultado da operação?\nif(1 == '1')\n  console.log('certo')\n else{\n  console.log('errado')\n}",
                alternativas: [
                    "erro na operação","errado", "certo", "NaN"],
                indiceResposta: 2,
                info: "Isso mesmo, quando usamos o == para comparação o JavaScript converte os valores para o mesmo tipo e depois os compara.\nSe usassemos o === estariamos comparando o tipo da variável também então o resultado seria diferente."
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