import { useCallback, useEffect, useState } from "react";

// import ReactFlow, { useNodesState, useEdgesState } from "reactflow";

// import "reactflow/dist/style.css";
import { Typography } from "@mui/material";

import "./NewComers.css";
import NewComersTimeline from "./NewComersTimeline";

// const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     position: { x: 0, y: 0 },
//     draggable: false,
//     deletable: false,
//     data: { label: "방문카드 작성" },
//     style: { width: 300 },
//   },
//   {
//     id: "2",
//     position: { x: 0, y: 75 },
//     draggable: false,
//     deletable: false,
//     data: {
//       label: "등록 \n QR코드 온라인 등록 또는 오프라인 등록 양식 작성",
//     },
//     style: { width: 300 },
//   },
//   {
//     id: "3",
//     position: { x: 0, y: 160 },
//     draggable: false,
//     deletable: false,
//     data: {
//       label: "새가족 교육 \n 4주 과정, 주일 오후 4시 15분 새가족실(1층 미팅룸)",
//     },
//     style: { width: 300 },
//   },
//   {
//     id: "4",
//     position: { x: 0, y: 250 },
//     draggable: false,
//     deletable: false,
//     data: { label: "소그룹(정원) 배치" },
//     style: { width: 300 },
//   },
//   {
//     id: "5",
//     type: "output",
//     position: { x: 0, y: 325 },
//     draggable: false,
//     deletable: false,
//     data: { label: "새가족 환영회" },
//     style: { width: 300 },
//   },
// ];

// const initialEdges = [
//   {
//     id: "e1-2",
//     deletable: false,
//     animated: true,
//     focusable: false,
//     markerEnd: { type: "arrow" },
//     source: "1",
//     target: "2",
//   },
//   {
//     id: "e2-3",
//     deletable: false,
//     animated: true,
//     focusable: false,
//     markerEnd: { type: "arrow" },
//     source: "2",
//     target: "3",
//   },
//   {
//     id: "e3-4",
//     deletable: false,
//     animated: true,
//     focusable: false,
//     markerEnd: { type: "arrow" },
//     source: "3",
//     target: "4",
//   },
//   {
//     id: "e4-5",
//     deletable: false,
//     animated: true,
//     focusable: false,
//     markerEnd: { type: "arrow" },
//     source: "4",
//     target: "5",
//   },
// ];

const NewComers = () => {
  // const [nodes] = useNodesState(initialNodes);
  // const [edges] = useEdgesState(initialEdges);

  // const size = useWindowSize();
  // const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // const onInit = useCallback((reactFlowInstance) => {
  //   setReactFlowInstance(reactFlowInstance);
  // }, []);

  // useEffect(() => {
  //   if (reactFlowInstance) {
  //     reactFlowInstance.fitView();
  //   }
  // }, [size, reactFlowInstance]);

  return (
    <div style={{ margin: "1em" }}>
      <h1>새가족</h1>
      <Typography sx={{ fontSize: "1.1em", color: "black" }}>
        에드먼턴 온 교회에 오신 여러분을 환영합니다.<br></br> 교회에 처음 오신
        분들과 개인 사정으로 이주해 오신 분들, 신앙의 회복을 위해 새로이 나아
        오신 분들 모두를 환영합니다.<br></br>새 공동체의 울타리 안에서 새로운
        시작을 하시는 모든 분들을 새가족으로 지칭하며 환영합니다.<br></br>온
        맘을 다해 하나님을 사랑하고 온 힘을 다해 이웃을 사랑하는 공동체의
        구성원으로 함께 세워져 가길 소원합니다. <br></br>에드먼턴 온 공동체의
        가족이 되심을 기쁨으로 환영합니다. 아래와 같은 과정을 통해 온 공동체의
        가족으로 함께 하게 됩니다.
      </Typography>
      {/* <div id="flowContainer" style={{ width: "100%", height: "60vh" }}>
        <ReactFlow
          onInit={onInit}
          nodes={nodes}
          edges={edges}
          fitView
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          panOnDrag={false}
          edgesUpdatable={false}
          nodesConnectable={false}
        ></ReactFlow>
      </div> */}

      <NewComersTimeline />
    </div>
  );
};

export default NewComers;
