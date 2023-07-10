import style from "./styles.module.css";

function Button(props) {
  const { answer, onClick, disabled } = props;

  const handleClick = () => {
    onClick(answer);
  };

  return (
    <div className={style.btn}>
      <a
        href="###"
        //mudança de estado quando certo ou errado no botão com css
        className={`${style.a} ${
          answer === props.selectedAnswer ? style.activeButton : ""
        } ${answer === props.wrongButton ? style.activeButtonWrong : ""} ${
          disabled ? style.disabled : ""
        }`}
        //passando o nome da resposta e o index como props e desativando o botão quando não ativo
        onClick={() => {
          handleClick(answer, props.index);
        }}
        disabled={disabled}
      >
        {answer}
      </a>
    </div>
  );
}

export default Button;
