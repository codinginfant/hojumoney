import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AssetBdata } from '../../Component/Asset/Asset_B_Data';
import AssetSetting from '../../Component/Asset/AssetSetting';
import {
  LongNavbarBox,
  MiniNavbarBox,
} from '../../Component/Common/NavebarRev';
import AssetList from '../../Component/Asset/AssetList';
import axios from 'axios';
import AuthContext from '../../store/AuthContext';

const GuideBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 10px;
  width: 650px;
  height: auto;
  text-align: left;
  border-top: 5px solid #8ec3b0;
  border-bottom: 5px solid #8ec3b0;
  margin-bottom: 50px;
  color: grey;
  .TextHeader {
    text-align: center;
    color: #9ed5c5;
    width: 550px;
  }
  .Text {
    font-size: 17px;
  }
  .Hilight {
    color: #8ec3b0;
  }
`;

const PageContain = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .Contain {
    display: flex;
    flex-direction: column;
    /* margin-top: 30px;*/
    margin-left: 500px;
  }
`;

const ChartContain = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 750px;
  height: 400px;
  position: fixed !important;
  margin-top: 100px;
  margin-left: -800px;
`;
const ChartBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 750px;
  height: 350px;
`;

const BoxContain = styled.div`
  display: flex;
  flex-direction: column;
  display: inline-block;
  align-items: center;
  box-sizing: border-box;
  width: 650px;
  height: 1000px;
  top: 30px !important;
  left: 300px;
  margin-left: 100px;
  margin-top: 100px;
`;

const GraphH1 = styled.h1`
  box-sizing: border-box;
  height: 100px;
  width: 100%;
  align-items: center;
  text-align: center;
  text-shadow: 1px 1px 2px #bcead5;
  color: #bcead5;
  font-size: 40px;
`;

