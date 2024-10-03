import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LeftButton, RightButton } from "./SliderButton";

import { ServiceAndGatheringInfo } from "../../components/AboutUs/ServiceAndGatheringInfo";

const Section5 = ({ fullpageApi }) => (
  <div className="section5Body">
    {/* <LeftButton fullpageApi={fullpageApi} />
              <RightButton fullpageApi={fullpageApi} /> */}
    <div className="slide" data-anchor="time">
      <TableContainer
        className="table"
        // component={Paper}
        sx={{ color: "white" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan="3"
                align="center"
                sx={{ fontWeight: "bold", color: "inherit" }}
              >
                <LeftButton
                  style={{ display: "none" }}
                  fullpageApi={fullpageApi}
                />
                예배 및 모임 안내
                <RightButton fullpageApi={fullpageApi} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ServiceAndGatheringInfo.map((service) => (
              <TableRow key={service.title}>
                <TableCell align="center" sx={{ color: "white" }}>
                  {service.title}
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  {service.time}
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  {service.place}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

    <div className="slide" data-anchor="offering">
      <LeftButton fullpageApi={fullpageApi} />
      <Typography variant="h5" fontWeight="800" sx={{ color: "white" }}>
        온라인 E-Transfer 헌금
      </Typography>
      <Typography variant="subtitle1" fontWeight="500" sx={{ color: "white" }}>
        이메일: occeoffer@gmail.com
        <br />
        비밀번호: occe0403
      </Typography>
      <br />
      <Typography variant="h5" fontWeight="800" sx={{ color: "white" }}>
        Cheque 헌금
      </Typography>
      <Typography variant="subtitle1" fontWeight="500" sx={{ color: "white" }}>
        Pay To : OCCE 또는 ON Community Church of Edmonton
        <br />
        <br />
        현장에서는 준비된 봉투를 사용하여 입구에서 헌금함에 헌금해 주시기
        바랍니다. 헌금봉투 10개를 한 묶음으로 따로 준비해 놓았으니, 필요하신
        분들은 한 묶음 씩 가져 가셔서 헌금 준비를 해주시기 바랍니다.
      </Typography>
    </div>
  </div>
);

export default Section5;
