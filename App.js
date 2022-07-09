import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  TouchableOpacity,
} from 'react-native';
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
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ['rgb(255, 99, 71)', 'rgb(71, 166, 255)'],
  });

  const panResponder = useRef(
    PanResponder.create({
      //터치가 감지되면 active로 전환할거냐??
      // view에서 터치를 감지할지 결정할수있도록해줌
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, {dx, dy}) => {
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      },
      onPanResponderRelease: () => {
        console.log('tocuh 끝남');
        Animated.spring(POSITION, {
          toValue: {
            x: 0,
            y: 0,
          },
          bounciness: 20,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
        style={{
          borderRadius,
          backgroundColor: bgColor,
          transform: POSITION.getTranslateTransform(),
        }}
      />
    </Container>
  );
}
