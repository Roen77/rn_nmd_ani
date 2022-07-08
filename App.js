import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
//애니메이션 컴포넌트를 만들면서 스타일쓰기 첫번째방법
// const Box = styled(Animated.createAnimatedComponent(TouchableOpacity))`
//   background-color: tomato;
//   width: 200px;
//   height: 200px;
// `;

// 두번째방법
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  //애니메이션은 setState에 두지말기
  // const Y = new Animated.Value(0);

  const Y_POSITION = useRef(new Animated.Value(0)).current;
  const [up, setUp] = useState(false);

  const toggleUp = () => setUp(prev => !prev);
  //애니메이션은 애니메이션 컴포넌트에서만 사용가능하다.
  const moveUp = () => {
    Animated.timing(Y_POSITION, {
      toValue: up ? 200 : -200,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start(toggleUp);
    // Animated.spring(Y_POSITION, {
    //   toValue: 200,
    //   // bounciness: 15,
    //   tension: 50,
    //   friction: 1,
    //   useNativeDriver: true,
    // }).start();
  };

  Y_POSITION.addListener(() => console.log(Y_POSITION));
  useEffect(() => {}, []);
  console.log('rendering');
  return (
    <Container>
      <TouchableOpacity onPress={moveUp}>
        <AnimatedBox style={{transform: [{translateY: Y_POSITION}]}} />
      </TouchableOpacity>
    </Container>
  );
}
