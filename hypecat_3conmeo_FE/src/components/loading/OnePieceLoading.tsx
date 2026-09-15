import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Types
interface DotProps {
  delay: number;
}

interface OnePieceLoadingProps {
  onComplete?: () => void;
  autoReset?: boolean;
  loadingSpeed?: number;
}

// Custom animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const wave1 = keyframes`
  0% { d: path("M0,300 Q150,200 300,300 T600,300 T900,300 T1200,300 V600 H0 Z"); }
  50% { d: path("M0,300 Q150,400 300,300 T600,300 T900,300 T1200,300 V600 H0 Z"); }
  100% { d: path("M0,300 Q150,200 300,300 T600,300 T900,300 T1200,300 V600 H0 Z"); }
`;

const wave2 = keyframes`
  0% { d: path("M0,350 Q200,250 400,350 T800,350 T1200,350 V600 H0 Z"); }
  50% { d: path("M0,350 Q200,450 400,350 T800,350 T1200,350 V600 H0 Z"); }
  100% { d: path("M0,350 Q200,250 400,350 T800,350 T1200,350 V600 H0 Z"); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 0.8; transform: translateY(0); }
`;

const sailAnimation = keyframes`
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(8px) rotate(1deg); }
  75% { transform: translateX(-8px) rotate(-1deg); }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const flagWave = keyframes`
  0% { transform: skewX(0deg) scaleX(1); }
  25% { transform: skewX(-5deg) scaleX(0.95); }
  50% { transform: skewX(0deg) scaleX(1); }
  75% { transform: skewX(5deg) scaleX(1.05); }
  100% { transform: skewX(0deg) scaleX(1); }
`;

const flagRipple = keyframes`
  0%, 100% { 
    clipPath: polygon(0% 0%, 100% 0%, 95% 20%, 100% 40%, 90% 60%, 100% 80%, 95% 100%, 0% 100%);
  }
  50% { 
    clipPath: polygon(0% 0%, 100% 0%, 90% 20%, 95% 40%, 100% 60%, 85% 80%, 100% 100%, 0% 100%);
  }
`;

// Styled components
const LoadingContainer = styled(Box)<object>(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #60a5fa, #3b82f6, #1d4ed8)',
  position: 'relative',
  overflow: 'hidden',
}));

const WaveBackground = styled(Box)<object>(() => ({
  position: 'absolute',
  inset: 0,
  opacity: 0.2,
  '& svg': {
    width: '100%',
    height: '100%',
  },
}));

const Wave1Path = styled('path')<object>(() => ({
  animation: `${wave1} 3s ease-in-out infinite`,
}));

const Wave2Path = styled('path')<object>(() => ({
  animation: `${wave2} 4s ease-in-out infinite`,
}));

const MainLuffyFlagContainer = styled(Box)<object>(({theme}) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const LuffyFlagMain = styled(Box)<object>(() => ({
  width: 120,
  height: 80,
  margin: '0 auto',
  marginBottom: 16,
  position: 'relative',
  animation: `${gentleFloat} 3s ease-in-out infinite`,
}));

const FlagPole = styled(Box)<object>(() => ({
  width: 4,
  height: 120,
  backgroundColor: '#8B4513',
  position: 'absolute',
  left: -10,
  top: -20,
  boxShadow: '2px 0 4px rgba(0,0,0,0.3)',
}));

const FlagCloth = styled(Box)<object>(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  border: '2px solid #333',
  position: 'relative',
  animation: `${flagWave} 2s ease-in-out infinite, ${flagRipple} 3s ease-in-out infinite`,
  transformOrigin: 'left center',
  boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
}));

const GlowEffect = styled(Box)<object>(() => ({
  position: 'absolute',
  inset: -10,
  width: 140,
  height: 100,
  margin: '0 auto',
  borderRadius: '8px',
  backgroundColor: '#fde047',
  opacity: 0.2,
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  left: -20,
}));

const LuffyFlag = styled(Box)<object>(({ theme }) => ({
  width: 64,
  height: 64,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  animation: `${gentleFloat} 2.5s ease-in-out infinite`,
  color: 'white',
}));

const LoadingText = styled(Typography)<object>(({ theme }) => ({
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  letterSpacing: '0.1em',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}));

