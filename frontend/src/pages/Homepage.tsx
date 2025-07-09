import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import Students from "../assets/students.svg";

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <StyledImage src={Students} alt="students" />
                </Grid>

                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <StyledTitle>Welcome to <br /> School Management <br /> System</StyledTitle>
                        <StyledText>
                            Effortlessly manage school administration, track student progress, 
                            and streamline communication between students, teachers, and faculty.
                        </StyledText>

                        <StyledBox>
                            <StyledLink to="/choose">
                                <NeonButton variant="contained" fullWidth>
                                    Login
                                </NeonButton>
                            </StyledLink>

                            <StyledLink to="/chooseasguest">
                                <GlowingButton variant="outlined" fullWidth>
                                    Login as Guest
                                </GlowingButton>
                            </StyledLink>

                            <StyledText>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{ color: "#FFD700", fontWeight: "bold" }}>
                                    Sign up
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #8e44ad, #3498db);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 6s ease infinite;
  color: white;
  padding: 16px;
  overflow: auto;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled.div`
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  text-align: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 1s ease-in-out;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 960px) {
    padding: 1.5rem;
  }
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  transition: transform 0.4s ease-in-out;
  margin: 0 auto;
  display: block;

  &:hover {
    transform: scale(1.05) rotate(3deg);
  }

  @media (max-width: 960px) {
    max-width: 400px;
  }
  @media (max-width: 600px) {
    max-width: 100%;
    margin-bottom: 1rem;
  }
`;

const neonGlow = keyframes`
  from { text-shadow: 0 0 10px rgba(255, 0, 255, 0.6); }
  to { text-shadow: 0 0 20px rgba(255, 255, 0, 0.9); }
`;

const StyledTitle = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: bold;
  background: linear-gradient(90deg, #ff00ff, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  line-height: 1.2;
  animation: ${neonGlow} 1.5s ease-in-out infinite alternate;

  @media (max-width: 600px) {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }
`;

const StyledText = styled.p`
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  margin: 1rem 0;
  color: rgb(120, 192, 5);
  opacity: 0.9;

  @media (max-width: 600px) {
    font-size: clamp(0.8rem, 2vw, 1rem);
  }
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 600px) {
    gap: 8px;
    padding: 0.5rem;
  }
`;

const NeonButton = styled(Button)`
  background: linear-gradient(90deg, #ff0080, #ffcc00);
  color: white;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 15px rgba(255, 0, 128, 0.8);

  &:hover {
    background: linear-gradient(90deg, #ffcc00, #ff0080);
    transform: scale(1.05);
    box-shadow: 0px 0px 25px rgba(255, 0, 128, 1);
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
  }
`;

const glowingEffect = keyframes`
  0% { box-shadow: 0px 0px 10px rgba(0, 255, 128, 0.6); }
  50% { box-shadow: 0px 0px 20px rgba(0, 255, 128, 1); }
  100% { box-shadow: 0px 0px 10px rgba(0, 255, 128, 0.6); }
`;

const GlowingButton = styled(Button)`
  color: #fff;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: bold;
  padding: 10px 20px;
  border: 2px solid #00ff80;
  border-radius: 8px;
  background: transparent;
  animation: ${glowingEffect} 2s infinite;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(0, 255, 128, 0.2);
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;