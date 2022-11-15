import styled from 'styled-components';

const ButtonAA = styled.button`
  width: 90px;
  height: 35px;
  position: relative;
  border: none;
  display: inline-block;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  color: #444;
  background-color: #8ec3b0;
  :hover {
    letter-spacing: 1px;
    transform: scale(1.1);
    cursor: pointer;
  }
`;
const ButtonBB = styled.button`
  width: 120px;
  height: 35px;
  position: relative;
  border: none;
  display: inline-block;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  color: #444;
  background-color: #8ec3b0;
  :hover {
    letter-spacing: 1px;
    transform: scale(1.1);
    cursor: pointer;
  }
`;
const ButtonCC = styled.button`
  width: 150px;
  height: 35px;
  position: relative;
  border: none;
  display: inline-block;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  color: #444;
  background-color: #8ec3b0;
  :hover {
    letter-spacing: 1px;
    transform: scale(1.1);
    cursor: pointer;
  }
`;

export const ButtonA = () => {
  return <ButtonAA>로그인</ButtonAA>;
};

export const ButtonB = () => {
  return <ButtonBB>버튼 중</ButtonBB>;
};

export const ButtonC = () => {
  return <ButtonCC>임시비밀번호 받기</ButtonCC>;
};