const BoatProgressContainer = styled(Box)<object>(({ theme }) => ({
  width: 350,
  height: 100,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  position: 'relative',
}));

const BoatSvg = styled('svg')<object>(() => ({
  width: '100%',
  height: '100%',
  animation: `${sailAnimation} 4s ease-in-out infinite`,
}));

const ProgressText = styled(Typography)<object>(() => ({
  position: 'absolute',
  bottom: -25,
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));

const BouncingDots = styled(Box)<object>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const Dot = styled(Box)<DotProps>(({ delay}) => ({
  width: 12,
  height: 12,
  backgroundColor: 'white',
  borderRadius: '50%',
  animation: `${bounce} 1s infinite`,
  animationDelay: `${delay}s`,
}));

const QuoteText = styled(Typography)<object>(({ theme }) => ({
  marginTop: theme.spacing(4),
  color: 'white',
  fontSize: '1.125rem',
  opacity: 0.8,
  maxWidth: 400,
  textAlign: 'center',
  animation: `${fadeIn} 2s ease-out`,
}));

const OnePieceLoading: React.FC<OnePieceLoadingProps> = ({ 
  onComplete,
  autoReset = true,
  loadingSpeed = 80
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress: number) => {
        if (prevProgress >= 100) {
          if (onComplete) {
            onComplete();
          }
          return autoReset ? 0 : 100;
        }
        return prevProgress + 1;
      });
    }, loadingSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [onComplete, autoReset, loadingSpeed]);

  const bounceDelays: number[] = [0, 0.2, 0.4];

  return (
    <LoadingContainer>
      {/* Ocean waves background */}
      <WaveBackground>
        <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
          <Wave1Path 
            d="M0,300 Q150,200 300,300 T600,300 T900,300 T1200,300 V600 H0 Z" 
            fill="rgba(255,255,255,0.1)"
          />
          <Wave2Path 
            d="M0,350 Q200,250 400,350 T800,350 T1200,350 V600 H0 Z" 
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </WaveBackground>

      <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Main Luffy Flag */}
        <MainLuffyFlagContainer>
          <GlowEffect />
          <LuffyFlagMain>
            <FlagPole />
            <FlagCloth>
              <svg viewBox="0 0 120 80" style={{ width: '100%', height: '100%' }}>
                {/* Skull base */}
                <circle cx="60" cy="35" r="20" fill="white" stroke="#333" strokeWidth="1.5"/>
                
                {/* Straw hat on skull */}
                <ellipse cx="60" cy="25" rx="25" ry="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
                <rect x="35" y="22" width="50" height="6" fill="#dc2626"/>
                
                {/* Hat texture lines */}
                <path d="M38 28 Q60 26 82 28" stroke="#ca8a04" strokeWidth="0.5" fill="none"/>
                <path d="M40 31 Q60 29 80 31" stroke="#ca8a04" strokeWidth="0.5" fill="none"/>
                
                {/* Eye sockets */}
                <circle cx="52" cy="33" r="4" fill="black"/>
                <circle cx="68" cy="33" r="4" fill="black"/>
                
                {/* Nose triangle */}
                <polygon points="60,38 56,44 64,44" fill="black"/>
                
                {/* Grinning mouth */}
                <path d="M48 48 Q60 54 72 48" stroke="black" strokeWidth="2.5" fill="none"/>
                <rect x="50" y="47" width="3" height="5" fill="black"/>
                <rect x="55" y="47" width="3" height="5" fill="black"/>
                <rect x="62" y="47" width="3" height="5" fill="black"/>
                <rect x="67" y="47" width="3" height="5" fill="black"/>
                
                {/* Crossbones behind skull */}
                <g transform="rotate(45 60 40)">
                  <rect x="20" y="38" width="80" height="4" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="25" cy="40" r="6" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="95" cy="40" r="6" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="22" cy="36" r="2.5" fill="white"/>
                  <circle cx="22" cy="44" r="2.5" fill="white"/>
                  <circle cx="98" cy="36" r="2.5" fill="white"/>
                  <circle cx="98" cy="44" r="2.5" fill="white"/>
                </g>
                <g transform="rotate(-45 60 40)">
                  <rect x="20" y="38" width="80" height="4" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="25" cy="40" r="6" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="95" cy="40" r="6" fill="white" stroke="#333" strokeWidth="0.8"/>
                  <circle cx="22" cy="36" r="2.5" fill="white"/>
                  <circle cx="22" cy="44" r="2.5" fill="white"/>
                  <circle cx="98" cy="36" r="2.5" fill="white"/>
                  <circle cx="98" cy="44" r="2.5" fill="white"/>
                </g>
              </svg>
            </FlagCloth>
          </LuffyFlagMain>
        </MainLuffyFlagContainer>

        {/* Secondary Luffy Flag */}
        <LuffyFlag>
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'white',
            border: '2px solid #333',
            borderRadius: '4px',
            animation: `${flagWave} 1.8s ease-in-out infinite`,
            transformOrigin: 'center center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg viewBox="0 0 64 64" style={{ width: '100%', height: '100%' }}>
              {/* Skull base */}
              <circle cx="32" cy="28" r="12" fill="white" stroke="#333" strokeWidth="1"/>
              
              {/* Straw hat on skull */}
              <ellipse cx="32" cy="22" rx="15" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1"/>
              <rect x="17" y="20" width="30" height="3" fill="#dc2626"/>
              
              {/* Eye sockets */}
              <circle cx="28" cy="26" r="2" fill="black"/>
              <circle cx="36" cy="26" r="2" fill="black"/>
              
              {/* Nose triangle */}
              <polygon points="32,29 30,33 34,33" fill="black"/>
              
              {/* Grinning mouth */}
              <path d="M26 35 Q32 38 38 35" stroke="black" strokeWidth="1.5" fill="none"/>
              <rect x="27" y="34" width="1.5" height="3" fill="black"/>
              <rect x="30" y="34" width="1.5" height="3" fill="black"/>
              <rect x="33" y="34" width="1.5" height="3" fill="black"/>
              <rect x="36" y="34" width="1.5" height="3" fill="black"/>
              
              {/* Crossbones */}
              <g transform="rotate(45 32 32)">
                <rect x="12" y="30" width="40" height="2" fill="white" stroke="#333" strokeWidth="0.5"/>
                <circle cx="15" cy="31" r="3" fill="white" stroke="#333" strokeWidth="0.5"/>
                <circle cx="49" cy="31" r="3" fill="white" stroke="#333" strokeWidth="0.5"/>
              </g>
              <g transform="rotate(-45 32 32)">
                <rect x="12" y="30" width="40" height="2" fill="white" stroke="#333" strokeWidth="0.5"/>
                <circle cx="15" cy="31" r="3" fill="white" stroke="#333" strokeWidth="0.5"/>
                <circle cx="49" cy="31" r="3" fill="white" stroke="#333" strokeWidth="0.5"/>
              </g>
            </svg>
          </Box>
        </LuffyFlag>

        {/* Loading text */}
        <LoadingText>
          SETTING SAIL
        </LoadingText>

        {/* Boat-shaped progress bar */}
        <BoatProgressContainer>
          <BoatSvg viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Gradient for water */}
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
              
              {/* Gradient for boat hull */}
              <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              
              {/* Clip path for boat shape */}
              <clipPath id="boatClip">
                <path d="M40 60 Q175 45 310 60 Q310 70 175 75 Q40 70 40 60" />
              </clipPath>
            </defs>
            
            {/* Sea waves under boat */}
            <path 
              d="M20 75 Q100 70 175 75 T330 75 L330 85 Q175 80 20 85 Z" 
              fill="rgba(255,255,255,0.3)"
            />
            
            {/* Boat hull outline */}
            <path 
              d="M40 60 Q175 45 310 60 Q310 70 175 75 Q40 70 40 60" 
              fill="url(#hullGradient)"
              stroke="#654321"
              strokeWidth="2"
            />
            
            {/* Wood planks on hull */}
            <path d="M50 62 Q175 50 300 62" stroke="#654321" strokeWidth="1" fill="none"/>
            <path d="M45 67 Q175 55 305 67" stroke="#654321" strokeWidth="1" fill="none"/>
            
            {/* Progress fill (water filling the boat) */}
            <rect 
              x="40" 
              y="45" 
              width={`${(progress / 100) * 270}`}
              height="30" 
              fill="url(#waterGradient)"
              clipPath="url(#boatClip)"
              opacity="0.8"
            />
            
            {/* Main mast */}
            <rect x="173" y="15" width="4" height="35" fill="#8B4513"/>
            
            {/* Main sail */}
            <path 
              d="M180 20 Q210 17 230 20 L230 40 Q210 37 180 40 Z" 
              fill="white"
              stroke="#ddd"
              strokeWidth="1"
            />
            
            {/* Sail details */}
            <line x1="185" y1="22" x2="225" y2="22" stroke="#ddd" strokeWidth="0.5"/>
            <line x1="185" y1="30" x2="225" y2="30" stroke="#ddd" strokeWidth="0.5"/>
            <line x1="185" y1="38" x2="225" y2="38" stroke="#ddd" strokeWidth="0.5"/>
            
            {/* Luffy's flag on sail */}
            <g transform="translate(205, 30) scale(0.3)">
              <circle cx="0" cy="0" r="6" fill="white" stroke="black" strokeWidth="0.5"/>
              <ellipse cx="0" cy="-3" rx="7" ry="2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.3"/>
              <rect x="-7" y="-4" width="14" height="1" fill="#dc2626"/>
              <circle cx="-2" cy="0" r="1" fill="black"/>
              <circle cx="2" cy="0" r="1" fill="black"/>
              <line x1="-10" y1="0" x2="10" y2="0" stroke="white" strokeWidth="1"/>
              <line x1="-7" y1="-3" x2="7" y2="3" stroke="white" strokeWidth="0.8"/>
              <line x1="7" y1="-3" x2="-7" y2="3" stroke="white" strokeWidth="0.8"/>
            </g>
            
            {/* Secondary mast */}
            <rect x="120" y="25" width="3" height="25" fill="#8B4513"/>
            
            {/* Secondary sail */}
            <path 
              d="M125 30 Q140 28 150 30 L150 45 Q140 43 125 45 Z" 
              fill="white"
              stroke="#ddd"
              strokeWidth="1"
            />
            
            {/* Pirate flag on main mast */}
            <g transform="translate(175, 15)">
              <rect x="0" y="0" width="18" height="12" fill="white" stroke="#333" strokeWidth="0.5"/>
              <rect x="0" y="0" width="18" height="12" fill="white" stroke="#333" strokeWidth="0.5"
                    style={{
                      animation: `${flagWave} 1.5s ease-in-out infinite`,
                      transformOrigin: 'left center',
                      clipPath: 'polygon(0% 0%, 100% 0%, 90% 20%, 100% 40%, 85% 60%, 100% 80%, 95% 100%, 0% 100%)'
                    }}
              />
              <g transform="translate(9, 6) scale(0.15)" style={{ animation: `${flagWave} 1.5s ease-in-out infinite` }}>
                <circle cx="0" cy="0" r="8" fill="white" stroke="#333" strokeWidth="1"/>
                <ellipse cx="0" cy="-4" rx="10" ry="3" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8"/>
                <rect x="-10" y="-5" width="20" height="2" fill="#dc2626"/>
                <circle cx="-3" cy="0" r="1.5" fill="black"/>
                <circle cx="3" cy="0" r="1.5" fill="black"/>
                <line x1="-15" y1="0" x2="15" y2="0" stroke="white" strokeWidth="1.5"/>
                <line x1="-10" y1="-5" x2="10" y2="5" stroke="white" strokeWidth="1"/>
                <line x1="10" y1="-5" x2="-10" y2="5" stroke="white" strokeWidth="1"/>
              </g>
            </g>
            
            {/* Bow decoration */}
            <path d="M40 60 Q35 55 40 50" stroke="#fbbf24" strokeWidth="2" fill="none"/>
            
            {/* Stern decoration */}
            <path d="M310 60 Q315 55 310 50" stroke="#fbbf24" strokeWidth="2" fill="none"/>
          </BoatSvg>
          
          <ProgressText>
            {Math.round(progress)}% Loaded
          </ProgressText>
        </BoatProgressContainer>

        {/* Bouncing dots */}
        <BouncingDots>
          {bounceDelays.map((delay: number, i: number) => (
            <Dot key={i} delay={delay} />
          ))}
        </BouncingDots>

        {/* Adventure quote */}
        <QuoteText>
          "The treasure you seek is out there..."
        </QuoteText>
      </Box>
    </LoadingContainer>
  );
};

export default OnePieceLoading;