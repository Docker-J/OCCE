/**
 * @file GardenAttendanceTable.jsx
 * @description 정원별 출석 현황 테이블 및 개별 행 컴포넌트
 */

import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

const GardenAttendanceTableRow = ({ stat, onOpenDetail }) => {
  const barColor =
    stat.rate >= 80 ? "#16a34a" : stat.rate >= 60 ? "#ea580c" : "#dc2626";

  return (
    <TableRow
      hover
      onClick={() => onOpenDetail(stat.gardenName)}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.04)" },
      }}
    >
      {/* 보고 상태 */}
      <TableCell sx={{ py: 2 }}>
        {stat.reported ? (
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: "1rem !important", color: "#16a34a !important" }} />}
            label="보고완료"
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "rgba(22, 163, 74, 0.1)",
              color: "#16a34a",
              border: "1px solid rgba(22, 163, 74, 0.25)",
            }}
          />
        ) : (
          <Chip
            icon={<ErrorOutlineIcon sx={{ fontSize: "1rem !important", color: "#ea580c !important" }} />}
            label="미보고"
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "rgba(234, 88, 12, 0.1)",
              color: "#ea580c",
              border: "1px solid rgba(234, 88, 12, 0.25)",
            }}
          />
        )}
      </TableCell>

      {/* 정원명 */}
      <TableCell sx={{ py: 2, fontWeight: 700, color: "#1e293b" }}>
        {stat.gardenName}
      </TableCell>

      {/* 총원 */}
      <TableCell align="center" sx={{ py: 2, fontWeight: 600, color: "#475569" }}>
        {stat.total}명
      </TableCell>

      {/* 출석 인원 */}
      <TableCell align="center" sx={{ py: 2, fontWeight: 700, color: "#16a34a" }}>
        {stat.attended}명
      </TableCell>

      {/* 결석 인원 */}
      <TableCell align="center" sx={{ py: 2, fontWeight: 600, color: "#dc2626" }}>
        {stat.absent}명
      </TableCell>

      {/* 출석률 프로그레스 바 */}
      <TableCell align="center" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
          <LinearProgress
            variant="determinate"
            value={stat.rate}
            sx={{
              width: 90,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: barColor,
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: barColor,
              width: 45,
              textAlign: "right",
            }}
          >
            {stat.rate}%
          </Typography>
        </Box>
      </TableCell>

      {/* 상세 보기 버튼 */}
      <TableCell align="center" sx={{ py: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(stat.gardenName);
          }}
          sx={{
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 700,
            borderColor: "rgba(234, 88, 12, 0.4)",
            color: "#ea580c",
            py: 0.3,
            px: 1.2,
            minWidth: 70,
            "&:hover": {
              borderColor: "#ea580c",
              backgroundColor: "rgba(234, 88, 12, 0.08)",
            },
          }}
        >
          상세보기
        </Button>
      </TableCell>
    </TableRow>
  );
};

GardenAttendanceTableRow.propTypes = {
  stat: PropTypes.shape({
    gardenName: PropTypes.string.isRequired,
    reported: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    attended: PropTypes.number.isRequired,
    absent: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
  }).isRequired,
  onOpenDetail: PropTypes.func.isRequired,
};

const GardenAttendanceTable = ({
  stats,
  sortField,
  sortDirection,
  onSort,
  onOpenDetail,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            정원별 출석 현황
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            총 {stats.length}개 정원
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, width: 110 }}>
                  보고 상태
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                  <TableSortLabel
                    active={sortField === "gardenName"}
                    direction={sortDirection}
                    onClick={() => onSort("gardenName")}
                  >
                    정원명
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                  <TableSortLabel
                    active={sortField === "total"}
                    direction={sortDirection}
                    onClick={() => onSort("total")}
                  >
                    총원
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                  <TableSortLabel
                    active={sortField === "attended"}
                    direction={sortDirection}
                    onClick={() => onSort("attended")}
                  >
                    출석
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                  <TableSortLabel
                    active={sortField === "absent"}
                    direction={sortDirection}
                    onClick={() => onSort("absent")}
                  >
                    결석
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8, minWidth: 160 }}>
                  <TableSortLabel
                    active={sortField === "rate"}
                    direction={sortDirection}
                    onClick={() => onSort("rate")}
                  >
                    출석률
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8, width: 100 }}>
                  상세
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#888" }}>
                    등록된 정원 출석 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((g) => (
                  <GardenAttendanceTableRow
                    key={g.gardenName}
                    stat={g}
                    onOpenDetail={onOpenDetail}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

GardenAttendanceTable.propTypes = {
  stats: PropTypes.array.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  onOpenDetail: PropTypes.func.isRequired,
};

export default GardenAttendanceTable;
