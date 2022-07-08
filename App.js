import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, TouchableOpacity} from 'react-native';
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

  const POSITION = useRef(new Animated.ValueXY({x: 0, y: 300})).current;
  const [up, setUp] = useState(false);

  const toggleUp = () => setUp(prev => !prev);
  //애니메이션은 애니메이션 컴포넌트에서만 사용가능하다.
  const moveUp = () => {
    Animated.timing(POSITION, {
      toValue: up ? 300 : -300,
      //native에서 제공해주지 않는 애니메이션도있으니 작동안되면 아래꺼 false로하면됨
      useNativeDriver: false,
      duration: 1000,
      // easing: Easing.bounce,
    }).start(toggleUp);
    // Animated.spring(Y_POSITION, {
    //   toValue: 200,
    //   // bounciness: 15,
    //   tension: 50,
    //   friction: 1,
    //   useNativeDriver: true,
    // }).start();
  };
  const rotation = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ['-360deg', '360deg'],
  });
  // const opacity = Y_POSITION.interpolate({
  //   // Y_POSITION 이 -300 ,0, 300인 경우를 알고 싶다.
  //   inputRange: [-300, 0, 300],
  //   // 매칭하면됨 -300이면 아웃풋은1로, 0이면 0.5로 ..
  //   outputRange: [1, 0.5, 1],
  //   // inputRange와 outputRange 길이가 같아야함
  // });
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ['rgb(255, 99, 71)', 'rgb(71, 166, 255)'],
  });

  console.log('rendering');
  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            backgroundColor: bgColor,
            transform: [{rotateY: rotation}, {translateY: POSITION.y}],
          }}
        />
      </Pressable>
    </Container>
  );
}
