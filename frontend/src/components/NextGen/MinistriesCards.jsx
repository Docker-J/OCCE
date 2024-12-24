import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const MinistriesCards = ({ ministries }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        overflow: "auto",
      }}
    >
      {ministries.map((ministry) => (
        <Card key={ministry.title} sx={{ minWidth: "300px", margin: "12px" }}>
          <CardContent>
            <CardHeader title={ministry.title} />
            <Typography>{ministry.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MinistriesCards;
