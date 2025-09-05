'use client';

import CountUp from 'react-countup';

interface AnimatedNumberProps {
  end: number;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ end, suffix, className }) => {
  return (
    <CountUp
      end={end}
      duration={2.75}
      separator=","
      suffix={suffix}
      className={className}
      enableScrollSpy
      scrollSpyDelay={300}
    />
  );
};

export default AnimatedNumber;
