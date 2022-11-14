import {
  LongLoginNavbarBox,
  MiniLoginNavbarBox,
} from '../../Component/Common/Navbar';
import styled from 'styled-components';
import { Sidebar } from '../../Component/Common/Sidebar';
import { BoardList } from '../../Component/Board/BoardList';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 1000px;
  height: 1000px;
  justify-content: left;
  border: 3px solid #800000;
`;

const SidebarSpace = styled.div`
  display: flex;
  width: 15%;
  height: 1000px;
  flex-direction: row;
  justify-content: left;
  border: 1px solid #00ff00;
`;

const TitleBox = styled.div`
  display: flex;
  border: 1px solid #008000;
  height: 100px;
  margin-left: 20px;
`;

const PostListSpace = styled.div`
  display: flex;
  width: 85%;
  height: 1000px;
  flex-direction: column;
  justify-content: left;
  border: 1px solid #00ff00;
`;

export const AssetBoardPage = () => {
  return (
    <>
      <LongLoginNavbarBox />
      <MiniLoginNavbarBox />
      <PageContainer>
        <SidebarSpace>
          <Sidebar></Sidebar>
        </SidebarSpace>
        <PostListSpace>
          <TitleBox>Title</TitleBox>
          <BoardList></BoardList>
        </PostListSpace>
      </PageContainer>
    </>
  );
};
