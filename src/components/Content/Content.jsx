import Button from "../Button/Button";
import style from "./styles.module.css";
import React, { useEffect, useState } from "react";
import questions from "../../../data/questions.json";

//função antiga para usar o json como API porém não funcionava para subir no github;

// async function getQuestions() {
//   let response = await fetch("http://localhost:5173/data/questions.json");
//   let data = await response.json();
//   return data.questions;
// }

console.log("Start");

function Content() {
  const [data, setData] = useState([]); //array com todas as perguntas;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0); //estado que verifica se ainda existem perguntas a serem respondidas;
  const [selectedAnswer, setSelectedAnswer] = useState(null); //estado que verifica a resposta correta;
  const [wrongButton, setWrongButton] = useState(null); //estado que verifica a resposta errada;
  const [countCorrect, setCountCorrect] = useState(0); //estado que armazena a quantidade de respostas corretas;
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false); //estado que muda a pagina e retira os botões assim que todas as perguntas forem respondidas;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); //estado que desativa os botões entre uma pergunta e outra por conta do setTimeOut;

  //hook que formata e embaralha as perguntas e respostas;
  useEffect(() => {
    const totalQuestions = questions.questions.length; //numero total de pergnuntas;
    const randomIndexes = getRandomIndexes(totalQuestions, 20); //retorna um array de indices aleatórios com o total de numero desejado (20);

    //mapeando e formatando cada indice de pergunta
    const formattedQuestions = randomIndexes.map((index) => {
      const question = questions.questions[index]; //pergunta correspondente ao indice atual do mapeamento;

      //randomizando as opções de perguntas, mapeando para cada opção e criando um novo objeto com a propriedade 'text' que é o texto da opção e 'correctAnswerIndex' que é o indice correto da resposta, depois .sort para randomizar as opções aleatóriamente;
      const randomizedOptions = question.options
        .map((option, optionIndex) => ({
          text: option,
          correctAnswerIndex: optionIndex,
        }))
        .sort(() => Math.random() - 0.5);

      //retornando um objeto representando a pergunta formatada e espalhando as propriedades existentas da pergunta substituindo a propriedade 'options' pelo array de opções randomizadas;
      return {
        ...question,
        options: randomizedOptions,
      };
    });

    setData(formattedQuestions); //passando o array de perguntas formatadas para a variavel 'data';
  }, []);

  //função que gera indices aleatórios para selecionar elementos de um array
  function getRandomIndexes(max, count) {
    const indexes = Array.from(Array(max).keys());
    const randomIndexes = [];

    while (randomIndexes.length < count) {
      const randomIndex = Math.floor(Math.random() * indexes.length);
      randomIndexes.push(indexes[randomIndex]);
      indexes.splice(randomIndex, 1);
    }

    return randomIndexes;
  }

  //verificar se o data está vazio
  useEffect(() => {
    if (data.length > 0) {
      setSelectedQuestionIndex(0);
    }
  }, [data]);

  //verificador que chama a proxima pergunta dentro do data
  const handleNextQuestion = () => {
    if (selectedQuestionIndex < data.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    } else {
      setAllQuestionsAnswered(true);
    }
  };

  //função que valida a pergunta com a resposta correta, soma a pontuação e chama a proxima pergunta com delay após a validação
  const handleClick = (value) => {
    const selectedQuestion = data[selectedQuestionIndex];
    const selectedOption = selectedQuestion.options[value];

    if (
      selectedOption.correctAnswerIndex === selectedQuestion.correctAnswerIndex
    ) {
      setSelectedAnswer(selectedOption.text);
      setWrongButton(null);
      setCountCorrect(countCorrect + 1);
    } else {
      setSelectedAnswer(null);
      setWrongButton(selectedOption.text);
    }

    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsButtonDisabled(false);
      handleNextQuestion();
    }, 500);
  };

  return (
    <div className={style.container}>
      {allQuestionsAnswered ? (
        <div className={style.questionDiv}>
          <p>
            Você concluiu todas as {data.length} perguntas!
            <br />
            Você acertou <strong>{countCorrect}</strong>.
          </p>
        </div>
      ) : (
        <div className={style.allContent}>
          <div className={style.questionDiv}>
            {data.length > 0 && data[selectedQuestionIndex].question}
          </div>
          <div className={style.buttonDiv}>
            {data.length > 0 &&
              data[selectedQuestionIndex].options.map((answer, index) => (
                <Button
                  selectedAnswer={selectedAnswer}
                  wrongButton={wrongButton}
                  answer={answer.text}
                  key={index}
                  index={index}
                  onClick={() => handleClick(index)}
                  disabled={isButtonDisabled}
                  className={isButtonDisabled ? style.disabled : ""}
                >
                  {answer.text}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
