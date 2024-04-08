import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export default function PerfModal({ open, handleClose, student }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Performance Details - {student.student_usn}</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Total Marks: {student.total_marks}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Obtained Marks: {student.marks}
        </Typography>
        <Table>
          <TableBody>
            {student.performance.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{ verticalAlign: "top" }}>
                  <Typography variant="body1">
                    <span style={{ fontWeight: "bold" }}>Question:</span>{" "}
                    {item.question}
                  </Typography>
                </TableCell>
                <TableCell style={{ verticalAlign: "top" }}>
                  <Typography variant="body1">
                    <span style={{ fontWeight: "bold" }}>Answer key:</span>{" "}
                    {item.key}
                  </Typography>
                </TableCell>
                <TableCell style={{ verticalAlign: "top" }}>
                  <Typography variant="body1">
                    <span style={{ fontWeight: "bold" }}>Student Answer:</span>{" "}
                    {item.answer}
                  </Typography>
                </TableCell>
                <TableCell align="center" style={{ verticalAlign: "top" }}>
                  <Typography variant="body1">
                    <span style={{ fontWeight: "bold" }}>Marks Obtained:</span>{" "}
                    {item.marks}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
