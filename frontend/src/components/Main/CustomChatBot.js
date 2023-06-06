import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f5f8fb",
  // fontFamily: "Helvetica Neue",
  headerBgColor: "#f57c00",
  headerFontColor: "#fff",
  headerFontSize: "18px",
  botBubbleColor: "#f57c00",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

const steps = [
  {
    id: "welcome",
    message: "에드먼튼 온교회에 오신 것을 환영합니다! 무엇을 도와드릴까요?",
    trigger: "options-questions",
    hideInput: true,
  },
  {
    id: "options-questions",
    options: [
      { value: 1, label: "예배장소", trigger: "place" },
      { value: 2, label: "예배시간", trigger: "time" },
      { value: 3, label: "문의하기", trigger: "ask-name" },
    ],
    hideInput: true,
  },
  {
    id: "place",
    message: "주일 예배 장소는 9419 95 St, Edmonton, AB 입니다",
    trigger: "welcome",
    hideInput: true,
  },
  {
    id: "time",
    message: "주일 예배 시간은 2시 30분 입니다.",
    trigger: "welcome",
    hideInput: true,
  },
  {
    id: "ask-name",
    message: "성함을 입력해주세요",
    trigger: "answer-name",
    hideInput: true,
  },
  {
    id: "answer-name",
    user: true,
    trigger: "ask-contact-method",
  },
  {
    id: "ask-contact-method",
    message: "원하시는 연락 방법을 선택해주세요",
    trigger: "answer-contact-method",
    hideInput: true,
  },
  {
    id: "answer-contact-method",
    options: [
      { value: 1, label: "이메일", trigger: "ask-email" },
      { value: 2, label: "전화번호", trigger: "ask-phone" },
    ],
    hideInput: true,
  },
  {
    id: "ask-email",
    message: "이메일을 입력해주세요",
    trigger: "answer-email",
    hideInput: true,
  },
  {
    id: "answer-email",
    user: true,
    trigger: "ask-content",
  },
  {
    id: "ask-phone",
    message: "전화번호를 입력해주세요",
    trigger: "answer-phone",
    hideInput: true,
  },
  {
    id: "answer-phone",
    user: true,
    trigger: "ask-content",
  },
  {
    id: "ask-content",
    message: "문의사항을 입력해주세요",
    trigger: "answer-content",
    hideInput: true,
  },
  {
    id: "answer-content",
    user: true,
  },
  {
    id: "ask-content",
    message: "문의사항이 접수되었습니다.",
    trigger: "welcome",
    hideInput: true,
  },
];

const CustomChatBot = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        headerTitle="에드먼턴온교회"
        botAvatar="apple-icon.png"
        floating={true}
        hideUserAvatar={true}
        botDealy={250}
        userDelay={500}
        //   floatingIcon={<QuestionAnswerOutlinedIcon />}
        steps={steps}
      />
    </ThemeProvider>
  );
};

export default CustomChatBot;
