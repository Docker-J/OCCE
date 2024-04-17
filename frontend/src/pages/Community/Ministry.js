import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "../NextGen/NextGen.css";
import { Link } from "react-router-dom";
import { MinistryList } from "./MinistryList";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("/img/Community/Ministry.webp")',
  backgroundPositionX: "58%",
  backgroundPositionY: "56%",
};

const Ministry = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            사역
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" fontWeight={800}>
            정원 순환 사역
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            주일 안내팀과 친교팀은 각 팀 staff의 안내에 따라 매달 순서를 맡은
            소그룹 <Link to="/community/smallgroup">'정원'</Link>이 순환하여
            섬깁니다.
          </Typography>

          <br />

          <Typography variant="h5" fontWeight={800}>
            온 교회 사역 지원
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            교회에 필요한 사역 지원을 수시로 받고 있습니다. 허락하신 달란트대로
            주의 몸 된 교회를 함께 세우고, 온 맘과 온 힘을 다해 하나님과 이웃을
            사랑하는 공동체가 되길 소망합니다. 아래의 사역 분야를 참고해 주시고,
            온라인 링크를 통하여 지원해 주시면 감사하겠습니다.
          </Typography>
          <br />
          <Stack
            component="a"
            target="__blank"
            href="https://forms.gle/5kGFLfA5fhfotVTW6"
            direction="row"
          >
            <Typography>사역 지원하기</Typography>
            <OpenInNewIcon />
          </Stack>

          <TableContainer component={Paper} sx={{ my: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {MinistryList.map((ministry) => (
                    <TableCell key={ministry.title}>
                      <Typography noWrap fontWeight={650}>
                        {ministry.title}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ...Array(
                    Math.max(...MinistryList.map((item) => item.types.length))
                  ),
                ].map((_, index) => (
                  <TableRow>
                    {MinistryList.map((item) => (
                      <TableCell key={item.types[index]}>
                        <Typography fontSize="1em" noWrap>
                          {item.types[index]}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Ministry;