const AssetTargetPage = () => {
  const authCtx = useContext(AuthContext);
  const memberid = authCtx.parseJwt.id;
  // const tokenAxios = () => {
  //   const loginData = {
  //     email: 'hoju5@gmail.com',
  //     password: 'password5',
  //   };

  //   axios.post(`${url}/member/login`, loginData).then((res) => {
  //     const { accessToken } = res.headers.authorization;
  //     // token이 필요한 API 요청 시 header Authorization에 token 담아서 보내기
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  //     console.log(res.headers.authorization);
  //   });
  // };
  const url = process.env.REACT_APP_API_URL;
  const [goal, setGoal] = useState(''); // 명칭
  const [extended, setExtended] = useState(''); // 목표금액
  const [period, setPeriod] = useState(''); // 기간
  const [target, setTarget] = useState('');
  const [render, setRender] = useState(0);
  const [goalName, setGoalName] = useState(''); //목표명
  const [goalPrice, setGoalPrice] = useState(''); //목표금액
  const [targetLength, setTargetLength] = useState(''); //목표기간
  const [up, setUp] = useState(0); //저축횟수
  const [countList, setCountList] = useState([]);
  // const [graphData, setGraphData] = useState([])
  // const [calculatedPrice, setCalculatedPrice] =useState('')

  let monthly = Math.ceil(extended / period);
  if (isNaN(monthly)) {
    monthly = 0;
  } else if (monthly === Infinity) {
    monthly = 0;
  }

  const targetAmount = monthly
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

  // let calculatedMonthly = Math.ceil(goalPrice / targetLength);
  let percentage = Math.ceil((monthly / period) * 100);
  if (isNaN(percentage)) {
    percentage = 0;
  }

  let nowPercentage = percentage * up;
  if (isNaN(nowPercentage)) {
    nowPercentage = 0;
  }
  // console.log(nowPercentage);
  // console.log(percentage);
  // console.log(up);
  // const graphData = [
  //   {
  //     name: countList[0].goalName,
  //     목표율: 100,
  //     현재: (countList[0].targetLength / countList[0].goalPrice) * 100,
  //     amt: 2400,
  //   },
  // ];

  const handlerGoal = (e) => {
    setGoal(e.target.value);
  };
  const handlerExtended = (e) => {
    setExtended(e.target.value);
  };
  const handlerPeriod = (e) => {
    setPeriod(e.target.value);
  };
  const handlerTarget = (e) => {
    setTarget(e.target.value);
  };
  const goalNameonChange = (e) => {
    setGoalName(e.target.value);
  };

  const goalPriceonChange = (e) => {
    setGoalPrice(e.target.value);
  };

  const targetLengthonChange = (e) => {
    setTargetLength(e.target.value);
  };

  useEffect(() => {
    const goalGet = async () => {
      try {
        const res = await axios.get(`${url}/${memberid}/goal`);
        setCountList(res.data._embedded.responseList);
        setUp(res.data._embedded.responseList.completed);
        setUp(res.data._embedded.responseList.incompleted);
        console.log('get', res);
      } catch (err) {
        console.log('error', err);
      }
    };
    goalGet();
  }, [render]);

  const goalPost = async () => {
    const postdata = {
      goalName: goal,
      goalPrice: extended,
      targetLength: period,
      calculatedPrice: targetAmount,
    };
    try {
      const res = await axios.post(`${url}/${memberid}/goal`, postdata);

      setGoal('');
      setExtended('');
      setPeriod('');
      setTarget('');
      setRender((el) => el + 1);
      console.log('post', res);
      // if (countList.length < 6) return;
      // alert('최대 6개의 목표를 설정할 수 있습니다');
    } catch (err) {
      console.log('error', err);
    }
  };
  const goalDelete = async (e) => {
    try {
      const res = await axios.delete(
        `${url}/${memberid}/goal/${e.target.dataset.id}`
      );
      setRender((el) => el + 1);
      console.log('dataset.id', e.target.dataset.id);
      console.log('삭제', res);
    } catch (err) {
      console.log('deleteerror', err);
    }
  };

  const goalPatch = async (e) => {
    const patchdata = {
      goalName: goalName,
      goalPrice: goalPrice,
      targetLength: targetLength,
      // calculatedPrice: calculatedPrice,
    };
    try {
      const res = await axios.patch(
        `${url}/${memberid}/goal/${e.target.dataset.id}`,
        patchdata
      );
      setRender((el) => el + 1);

      console.log('patch', res);
      console.log('patchId', e.target.dataset.id);
    } catch (err) {
      console.log('patcherror', err);
    }
  };

  const goalUpPatch = async (e) => {
    try {
      const res = await axios.patch(
        `${url}/${memberid}/goal/${e.target.dataset.id}/complete`
      );
      setUp(res.data.completed);
      console.log(res.data.completed);
    } catch (err) {
      console.log('up', err);
    }
  };

  const goalDownPatch = async (e) => {
    try {
      const res = await axios.patch(
        `${url}/${memberid}/goal/${e.target.dataset.id}/incomplete`
      );
      setUp(res.data.completed);
    } catch (err) {
      console.log('up', err);
    }
  };
  const GoalData = [
    {
      name: '목표',
      목표율: 100,
      달성률: 50,
      amt: 2400,
    },
  ];

  console.log(countList);

  for (let i = 0; i < countList.length; i++) {
    let countListData = {
      name: countList[i].goalName,
      목표율: 100,
      달성률:
        (countList[i].goalPrice /
          countList[i].targetLength /
          countList[i].goalPrice) *
        countList[i].completed *
        100,
      amt: 2400,
    };
    GoalData.push(countListData);
  }

  // for (let i = 0; i < countList.length; i++) {
  //   GoalData.push(countList[i].goalName);
  // }

  // for (let i = 0; i < countList.length; i++) {
  //   GoalData.push(
  //     (countList[i].goalPrice / countList[i].targetLength) *
  //       countList[i].completed *
  //       100
  //   );
  // }

  // countList.forEach(e){
  //   if(countList[0].goalName){
  //     GoalData.push(e)
  //   }
  // }
  // {
  //   GoalData
  //     ? GoalData.forEach((el) =>
  //         el.memberPosted.id === memberid ? GoalData.push(el.name) : null
  //       )
  //     : null;
  // }

  // {
  //   GoalData ? GoalData.forEach((el) => GoalData.push(el.달성률)) : null;
  // }
  // countList.map(goal);
  // const graphData = [
  //   {
  //     name: countList[0].goalName,
  //     목표율: 100,
  //     현재:
  //       (countList[0].calculatedPrice / countList[0].goalPrice) *
  //       100 *
  //       countList[0].completed,
  //     amt: 2400,
  //   },
  // ];
  // console.log(countList);
  // console.log(countList[0].goalName);
  // console.log(
  //   (countList[0].calculatedPrice / countList[0].goalPrice) *
  //     100 *
  //     countList[0].completed
  // );
  // useEffect(() => {
  //   goalGet();
  //   goalPost();
  //   goalDelete();
  //   tokenAxios();
  // }, [setGoal, setExtended, setPeriod]);
  // [setGoal, setExtended, setPeriod]
  return (
    <>
      <LongNavbarBox />
      <MiniNavbarBox />
      <>
        <PageContain>
          <ChartContain className="ScrollActive">
            <GraphH1>목표 현황</GraphH1>
            <ChartBox>
              <AssetBdata GoalData={GoalData}></AssetBdata>
              {/* {countList.map((count, id) => (
                <AssetBdata
                  count={count}
                  key={id}
                  goalName={goalName}
                  goalPrice={goalPrice}
                  GoalData={GoalData}
                />
              ))} */}
            </ChartBox>
          </ChartContain>
          {/* <LongListContain> */}
          <div className="Contain">
            <BoxContain>
              <GuideBox>
                <h2 className="TextHeader">목표 작성을 위한 안내</h2>
                <br />
                <p className="Text">
                  첫째, <span className="Hilight">&apos;나의 목표&apos;</span>에
                  목표를 작성해주세요.
                </p>
                <br />
                <p className="Text">
                  둘째, <span className="Hilight">START</span> 버튼을 클릭하면
                  목표리스트가 생성됩니다.
                </p>
                <br />
                <p className="Text">
                  셋째, 목표리스트의 <span className="Hilight">Saving</span>{' '}
                  버튼을 클릭하여 저축한 기간을 표시할 수 있습니다.
                </p>
                <br />
                <p className="Text">
                  *그래프를 통해 목표 달성률을 확인해보세요!*
                </p>
              </GuideBox>
              <AssetSetting
                goalPost={goalPost}
                countList={countList}
                handlerGoal={handlerGoal}
                handlerExtended={handlerExtended}
                handlerPeriod={handlerPeriod}
                handlerTarget={handlerTarget}
                goal={goal}
                extended={extended}
                period={period}
                target={target}
                targetAmount={targetAmount}
              />

              {countList.map((count, id) => (
                <AssetList
                  count={count}
                  key={id}
                  id={count.goalId}
                  goal={goal}
                  extended={extended}
                  period={period}
                  setGoal={setGoal}
                  setExtended={setExtended}
                  setPeriod={setPeriod}
                  target={target}
                  goalDelete={goalDelete}
                  targetAmount={targetAmount}
                  goalPatch={goalPatch}
                  goalNameonChange={goalNameonChange}
                  goalPriceonChange={goalPriceonChange}
                  targetLengthonChange={targetLengthonChange}
                  goalUpPatch={goalUpPatch}
                  up={up}
                  goalDownPatch={goalDownPatch}
                ></AssetList>
              ))}
            </BoxContain>
          </div>
          {/* </LongListContain> */}
        </PageContain>
      </>
    </>
  );
};

export default AssetTargetPage;
