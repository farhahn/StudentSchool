// frontend/src/pages/Teacher/TeacherHomePage.js
import { Container, Grid, Paper } from '@mui/material';
import SeeNotice from '../../components/SeeNotice.tsx';
import styled from 'styled-components';

const TeacherHomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <SeeNotice />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

export default TeacherHomePage;